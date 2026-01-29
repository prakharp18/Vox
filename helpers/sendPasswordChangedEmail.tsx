import { transporter } from "@/lib/nodemailer";
import PasswordChangedEmail from "@/emails/PasswordChangedEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";

export async function sendPasswordChangedEmail(
  email: string,
  username: string,
  time: string,
  ip: string,
  device: string,
): Promise<ApiResponse> {
  try {
    const emailHtml = await render(
      <PasswordChangedEmail 
        username={username} 
        time={time} 
        ip={ip} 
        device={device} 
      />
    );

    console.time("EmailSend");
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL || '"Vox" <no-reply@vox.app>',
      to: email,
      subject: "Vox | Password Changed Successfully",
      html: emailHtml,
    });
    console.timeEnd("EmailSend");
    
    return { success: true, message: "Password changed email sent successfully." };
  } catch (emailError) {
    console.error("Critical SMTP Error:", emailError);
    return { success: false, message: "Failed to send password changed email." };
  }
}
