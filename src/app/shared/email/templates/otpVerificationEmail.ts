import { buildEmailTemplate } from "../buildEmailTemplate";

type OtpVerificationEmailPayload = {
  otpCode: string;
  validityMinutes: number;
  verificationPageUrl?: string;
};

export function buildOtpVerificationEmail(payload: OtpVerificationEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Verify your Biddyaloy account";
  const validityLabel = `${payload.validityMinutes} minute${payload.validityMinutes > 1 ? "s" : ""}`;

  const html = buildEmailTemplate({
    subject,
    previewText: `Your verification OTP is ${payload.otpCode}`,
    heading: "Account verification required",
    bodyText: `Use the OTP below to verify your account:\n\n${payload.otpCode}`,
    helperText: `This code expires in ${validityLabel}. If you did not request it, you can ignore this email.`,
    ctaLabel: payload.verificationPageUrl ? "Open verification page" : undefined,
    ctaUrl: payload.verificationPageUrl,
    footerNote:
      "For your security, never share this code with anyone. Biddyaloy support will never ask for your OTP.",
  });

  const text = [
    "Account verification required",
    "",
    `Your OTP: ${payload.otpCode}`,
    `This code expires in ${validityLabel}.`,
    payload.verificationPageUrl ? `Verification page: ${payload.verificationPageUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
}
