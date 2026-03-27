import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AccountStatus, AdminRole } from "../../../generated/prisma/enums";
import { ILoginUser, IRegisterUser } from "./auth.interface";

function resolveUiRoleFromAdminRole(adminRole: string | null | undefined): string {
  if (adminRole === AdminRole.FACULTYADMIN) {
    return "FACULTY";
  }

  if (adminRole === AdminRole.DEPARTMENTADMIN) {
    return "DEPARTMENT";
  }

  return "ADMIN";
}

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

  let effectiveRole = userRecord.role;

  if (userRecord.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: data.user.id,
      },
      select: {
        role: true,
      },
    });

    effectiveRole = resolveUiRoleFromAdminRole(adminProfile?.role);
  }

  return {
    ...data,
    role: effectiveRole,
    user: {
      ...data.user,
      role: effectiveRole,
      baseRole: userRecord.role,
      accountStatus: userRecord.accountStatus,
    },
  };
};

const getCurrentUserProfile = async (userId: string) => {
  const userRecord = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      accountStatus: true,
    },
  });

  if (!userRecord) {
    throw new Error("User account not found");
  }

  let effectiveRole = userRecord.role;
  let institution:
    | {
        id: string;
        name: string;
        shortName: string | null;
        institutionLogo: string | null;
      }
    | null = null;

  if (userRecord.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId,
      },
      select: {
        role: true,
        institution: {
          select: {
            id: true,
            name: true,
            shortName: true,
            institutionLogo: true,
          },
        },
      },
    });

    effectiveRole = resolveUiRoleFromAdminRole(adminProfile?.role);
    institution = adminProfile?.institution ?? null;
  }

  if (userRecord.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: {
        userId,
      },
      select: {
        institution: {
          select: {
            id: true,
            name: true,
            shortName: true,
            institutionLogo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    institution = teacherProfile?.institution ?? null;
  }

  if (userRecord.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId,
      },
      select: {
        institution: {
          select: {
            id: true,
            name: true,
            shortName: true,
            institutionLogo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    institution = studentProfile?.institution ?? null;
  }

  return {
    id: userRecord.id,
    name: userRecord.name,
    email: userRecord.email,
    image: userRecord.image,
    role: effectiveRole,
    baseRole: userRecord.role,
    accountStatus: userRecord.accountStatus,
    institution,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  getCurrentUserProfile,
};
