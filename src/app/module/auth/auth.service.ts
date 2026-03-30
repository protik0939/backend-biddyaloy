import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AccountStatus, AdminRole } from "../../../generated/prisma/enums";
import {
  IAuthOtpEmailPayload,
  IChangePasswordPayload,
  IForgotPasswordPayload,
  IListInstitutionLeaveRequestsQuery,
  ILoginUser,
  IReviewInstitutionLeaveRequestPayload,
  IRequestInstitutionLeavePayload,
  IRegisterUser,
  IResetPasswordPayload,
  IVerifyAuthOtpPayload,
} from "./auth.interface";
import { AuthOtpService } from "./authOtp.service";

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

  const userRecord = await prisma.user.findUnique({
    where: {
      id: data.user.id,
    },
    select: {
      accountStatus: true,
      role: true,
      email: true,
    },
  });

  if (!userRecord) {
    throw new Error("User account not found");
  }

  if (userRecord.accountStatus === AccountStatus.PENDING) {
    const verification = await AuthOtpService.issueAccountVerificationOtp(
      data.user.id,
      userRecord.email,
      { enforceCooldown: false },
    );

    return {
      ...data,
      role: userRecord.role,
      user: {
        ...data.user,
        role: userRecord.role,
        baseRole: userRecord.role,
        accountStatus: userRecord.accountStatus,
      },
      verificationRequired: true,
      verification,
    };
  }

  return data;
};
function resolveEffectiveRoleForInstitutionType(
  baseRole: string,
  adminRole: string | null | undefined,
  institutionType: string | null | undefined,
) {
  if (baseRole !== "ADMIN") {
    return baseRole;
  }

  if (institutionType && institutionType !== "UNIVERSITY") {
    return "ADMIN";
  }

  return resolveUiRoleFromAdminRole(adminRole);
}

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

  if (userRecord.accountStatus === AccountStatus.PENDING) {
    const verification = await AuthOtpService.issueAccountVerificationOtp(
      data.user.id,
      data.user.email,
      { enforceCooldown: false },
    );

    return {
      ...data,
      role: userRecord.role,
      user: {
        ...data.user,
        role: userRecord.role,
        baseRole: userRecord.role,
        accountStatus: userRecord.accountStatus,
      },
      verificationRequired: true,
      verification,
    };
  }

  let effectiveRole = userRecord.role;

  if (userRecord.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: data.user.id,
      },
      select: {
        role: true,
        institution: {
          select: {
            type: true,
          },
        },
      },
    });

    effectiveRole = resolveEffectiveRoleForInstitutionType(
      userRecord.role,
      adminProfile?.role,
      adminProfile?.institution?.type,
    );
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

  if (userRecord.accountStatus === AccountStatus.PENDING) {
    const error = new Error("Account verification is required") as Error & {
      statusCode?: number;
    };
    error.statusCode = 403;
    throw error;
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
            type: true,
          },
        },
      },
    });

    effectiveRole = resolveEffectiveRoleForInstitutionType(
      userRecord.role,
      adminProfile?.role,
      adminProfile?.institution?.type,
    );
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

const getAccountVerificationOtpStatus = async (payload: IAuthOtpEmailPayload) => {
  return AuthOtpService.getAccountVerificationOtpStatusByEmail(payload.email);
};

const resendAccountVerificationOtp = async (payload: IAuthOtpEmailPayload) => {
  return AuthOtpService.resendAccountVerificationOtpByEmail(payload.email);
};

const verifyAccountOtp = async (payload: IVerifyAuthOtpPayload) => {
  const verificationResult = await AuthOtpService.verifyAccountOtpByEmail(
    payload.email,
    payload.otp,
  );

  const verifiedUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!verifiedUser) {
    throw new Error("User account not found");
  }

  let effectiveRole = verifiedUser.role;

  if (verifiedUser.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId: verifiedUser.id,
      },
      select: {
        role: true,
        institution: {
          select: {
            type: true,
          },
        },
      },
    });

    effectiveRole = resolveEffectiveRoleForInstitutionType(
      verifiedUser.role,
      adminProfile?.role,
      adminProfile?.institution?.type,
    );
  }

  return {
    ...verificationResult,
    role: effectiveRole,
  };
};

function getFrontendResetPasswordRedirectUrl(): string | undefined {
  const frontendBase = process.env.FRONTEND_PUBLIC_URL;
  if (!frontendBase) {
    return undefined;
  }

  const normalizedBase = frontendBase.endsWith("/")
    ? frontendBase.slice(0, -1)
    : frontendBase;

  return `${normalizedBase}/reset-password`;
}

const requestPasswordReset = async (payload: IForgotPasswordPayload) => {
  const redirectTo = getFrontendResetPasswordRedirectUrl();

  const result = await auth.api.requestPasswordReset({
    body: {
      email: payload.email,
      redirectTo,
    },
  });

  return {
    status: result.status,
    message: result.message,
  };
};

const resetPassword = async (payload: IResetPasswordPayload) => {
  const result = await auth.api.resetPassword({
    body: {
      token: payload.token,
      newPassword: payload.newPassword,
    },
  });

  return {
    status: result.status,
  };
};

const changePassword = async (payload: IChangePasswordPayload, cookieHeader?: string) => {
  const result = await auth.api.changePassword({
    body: {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      revokeOtherSessions: payload.revokeOtherSessions,
    },
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  return {
    token: result.token,
    user: result.user,
  };
};

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

const requestInstitutionLeave = async (
  userId: string,
  userRole: string,
  payload: IRequestInstitutionLeavePayload,
) => {
  if (userRole !== "TEACHER" && userRole !== "STUDENT") {
    throw createHttpError(403, "Only teacher or student can request institution leave");
  }

  let context: { institutionId: string } | null = null;

  if (userRole === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: {
        userId,
      },
      select: {
        institutionId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    context = teacherProfile?.institutionId ? { institutionId: teacherProfile.institutionId } : null;
  }

  if (userRole === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: {
        userId,
      },
      select: {
        institutionId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    context = studentProfile?.institutionId ? { institutionId: studentProfile.institutionId } : null;
  }

  if (!context?.institutionId) {
    throw createHttpError(400, "No institution assignment found for this account");
  }

  const activeSubscription = await (prisma as any).institutionSubscription.findFirst({
    where: {
      institutionId: context.institutionId,
      status: "ACTIVE",
      endsAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  if (activeSubscription?.id) {
    throw createHttpError(
      400,
      "Institution subscription is active. Leave option is available only after expiry.",
    );
  }

  const existingPending = await (prisma as any).institutionLeaveRequest.findFirst({
    where: {
      requesterUserId: userId,
      institutionId: context.institutionId,
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingPending) {
    return existingPending;
  }

  return (prisma as any).institutionLeaveRequest.create({
    data: {
      requesterUserId: userId,
      requesterRole: userRole,
      institutionId: context.institutionId,
      reason: payload.reason?.trim() || null,
      status: "PENDING",
    },
  });
};

const listInstitutionLeaveRequestsForSuperAdmin = async (
  query: IListInstitutionLeaveRequestsQuery,
) => {
  const status = query.status?.trim().toUpperCase();
  const where =
    status && (status === "PENDING" || status === "APPROVED" || status === "REJECTED")
      ? { status }
      : undefined;

  return (prisma as any).institutionLeaveRequest.findMany({
    where,
    include: {
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true,
        },
      },
      reviewedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const reviewInstitutionLeaveRequestBySuperAdmin = async (
  reviewerUserId: string,
  requestId: string,
  payload: IReviewInstitutionLeaveRequestPayload,
) => {
  const leaveRequest = await (prisma as any).institutionLeaveRequest.findUnique({
    where: {
      id: requestId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!leaveRequest) {
    throw createHttpError(404, "Institution leave request not found");
  }

  if (leaveRequest.status !== "PENDING") {
    throw createHttpError(400, "Only pending leave requests can be reviewed");
  }

  return (prisma as any).institutionLeaveRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: payload.status,
      reviewedByUserId: reviewerUserId,
      reviewedAt: new Date(),
    },
    include: {
      requesterUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true,
        },
      },
      reviewedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const AuthService = {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  getAccountVerificationOtpStatus,
  resendAccountVerificationOtp,
  verifyAccountOtp,
  requestPasswordReset,
  resetPassword,
  changePassword,
  requestInstitutionLeave,
  listInstitutionLeaveRequestsForSuperAdmin,
  reviewInstitutionLeaveRequestBySuperAdmin,
};
