
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function GET() {
  const email = process.env.SMTP_USER;
  
  if (!email) {
    return NextResponse.json(
      { success: false, message: "SMTP_USER is not defined in .env" },
      { status: 500 }
    );
  }

  try {
    const result = await sendVerificationEmail(
      email,
      "Test User",
      "123456"
    );

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Email sent to ${email}. Check your inbox!` 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error", 
      error: String(error) 
    }, { status: 500 });
  }
}
