import { Request, Response } from "express";
import { ai } from "../../config/gemini";
import { parseLLMJSON } from "../../utils";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const formatStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pending";
    case "in progress":
      return "InProgress";
    case "completed":
      return "Completed";
    case "to do":
      return "ToDo";
    case "blocked":
      return "Blocked";
    default:
      return "Pending";
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    const safeTasks = tasks.map((t) => ({
      ...t,
      createdAt: Number(t.createdAt),
    }));
    res.json({ tasks: safeTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const generateTasks = async (req: Request, res: Response) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }
  const prompt = `
You are an assistant that converts meeting transcripts into structured actionable tasks.
Please parse the following transcript and output JSON in this format, strictly following these rules:

Task format:
{
  "tasks": [
    {
      "id": "random-uuid-string",          // UUID v4
      "title": "...",                       // short task title
      "description": "...",                 // detailed description
      "owner": "...",                       // responsible person
      "priority": "Low" | "Medium" | "High",
      "due": "YYYY-MM-DD" | null,          // use null if no due date
      "status": "Pending" | "In Progress" | "Completed" | "To Do" | "Blocked",
      "createdAt": 1735734100000           // Unix timestamp in milliseconds
    }
  ]
}

- Only use the values specified for "priority" and "status".
- "due" must be either a valid date string in "YYYY-MM-DD" format or null.
- "id" should be a randomly generated UUID v4 string.
- "createdAt" should be a Unix timestamp in milliseconds (e.g., Date.now()).
- Output valid JSON only, no extra text, no comments.

Transcript:
${transcript}
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = result?.text;
    if (!text)
      return res.status(500).json({ error: "No response from Gemini model" });

    let tasks;
    try {
      tasks = parseLLMJSON(text);
    } catch (err) {
      console.error("Failed to parse JSON from Gemini:", err, text);
      return res
        .status(500)
        .json({ error: "Invalid JSON response from Gemini" });
    }

    const insertedTasks = [];
    for (const t of tasks.tasks) {
      const inserted = await prisma.task.create({
        data: {
          id: t.id,
          title: t.title,
          description: t.description,
          owner: t.owner || "Unassigned",
          priority: t.priority === "P0" ? "High" : t.priority || "Medium",
          due: t.due ? new Date(t.due) : null,
          status: formatStatus(t.status),
          // created_at: t.createdAt || Math.floor(Date.now()),
          createdAt: t.createdAt || Math.floor(Date.now()),
        },
      });
      insertedTasks.push(inserted);
    }
    res.json(tasks);
  } catch (error) {
    console.error("Error generating tasks:", error);
    res.status(500).json({ error: "Failed to generate tasks" });
  }
};
