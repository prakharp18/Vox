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

    console.time("EmailSend");
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"Vox" <no-reply@vox.app>',
      to: email,
      subject: "Vox | Verification Code",
      html: emailHtml,
    });
    console.timeEnd("EmailSend");
    
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Critical SMTP Error:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
