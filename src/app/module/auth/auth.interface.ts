import { AdminRole } from "../../../generated/prisma/enums";

interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role: string;
  adminRole: AdminRole | null;
  institutionId: string;
}

interface ILoginUser {
  email: string;
  password: string;
}

export { IRegisterUser, ILoginUser };