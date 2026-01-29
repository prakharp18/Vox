import { transporter } from "@/lib/nodemailer";
import ResetPasswordEmail from "@/emails/ResetPasswordEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";

export async function sendResetPasswordEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(<ResetPasswordEmail username={username} otp={verifyCode} />);

    console.time("EmailSend");
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"Vox" <no-reply@vox.app>',
      to: email,
      subject: "Vox | Reset Your Password",
      html: emailHtml,
    });
    console.timeEnd("EmailSend");
    
    return { success: true, message: "Reset password email sent successfully." };
  } catch (emailError) {
    console.error("Critical SMTP Error:", emailError);
    return { success: false, message: "Failed to send reset password email." };
  }
}
