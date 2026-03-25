import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AccountStatus } from "../../../generated/prisma/enums";
import { ILoginUser, IRegisterUser } from "./auth.interface";

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, role } = payload;
  console.log("Registering user with payload:", payload);

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
    },
  });

  if (!data.user) {
    throw new Error("Failed to register user");
  }

  // if(adminRole != null) {
  //   await prisma.adminProfile.create({
  //     data: {
  //       userId: data.user.id,
  //       role: adminRole,
  //       institutionId: "biddyaloy",
  //     },
  //   })
  // }

    console.log("Registration data:", data);
    return data;
};

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error("Invalid email or password");
  }

  const userRecord = await prisma.user.findUnique({
    where: {
      id: data.user.id,
    },
    select: {
      role: true,
      accountStatus: true,
    },
  });

  if (!userRecord) {
    throw new Error("User account not found");
  }

  if (userRecord.accountStatus === AccountStatus.DELETED) {
    throw new Error("User account has been deleted");
  }

  if (userRecord.accountStatus === AccountStatus.BANNED) {
    throw new Error("User account has been banned");
  }

  if (userRecord.accountStatus === AccountStatus.DEACTIVATED) {
    throw new Error("User account has been deactivated");
  }

  if (userRecord.accountStatus === AccountStatus.DELETIONPENDING) {
    throw new Error("User account deletion is pending");
  }

  return {
    ...data,
    role: userRecord.role,
    user: {
      ...data.user,
      role: userRecord.role,
      accountStatus: userRecord.accountStatus,
    },
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};
