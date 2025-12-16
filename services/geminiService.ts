import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCourseSuggestions = async (keyword: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 creative and traditional sounding Chinese Martial Arts course names based on the keyword: "${keyword}". 
      Examples: "少林五形拳基础班", "武当太极剑进阶研修", "少儿武术启蒙".
      Keep them under 10 characters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text);
    return data.suggestions || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};