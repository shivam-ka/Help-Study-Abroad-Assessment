import { env } from "@/env";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { prompt, count } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { success: false, message: "Prompt is required" },
                { status: 400 }
            );
        }

        const recommendations = await generateCourseRecommendations(prompt, count);

        return NextResponse.json({
            success: true,
            data: recommendations,
        });
    } catch (error) {
        console.error("Error in course recommendation endpoint:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

const aiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

async function generateCourseRecommendations(prompt: string, count: number) {
    try {
        const systemPrompt = `
      [IMPORTANT] Respond ONLY with valid JSON array containing ${count} course recommendations.
      Each recommendation MUST have these exact fields and sort by matchScore high to low:
      - courseName (string)
      - universityName (string)
      - matchScore (number 0-100)
      - rationale (string) 30 to 50 words

      User's background/interests: ${prompt}

      Example response:
      [
        {
          "courseName": "Advanced Machine Learning",
          "universityName": "MIT",
          "matchScore": 95,
          "rationale": "Matches your interest in AI algorithms"
        }
      ]
    `;

        const response = await aiClient.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ text: systemPrompt }],
            config: {
                responseMimeType: "application/json",
            },
        });

        if (!response.text) {
            throw new Error("No response from Gemini API");
        }

        const data = JSON.parse(response.text);
        return data;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate recommendations");
    }
}
