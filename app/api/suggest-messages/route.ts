import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: process.env.Default_Gemini_API_Key,
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const clickCount = parseInt(
      cookieStore.get("suggest_clicks")?.value || "0",
    );

    if (clickCount >= 3) {
      return NextResponse.json(
        {
          message:
            "You've reached the suggestion limit. Please log in to get more!",
        },
        { status: 403 },
      );
    }

    const prompt =
      "Create a list of three open-ended, engaging, and 'Gen-Z' style questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform (like Qooh.me) and should be relatable, casual, and fun. Use modern slang appropriately (e.g., 'lowkey', 'vibe', 'ick', 'roman empire') but ensure they remain understandable to a broad audience. Avoid sensitive topics. \n\nExample output format: 'What’s your current brain rot?||What’s a trend you lowkey actually like?||Rate your current vibe on a scale of 1-10'. \n\nEnsure the questions foster friendly interaction and positive vibes.";

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
      maxOutputTokens: 400,
    });

    const response = result.toTextStreamResponse();
    response.headers.append(
      "Set-Cookie",
      `suggest_clicks=${clickCount + 1}; Path=/; Max-Age=3600; SameSite=Lax`,
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}
