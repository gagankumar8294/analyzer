import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY!;
export const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Get a Gemini model instance ready to use
 */
export function getModel() {
  return genAI.getGenerativeModel({ model: MODEL_NAME });
}

/**
 * Simple text generation helper
 * @param prompt - the prompt to send to Gemini
 * @returns the text response
 */
export async function generateText(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * JSON generation helper — asks Gemini to return valid JSON
 * @param prompt - the prompt (should instruct Gemini to return JSON)
 * @returns parsed JSON object
 */
export async function generateJSON<T>(prompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as T;
}
