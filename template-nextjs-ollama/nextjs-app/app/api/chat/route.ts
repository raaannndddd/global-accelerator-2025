import { NextRequest, NextResponse } from "next/server";
import ollama from "ollama";

const model = process.env.MODEL;

export async function POST(request: NextRequest) {
  try {
    if (!model) {
      throw new Error("MODEL not set.");
    }

    const data = await request.json();
    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: data.message }],
    });
    return NextResponse.json({ message: response.message.content });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? JSON.stringify(error) },
      { status: 500 }
    );
  }
}
