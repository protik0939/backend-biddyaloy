import { AdminRole } from "../../../generated/prisma/enums";

interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: string;
  adminRole: AdminRole | null;
  institutionId?: string;
}

interface ILoginUser {
  email: string;
  password: string;
}

interface IAuthOtpEmailPayload {
  email: string;
}

interface IVerifyAuthOtpPayload extends IAuthOtpEmailPayload {
  otp: string;
}

interface IForgotPasswordPayload {
  email: string;
}

interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}

export {
  IRegisterUser,
  ILoginUser,
  IAuthOtpEmailPayload,
  IVerifyAuthOtpPayload,
  IForgotPasswordPayload,
  IResetPasswordPayload,
  IChangePasswordPayload,
};