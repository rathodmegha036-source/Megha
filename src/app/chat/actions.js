"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(userPrompt, history) {
  try {
    const contents = []; //Input with context - Array

    // add previous conversation
    if (history && history.length) {
      for (let i = 0; i < history.length; i++) {
        const item = history[i];

        contents.push({
          role: "user",
          parts: [{ text: item.question }],
        });

        contents.push({
          role: "model",
          parts: [{ text: item.answer }],
        });
      }
    }

    // add new user question
    contents.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    return result.text || "No response text.";
  } catch (error) {
    console.error("AI Error:", error);
    return `Error: ${error.message}`;
  }
}