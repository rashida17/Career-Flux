import nodemailer from "nodemailer";

export default function sendEmail({ to, subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,       // 587 starts plain, then upgrades with STARTTLS
    requireTLS: true,
    family: 4,           // use IPv4 only, skips the broken IPv6 route
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    connectionTimeout: 15000,
  });

  return transporter.sendMail({
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}