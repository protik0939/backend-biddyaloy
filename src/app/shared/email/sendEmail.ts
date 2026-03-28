import nodemailer from "nodemailer";

type SendEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendEmail(payload: SendEmailPayload): Promise<void> {
  const transporter = getTransporter();
  const fromAddress = process.env.MAIL_FROM;

  if (!transporter || !fromAddress) {
    console.warn(
      "Email skipped: configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM to send emails.",
    );
    return;
  }

  await transporter.sendMail({
    from: fromAddress,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}
