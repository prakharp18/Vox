import { sendResetPasswordEmail } from "@/helpers/sendResetPasswordEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { authRateLimiter } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await authRateLimiter.check(3, ip);
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
    const { email } = await request.json();
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid email address",
        },
        { status: 400 },
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    user.forgotPasswordCode = verifyCode;
    user.forgotPasswordCodeExpiry = expiryDate;
    await user.save();

    const emailResponse = await sendResetPasswordEmail(
      email,
      user.username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Reset password code sent to your email",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error asking for password reset:", error);
    return Response.json(
      {
        success: false,
        message: "Error sending reset code",
      },
      { status: 500 },
    );
  }
}
