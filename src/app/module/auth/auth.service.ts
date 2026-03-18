import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, role, adminRole, institutionId } = payload;
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

  if(adminRole != null) {
    await prisma.adminProfile.create({
      data: {
        userId: data.user.id,
        role: adminRole,
        institutionId: institutionId,
      },
    })
  }

    console.log("Registration data:", data);
    return data;
};


  // const loginUser = async (payload: ILoginUser) => {
  //   const { email, password } = payload;

  //   const data = await auth.api.signInEmail({
  //     body: {
  //       email,
  //       password,
  //     },
  //   });

  //   if (!data.user) {
  //     throw new Error("Failed to login user");
  //   }

  //   if (data.user.accountStatus === AccountStatus.DELETED) {
  //     throw new Error("User account has been deleted");
  //   }

  //   if (data.user.accountStatus === AccountStatus.BANNED) {
  //     throw new Error("User account has been banned");
  //   }

  //   if (data.user.accountStatus === AccountStatus.DEACTIVATED) {
  //     throw new Error("User account has been deactivated");
  //   }

  //   if (data.user.accountStatus === AccountStatus.DELETIONPENDING) {
  //     throw new Error("User account deletion is pending");
  //   }

  //   console.log("Login data:", data);
  //   return data;
// };

export const AuthService = {
  registerUser,
  //   loginUser,
};
