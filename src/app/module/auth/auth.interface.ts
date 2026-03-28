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

export { IRegisterUser, ILoginUser, IAuthOtpEmailPayload, IVerifyAuthOtpPayload };