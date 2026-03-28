import { createHash, randomInt } from "node:crypto";
import { AccountStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../shared/email/sendEmail";
import { buildOtpVerificationEmail } from "../../shared/email/templates/otpVerificationEmail";

type IssueOtpOptions = {
  enforceCooldown?: boolean;
};

type OtpStatusPayload = {
  verificationRequired: boolean;
  otpExpiresAt: string | null;
  resendAvailableAt: string | null;
  otpValiditySeconds: number;
  resendCooldownSeconds: number;
};

const OTP_VALIDITY_SECONDS = 2 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

function createHttpError(statusCode: number, message: string): Error & { statusCode: number } {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
}

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

function getVerificationPageUrl(email: string): string | undefined {
  const frontendBase = process.env.FRONTEND_PUBLIC_URL;
  if (!frontendBase) {
    return undefined;
  }

  const normalized = frontendBase.endsWith("/")
    ? frontendBase.slice(0, -1)
    : frontendBase;

  return `${normalized}/verify-account?email=${encodeURIComponent(email)}`;
}

async function cleanupExpiredOtp(userId: string): Promise<void> {
  await prisma.emailOtp.deleteMany({
    where: {
      userId,
      expiresAt: {
        lte: new Date(),
      },
    },
  });
}

function toOtpStatusPayload(payload: {
  expiresAt: Date;
  createdAt: Date;
}): OtpStatusPayload {
  return {
    verificationRequired: true,
    otpExpiresAt: payload.expiresAt.toISOString(),
    resendAvailableAt: new Date(
      payload.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000,
    ).toISOString(),
    otpValiditySeconds: OTP_VALIDITY_SECONDS,
    resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
  };
}

async function sendOtpEmail(email: string, otpCode: string): Promise<void> {
  const message = buildOtpVerificationEmail({
    otpCode,
    validityMinutes: Math.floor(OTP_VALIDITY_SECONDS / 60),
    verificationPageUrl: getVerificationPageUrl(email),
  });

  await sendEmail({
    to: email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

async function getUserForOtpByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      accountStatus: true,
    },
  });

  if (!user) {
    throw createHttpError(404, "User account not found");
  }

  return user;
}

async function issueAccountVerificationOtp(
  userId: string,
  email: string,
  options?: IssueOtpOptions,
): Promise<OtpStatusPayload> {
  await cleanupExpiredOtp(userId);

  if (options?.enforceCooldown) {
    const existing = await prisma.emailOtp.findUnique({
      where: {
        userId,
      },
      select: {
        createdAt: true,
      },
    });

    if (existing) {
      const resendAvailableAt =
        existing.createdAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000;

      if (Date.now() < resendAvailableAt) {
        throw createHttpError(
          429,
          "Please wait one minute before requesting another OTP email",
        );
      }
    }
  }

  const otpCode = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_VALIDITY_SECONDS * 1000);
  const createdAt = new Date();

  await prisma.emailOtp.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      otpHash: hashOtp(otpCode),
      expiresAt,
      createdAt,
    },
    update: {
      otpHash: hashOtp(otpCode),
      expiresAt,
      createdAt,
    },
  });

  await sendOtpEmail(email, otpCode);

  return toOtpStatusPayload({
    expiresAt,
    createdAt,
  });
}

async function getAccountVerificationOtpStatusByEmail(email: string): Promise<OtpStatusPayload> {
  const user = await getUserForOtpByEmail(email);

  if (user.accountStatus !== AccountStatus.PENDING) {
    return {
      verificationRequired: false,
      otpExpiresAt: null,
      resendAvailableAt: null,
      otpValiditySeconds: OTP_VALIDITY_SECONDS,
      resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
    };
  }

  await cleanupExpiredOtp(user.id);

  const otpRecord = await prisma.emailOtp.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      expiresAt: true,
      createdAt: true,
    },
  });

  if (!otpRecord) {
    return issueAccountVerificationOtp(user.id, user.email, {
      enforceCooldown: false,
    });
  }

  return toOtpStatusPayload({
    expiresAt: otpRecord.expiresAt,
    createdAt: otpRecord.createdAt,
  });
}

async function resendAccountVerificationOtpByEmail(email: string): Promise<OtpStatusPayload> {
  const user = await getUserForOtpByEmail(email);

  if (user.accountStatus !== AccountStatus.PENDING) {
    throw createHttpError(400, "Account is already verified");
  }

  return issueAccountVerificationOtp(user.id, user.email, {
    enforceCooldown: true,
  });
}

async function verifyAccountOtpByEmail(email: string, otpCode: string): Promise<{
  verified: true;
  role: string;
  accountStatus: string;
}> {
  const user = await getUserForOtpByEmail(email);

  if (user.accountStatus !== AccountStatus.PENDING) {
    return {
      verified: true,
      role: user.role,
      accountStatus: user.accountStatus,
    };
  }

  await cleanupExpiredOtp(user.id);

  const otpRecord = await prisma.emailOtp.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      otpHash: true,
      expiresAt: true,
    },
  });

  if (!otpRecord) {
    throw createHttpError(400, "OTP has expired. Please request a new code");
  }

  if (otpRecord.expiresAt.getTime() <= Date.now()) {
    await prisma.emailOtp.deleteMany({
      where: {
        userId: user.id,
      },
    });
    throw createHttpError(400, "OTP has expired. Please request a new code");
  }

  if (otpRecord.otpHash !== hashOtp(otpCode)) {
    throw createHttpError(400, "Invalid OTP code");
  }

  await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
        emailVerified: true,
      },
    });

    await trx.emailOtp.deleteMany({
      where: {
        userId: user.id,
      },
    });
  });

  return {
    verified: true,
    role: user.role,
    accountStatus: AccountStatus.ACTIVE,
  };
}

export const AuthOtpService = {
  issueAccountVerificationOtp,
  getAccountVerificationOtpStatusByEmail,
  resendAccountVerificationOtpByEmail,
  verifyAccountOtpByEmail,
  OTP_VALIDITY_SECONDS,
  RESEND_COOLDOWN_SECONDS,
};
