import { AccountStatus, AdminRole, UserRole } from "../../../generated/prisma/enums";
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

const listFaculties = async (creatorUserId: string) => {
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
    throw createHttpError(403, "Only institution-level admins can view faculties");
  }

  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError(403, "You are not allowed to view faculties for department creation");
  }

  return prisma.faculty.findMany({
    where: {
      institutionId: creatorAdminProfile.institutionId,
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

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

  const normalizedFacultyFullName = payload.facultyFullName?.trim();
  const normalizedFacultyShortName = payload.facultyShortName?.trim();
  const normalizedFacultyDescription = payload.facultyDescription?.trim();
  const normalizedDepartmentFullName = payload.departmentFullName?.trim();
  const normalizedDepartmentShortName = payload.departmentShortName?.trim();
  const normalizedDepartmentDescription = payload.departmentDescription?.trim();

  const result = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    const adminProfile = await trx.adminProfile.upsert({
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

    let createdFaculty:
      | {
          id: string;
          fullName: string;
        }
      | undefined;

    let targetFacultyId: string | undefined;

    if (payload.facultyId) {
      const existingFaculty = await trx.faculty.findFirst({
        where: {
          id: payload.facultyId,
          institutionId: creatorAdminProfile.institutionId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      if (!existingFaculty) {
        throw createHttpError(404, "Faculty not found for this institution");
      }

      targetFacultyId = existingFaculty.id;
    }

    if (normalizedFacultyFullName) {
      const faculty = await trx.faculty.create({
        data: {
          fullName: normalizedFacultyFullName,
          shortName: normalizedFacultyShortName || undefined,
          description: normalizedFacultyDescription || undefined,
          institutionId: creatorAdminProfile.institutionId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      createdFaculty = faculty;
      targetFacultyId = faculty.id;
    }

    let createdDepartment:
      | {
          id: string;
          fullName: string;
        }
      | undefined;

    if (normalizedDepartmentFullName) {
      if (!targetFacultyId) {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: creatorAdminProfile.institutionId,
          },
          select: {
            id: true,
          },
          take: 2,
          orderBy: {
            createdAt: "asc",
          },
        });

        if (faculties.length === 0) {
          throw createHttpError(
            400,
            "Cannot create department without a faculty. Provide faculty fields first",
          );
        }

        if (faculties.length > 1) {
          throw createHttpError(
            400,
            "Multiple faculties found. Provide facultyId or faculty fields to select a target faculty",
          );
        }

        targetFacultyId = faculties[0].id;
      }

      const department = await trx.department.create({
        data: {
          fullName: normalizedDepartmentFullName,
          shortName: normalizedDepartmentShortName || undefined,
          description: normalizedDepartmentDescription || undefined,
          facultyId: targetFacultyId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      createdDepartment = department;
    }

    return {
      adminProfile,
      createdFaculty,
      createdDepartment,
    };
  });

  return {
    id: registered.user.id,
    name: registered.user.name,
    email: registered.user.email,
    role: UserRole.ADMIN,
    adminRole: result.adminProfile.role,
    institutionId: result.adminProfile.institutionId,
    createdAt: result.adminProfile.createdAt,
    faculty: result.createdFaculty ?? null,
    department: result.createdDepartment ?? null,
  };
};

export const InstitutionAdminService = {
  createSubAdminAccount,
  listFaculties,
};
