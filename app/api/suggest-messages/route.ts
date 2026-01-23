import { NextResponse } from "next/server";
import { questions } from "@/lib/questions";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    const text = selected.join('||');

    return NextResponse.json({ questions: text });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}