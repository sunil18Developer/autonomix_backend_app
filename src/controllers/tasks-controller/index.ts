import { Request, Response } from "express";

export const generateTasks = async (req: Request, res: Response) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }
  res.json({ tasks: ["Example Task 1", "Example Task 2"] });
};
