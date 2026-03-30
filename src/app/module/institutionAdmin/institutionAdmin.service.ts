import { AccountStatus, AdminRole, UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  decryptCredentialValue,
  encryptCredentialValue,
  hashCredentialValue,
  maskCredentialValue,
} from "../../shared/credentialSecurity";
import {
  ICreateInstitutionSemesterPayload,
  ICreateInstitutionSubAdminPayload,
  IUpsertInstitutionSslCommerzCredentialPayload,
  IUpdateInstitutionAdminProfilePayload,
  IUpdateInstitutionSemesterPayload,
} from "./institutionAdmin.interface";

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

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

const resolveInstitutionAdminContext = async (creatorUserId: string) => {
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
    throw createHttpError(403, "Only institution admins can manage semesters");
  }

  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError(403, "Only institution admins can manage semesters");
  }

  return creatorAdminProfile;
};

const listSemesters = async (creatorUserId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  return prisma.semester.findMany({
    where: {
      institutionId: context.institutionId,
    },
    orderBy: {
      startDate: "desc",
    },
  });
};

const getDashboardSummary = async (creatorUserId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const [user, institution, stats] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: creatorUserId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        contactNo: true,
        presentAddress: true,
        permanentAddress: true,
        bloodGroup: true,
        gender: true,
      },
    }),
    prisma.institution.findUnique({
      where: {
        id: context.institutionId,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        institutionLogo: true,
        type: true,
      },
    }),
    Promise.all([
      prisma.faculty.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.department.count({
        where: {
          faculty: {
            institutionId: context.institutionId,
          },
        },
      }),
      prisma.semester.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.teacherProfile.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.studentProfile.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.teacherJobApplication.count({
        where: {
          institutionId: context.institutionId,
          status: "PENDING",
        },
      }),
      prisma.studentAdmissionApplication.count({
        where: {
          posting: {
            institutionId: context.institutionId,
          },
          status: "PENDING",
        },
      }),
    ]),
  ]);

  const [
    totalFaculties,
    totalDepartments,
    totalSemesters,
    totalTeachers,
    totalStudents,
    pendingTeacherApplications,
    pendingStudentApplications,
  ] = stats;

  return {
    user,
    institution,
    stats: {
      totalFaculties,
      totalDepartments,
      totalSemesters,
      totalTeachers,
      totalStudents,
      pendingTeacherApplications,
      pendingStudentApplications,
    },
  };
};

const updateProfile = async (
  creatorUserId: string,
  payload: IUpdateInstitutionAdminProfilePayload,
) => {
  await resolveInstitutionAdminContext(creatorUserId);

  const nextName = payload.name?.trim();

  if (nextName) {
    await prisma.user.update({
      where: { id: creatorUserId },
      data: {
        name: nextName,
      },
    });
  }

  await prisma.user.update({
    where: { id: creatorUserId },
    data: {
      image: payload.image === undefined ? undefined : payload.image.trim() || null,
      contactNo: payload.contactNo === undefined ? undefined : payload.contactNo.trim() || null,
      presentAddress:
        payload.presentAddress === undefined ? undefined : payload.presentAddress.trim() || null,
      permanentAddress:
        payload.permanentAddress === undefined
          ? undefined
          : payload.permanentAddress.trim() || null,
      bloodGroup: payload.bloodGroup === undefined ? undefined : payload.bloodGroup.trim() || null,
      gender: payload.gender === undefined ? undefined : payload.gender.trim() || null,
    },
  });

  return getDashboardSummary(creatorUserId);
};

const getSslCommerzCredential = async (creatorUserId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existing = await (prisma as any).institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId: context.institutionId,
    },
    select: {
      sslCommerzStoreIdEncrypted: true,
      sslCommerzBaseUrlEncrypted: true,
      sslCommerzStorePasswordHash: true,
      updatedAt: true,
      isActive: true,
    },
  });

  if (!existing) {
    return {
      isConfigured: false,
      storeIdMasked: null,
      hasStorePassword: false,
      baseUrl: null,
      updatedAt: null,
      isActive: false,
    };
  }

  const storeId = decryptCredentialValue(existing.sslCommerzStoreIdEncrypted);
  const baseUrl = decryptCredentialValue(existing.sslCommerzBaseUrlEncrypted);

  return {
    isConfigured: true,
    storeIdMasked: maskCredentialValue(storeId),
    hasStorePassword: Boolean(existing.sslCommerzStorePasswordHash),
    baseUrl,
    updatedAt: existing.updatedAt,
    isActive: existing.isActive,
  };
};

const upsertSslCommerzCredential = async (
  creatorUserId: string,
  payload: IUpsertInstitutionSslCommerzCredentialPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existing = await (prisma as any).institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId: context.institutionId,
    },
    select: {
      id: true,
      sslCommerzStoreIdEncrypted: true,
      sslCommerzStorePasswordEncrypted: true,
      sslCommerzBaseUrlEncrypted: true,
    },
  });

  const nextStoreIdInput = payload.storeId?.trim();
  const nextStorePasswordInput = payload.storePassword?.trim();
  const nextBaseUrlInput = payload.baseUrl?.trim();

  let resolvedStoreId = nextStoreIdInput;
  let resolvedStorePassword = nextStorePasswordInput;
  let resolvedBaseUrl = nextBaseUrlInput;

  if (existing) {
    resolvedStoreId = resolvedStoreId || decryptCredentialValue(existing.sslCommerzStoreIdEncrypted);
    resolvedStorePassword =
      resolvedStorePassword || decryptCredentialValue(existing.sslCommerzStorePasswordEncrypted);
    resolvedBaseUrl = resolvedBaseUrl || decryptCredentialValue(existing.sslCommerzBaseUrlEncrypted);
  }

  if (!resolvedStoreId || !resolvedStorePassword || !resolvedBaseUrl) {
    throw createHttpError(
      400,
      "storeId, storePassword and baseUrl are required for SSLCommerz credential setup",
    );
  }

  let normalizedBaseUrl: string;
  try {
    normalizedBaseUrl = new URL(resolvedBaseUrl).toString().replace(/\/$/, "");
  } catch {
    throw createHttpError(400, "baseUrl must be a valid URL");
  }

  await (prisma as any).institutionPaymentGatewayCredential.upsert({
    where: {
      institutionId: context.institutionId,
    },
    create: {
      institutionId: context.institutionId,
      sslCommerzStoreIdEncrypted: encryptCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordEncrypted: encryptCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlEncrypted: encryptCredentialValue(normalizedBaseUrl),
      sslCommerzStoreIdHash: hashCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordHash: hashCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlHash: hashCredentialValue(normalizedBaseUrl),
      isActive: true,
      lastUpdatedByUserId: creatorUserId,
    },
    update: {
      sslCommerzStoreIdEncrypted: encryptCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordEncrypted: encryptCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlEncrypted: encryptCredentialValue(normalizedBaseUrl),
      sslCommerzStoreIdHash: hashCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordHash: hashCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlHash: hashCredentialValue(normalizedBaseUrl),
      isActive: true,
      lastUpdatedByUserId: creatorUserId,
    },
  });

  return getSslCommerzCredential(creatorUserId);
};

const createSemester = async (
  creatorUserId: string,
  payload: ICreateInstitutionSemesterPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw createHttpError(400, "Invalid startDate or endDate");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate <= today) {
    throw createHttpError(400, "startDate must be after today");
  }

  if (startDate >= endDate) {
    throw createHttpError(400, "startDate must be before endDate");
  }

  return prisma.semester.create({
    data: {
      name: payload.name.trim(),
      startDate,
      endDate,
      institutionId: context.institutionId,
    },
  });
};

const updateSemester = async (
  creatorUserId: string,
  semesterId: string,
  payload: IUpdateInstitutionSemesterPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existingSemester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId,
    },
  });

  if (!existingSemester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;

  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError(400, "Invalid startDate");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError(400, "startDate must be after today");
    }

    nextStartDate = parsedStartDate;
  }

  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError(400, "Invalid endDate");
    }

    nextEndDate = parsedEndDate;
  }

  if (nextStartDate >= nextEndDate) {
    throw createHttpError(400, "startDate must be before endDate");
  }

  return prisma.semester.update({
    where: {
      id: existingSemester.id,
    },
    data: {
      name: payload.name?.trim() || undefined,
      startDate: payload.startDate ? nextStartDate : undefined,
      endDate: payload.endDate ? nextEndDate : undefined,
    },
  });
};

const deleteSemester = async (creatorUserId: string, semesterId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existingSemester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId,
    },
    select: {
      id: true,
    },
  });

  if (!existingSemester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  await prisma.semester.delete({
    where: {
      id: existingSemester.id,
    },
  });

  return {
    id: existingSemester.id,
  };
};

const listFaculties = async (creatorUserId: string, search?: string) => {
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

  const normalizedSearch = normalizeSearch(search);

  return prisma.faculty.findMany({
    where: {
      institutionId: creatorAdminProfile.institutionId,
      ...(normalizedSearch
        ? {
            OR: [
              { fullName: { contains: normalizedSearch, mode: "insensitive" } },
              { shortName: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
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
  getDashboardSummary,
  updateProfile,
  getSslCommerzCredential,
  upsertSslCommerzCredential,
  listSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  createSubAdminAccount,
  listFaculties,
};
