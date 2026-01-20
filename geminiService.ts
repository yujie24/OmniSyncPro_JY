
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeLink = async (url: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following URL and provide a structured JSON response. 
      URL: ${url}
      
      Tasks:
      1. Provide a title for the content.
      2. Categorize it (e.g., Work, Education, Tech, Life, Hobby).
      3. Summarize the main point in 2 sentences.
      4. Suggest a storage format (PDF, DOC, or PPT) based on the content type.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            summary: { type: Type.STRING },
            suggestedFormat: { type: Type.STRING }
          },
          required: ["title", "category", "summary", "suggestedFormat"]
        }
      }
    });

    // Access the text property directly as per the property definition in the guidelines
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "Unknown Content",
      category: "Uncategorized",
      summary: "Could not retrieve summary.",
      suggestedFormat: "WEB"
    };
  }
};
