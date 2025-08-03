import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create conversation history for context
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are an AI Resume Assistant specializing in helping users with resume optimization, job applications, and career advice. 

Your expertise includes:
- Resume writing and formatting tips
- ATS (Applicant Tracking System) optimization
- Job application strategies
- Interview preparation
- Career development advice
- Industry-specific resume guidance

Current conversation:
${conversationHistory}

Please provide helpful, professional, and actionable advice. Keep responses concise but informative. If the user asks about resume optimization, provide specific, actionable tips. If they ask about job applications, offer strategic guidance. Always maintain a supportive and encouraging tone.

Respond as the Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      message: text.trim(),
      role: "assistant"
    });

  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
