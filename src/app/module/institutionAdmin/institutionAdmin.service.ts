import { AdminRole, UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateInstitutionSubAdminPayload } from "./institutionAdmin.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function resolveAdminRole(accountType: ICreateInstitutionSubAdminPayload["accountType"]) {
  return accountType === "FACULTY" ? AdminRole.FACULTYADMIN : AdminRole.DEPARTMENTADMIN;
}

function canCreateSubAdmin(
  creatorRole: AdminRole,
  targetAccountType: ICreateInstitutionSubAdminPayload["accountType"],
) {
  if (creatorRole === AdminRole.INSTITUTIONADMIN) {
    return true;
  }

  if (creatorRole === AdminRole.FACULTYADMIN && targetAccountType === "DEPARTMENT") {
    return true;
  }

  return false;
}

const createSubAdminAccount = async (
  creatorUserId: string,
  payload: ICreateInstitutionSubAdminPayload,
) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId,
    },
    select: {
      institutionId: true,
      role: true,
    },
  });

  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError(403, "Only institution-level admins can create sub-admin accounts");
  }

  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError(
      403,
      "You are not allowed to create this account type. Faculty admins can only create department accounts",
    );
  }

  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.ADMIN,
    },
  });

  if (!registered.user) {
    throw createHttpError(500, "Failed to create account");
  }

  const adminProfile = await prisma.adminProfile.upsert({
    where: {
      userId: registered.user.id,
    },
    create: {
      userId: registered.user.id,
      institutionId: creatorAdminProfile.institutionId,
      role: resolveAdminRole(payload.accountType),
    },
    update: {
      institutionId: creatorAdminProfile.institutionId,
      role: resolveAdminRole(payload.accountType),
    },
    select: {
      role: true,
      institutionId: true,
      createdAt: true,
    },
  });

  return {
    id: registered.user.id,
    name: registered.user.name,
    email: registered.user.email,
    role: UserRole.ADMIN,
    adminRole: adminProfile.role,
    institutionId: adminProfile.institutionId,
    createdAt: adminProfile.createdAt,
  };
};

export const InstitutionAdminService = {
  createSubAdminAccount,
};
