import { GoogleGenAI } from "@google/genai";

const googleAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default googleAi;
