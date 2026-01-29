import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendPasswordChangedEmail } from "@/helpers/sendPasswordChangedEmail";
import { authRateLimiter } from "@/lib/rate-limit";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  newPassword: z.string().min(6),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await authRateLimiter.check(5, ip);
  } catch {
    return Response.json(
      {
        success: false,
        message: "Too many requests. Please try again later.",
      },
      { status: 429 },
    );
  }

  try {
    const { email, code, newPassword } = await request.json();
    const result = resetPasswordSchema.safeParse({ email, code, newPassword });

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({
      email,
      forgotPasswordCode: code,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or code",
        },
        { status: 400 },
      );
    }

    const isCodeExpired = new Date(user.forgotPasswordCodeExpiry!) < new Date();

    if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    
    user.forgotPasswordCode = undefined;
    user.forgotPasswordCodeExpiry = undefined;
    
    await user.save();

    try {
      const ip = request.headers.get("x-forwarded-for") || "Unknown IP";
      const userAgent = request.headers.get("user-agent") || "Unknown Device";
      const time = new Date().toLocaleString("en-US", { 
        timeZone: "Asia/Kolkata", 
        dateStyle: "medium", 
        timeStyle: "short" 
      });

      await sendPasswordChangedEmail(email, user.username, time, ip, userAgent);
    } catch (emailError) {
      console.error("Failed to send password changed email:", emailError);
    }

    return Response.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      {
        success: false,
        message: "Error resetting password",
      },
      { status: 500 },
    );
  }
}
