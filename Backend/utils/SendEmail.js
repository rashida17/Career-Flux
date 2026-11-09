console.log("EMAIL_USER:", process.env.EMAIL_USER, "| PASS set:", !!process.env.EMAIL_PASS);
import nodemailer from "nodemailer";



export default function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter.sendMail({
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}