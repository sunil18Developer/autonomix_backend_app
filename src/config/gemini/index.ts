import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) throw new Error("GEMINI_API_KEY is missing");

export const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
});
