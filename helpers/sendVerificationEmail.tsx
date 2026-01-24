import { transporter } from "@/lib/nodemailer";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(<VerificationEmail username={username} otp={verifyCode} />);

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"Vox" <no-reply@vox.app>',
      to: email,
      subject: "Vox | Verification Code",
      html: emailHtml,
    });
    
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
