import { Request, Response } from "express";
import { ai } from "../../config/gemini";
import { parseLLMJSON } from "../../utils";

export const generateTasks = async (req: Request, res: Response) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  const prompt = `
    You are an assistant that converts meeting transcripts into structured actionable tasks.
    Please parse the following transcript and output JSON in this format:

    {
      "tasks": [
        {
          "title": "...",
          "description": "...",
          "owner": "...",
          "priority": "...",
          "due": "...",
          "status": "..."
        }
      ]
    }

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

    res.json(tasks);
  } catch (error) {
    console.error("Error generating tasks:", error);
    res.status(500).json({ error: "Failed to generate tasks" });
  }
};
