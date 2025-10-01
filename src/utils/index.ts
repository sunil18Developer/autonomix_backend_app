export function parseLLMJSON(text: string) {
  // Remove triple backticks and optional json tag
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}
