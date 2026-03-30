import { buildEmailTemplate } from "../buildEmailTemplate";

type PasswordResetEmailPayload = {
  resetPasswordUrl: string;
  validityMinutes: number;
};

export function buildPasswordResetEmail(payload: PasswordResetEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Reset your Biddyaloy password";
  const validityLabel = `${payload.validityMinutes} minute${payload.validityMinutes > 1 ? "s" : ""}`;

  const html = buildEmailTemplate({
    subject,
    previewText: "Use this secure link to reset your password",
    heading: "Password reset requested",
    bodyText:
      "We received a request to reset your Biddyaloy account password. Use the button below to set a new password.",
    helperText: `This link expires in ${validityLabel}. If you did not request this, you can safely ignore this email.`,
    ctaLabel: "Reset password",
    ctaUrl: payload.resetPasswordUrl,
    footerNote:
      "For your security, Biddyaloy support will never ask for your password or reset link.",
  });

  const text = [
    "Password reset requested",
    "",
    `Reset link: ${payload.resetPasswordUrl}`,
    `This link expires in ${validityLabel}.`,
  ].join("\n");

  return {
    subject,
    html,
    text,
  };
}
