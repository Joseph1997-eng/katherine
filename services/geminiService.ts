import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ActivityItem } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the runtime
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    safetyScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100, where 100 is perfectly safe and 0 is extremely dangerous.",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["SAFE", "LOW_RISK", "MODERATE_RISK", "HIGH_RISK"],
    },
    categories: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of potential issues found, e.g., 'Cyberbullying', 'Explicit Content', 'Violence', 'Phishing'.",
    },
    reasoning: {
      type: Type.STRING,
      description: "Detailed explanation of why this score was given.",
    },
    recommendation: {
      type: Type.STRING,
      description: "Actionable advice for the parent.",
    },
  },
  required: ["safetyScore", "riskLevel", "categories", "reasoning", "recommendation"],
};

export const analyzeContentSafety = async (
  text: string,
  imageBase64?: string,
  mimeType?: string
): Promise<AnalysisResult> => {
  try {
    const model = "gemini-2.5-flash";
    const parts: any[] = [];

    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      });
    }

    if (text) {
      parts.push({ text });
    } else if (!imageBase64) {
      throw new Error("No content provided for analysis");
    }

    const prompt = `
      You are a specialized Content Safety AI for parents. 
      Analyze the provided text and/or image which a child might encounter.
      Evaluate it for potential risks such as cyberbullying, predators, explicit material, violence, scams, or age-inappropriate themes.
      Provide a structured safety assessment.
    `;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a strict but fair parental safety assistant. Err on the side of caution for child safety."
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");

    return JSON.parse(resultText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const summarizeActivity = async (activities: ActivityItem[]): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const dataStr = JSON.stringify(activities);
    
    const response = await ai.models.generateContent({
      model,
      contents: `
        Here is a log of a child's digital activity over the last 24 hours:
        ${dataStr}
        
        Please provide a brief, friendly summary for the parent. 
        Highlight:
        1. Total screen time estimation.
        2. Dominant categories (e.g., too much gaming?).
        3. Any flagged apps that might need attention.
        4. A positive reinforcement or a gentle suggestion for balance.
        Keep it under 150 words.
      `,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Summary failed:", error);
    return "Unable to generate activity summary at this time.";
  }
};

export const createAdvisorChat = () => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
        You are GuardianAI, a supportive, non-judgmental, and knowledgeable parenting assistant.
        Your goal is to help parents navigate the digital world with their children.
        Provide practical advice on screen time, app safety, handling cyberbullying, and digital hygiene.
        Be concise, empathetic, and evidence-based.
      `,
    },
  });
};
