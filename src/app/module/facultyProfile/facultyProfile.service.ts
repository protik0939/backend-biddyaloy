import { AdminRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateFacultyDepartmentPayload,
  IFacultyDepartmentResult,
  IFacultyProfileDetailsResult,
  IUpdatedFacultyDisplayNameResult,
  IUpdateFacultyDisplayNamePayload,
} from "./facultyProfile.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

async function resolveFacultyManagementContext(userId: string) {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      role: true,
      institutionId: true,
    },
  });

  if (!adminProfile?.institutionId) {
    throw createHttpError(403, "Only faculty-level admins can access this resource");
  }

  const canUseFacultyFeatures =
    adminProfile.role === AdminRole.FACULTYADMIN ||
    adminProfile.role === AdminRole.INSTITUTIONADMIN;

  if (!canUseFacultyFeatures) {
    throw createHttpError(403, "Only faculty-level admins can access this resource");
  }

  return adminProfile;
}

const updateFacultyDisplayName = async (
  userId: string,
  payload: IUpdateFacultyDisplayNamePayload,
): Promise<IUpdatedFacultyDisplayNameResult> => {
  const adminProfile = await resolveFacultyManagementContext(userId);

  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();
  const hasFacultyMutation =
    Boolean(payload.fullName || payload.name || payload.shortName || payload.description) ||
    Boolean(payload.facultyId);

  if (hasFacultyMutation && !normalizedName) {
    throw createHttpError(400, "Full name is required when updating faculty details");
  }

  let updatedFacultyId: string | null = null;
  let updatedFacultyName: string | null = null;
  let resolvedUserName: string | null = null;

  await prisma.$transaction(async (trx) => {
    if (hasFacultyMutation) {
      let targetFaculty:
        | {
            id: string;
            institutionId: string | null;
          }
        | null = null;

      if (payload.facultyId) {
        targetFaculty = await trx.faculty.findFirst({
          where: {
            id: payload.facultyId,
            institutionId: adminProfile.institutionId,
          },
          select: {
            id: true,
            institutionId: true,
          },
        });

        if (!targetFaculty) {
          const facultyCount = await trx.faculty.count({
            where: {
              institutionId: adminProfile.institutionId,
            },
          });

          if (facultyCount === 0) {
            const createdFaculty = await trx.faculty.create({
              data: {
                fullName: normalizedName,
                shortName: payload.shortName?.trim() || undefined,
                description: payload.description?.trim() || undefined,
                institutionId: adminProfile.institutionId,
              },
              select: {
                id: true,
                institutionId: true,
              },
            });

            targetFaculty = createdFaculty;
          }
        }
      } else {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: adminProfile.institutionId,
          },
          select: {
            id: true,
            institutionId: true,
          },
          take: 2,
        });

        if (faculties.length === 1) {
          targetFaculty = faculties[0];
        }

        if (faculties.length > 1) {
          throw createHttpError(
            400,
            "Multiple faculties found. Please provide facultyId to update the correct faculty",
          );
        }

        if (faculties.length === 0) {
          const createdFaculty = await trx.faculty.create({
            data: {
              fullName: normalizedName,
              shortName: payload.shortName?.trim() || undefined,
              description: payload.description?.trim() || undefined,
              institutionId: adminProfile.institutionId,
            },
            select: {
              id: true,
              institutionId: true,
            },
          });

          targetFaculty = createdFaculty;
        }
      }

      if (!targetFaculty) {
        throw createHttpError(404, "Faculty not found");
      }

      if (!targetFaculty.institutionId || targetFaculty.institutionId !== adminProfile.institutionId) {
        throw createHttpError(403, "You can only update faculty under your institution");
      }

      const updatedFaculty = await trx.faculty.update({
        where: {
          id: targetFaculty.id,
        },
        data: {
          fullName: normalizedName,
          shortName: payload.shortName?.trim() || undefined,
          description: payload.description?.trim() || undefined,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      updatedFacultyId = updatedFaculty.id;
      updatedFacultyName = updatedFaculty.fullName;
    }

    const updatedUser = await trx.user.update({
      where: {
        id: userId,
      },
      data: {
        name: normalizedName || undefined,
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
      select: {
        name: true,
      },
    });

    resolvedUserName = updatedUser.name;
  });

  return {
    userId,
    name: resolvedUserName ?? normalizedName,
    facultyId: updatedFacultyId,
    facultyName: updatedFacultyName,
  };
};

const getFacultyProfileDetails = async (userId: string): Promise<IFacultyProfileDetailsResult> => {
  const adminProfile = await resolveFacultyManagementContext(userId);

  const faculty = await prisma.faculty.findFirst({
    where: {
      institutionId: adminProfile.institutionId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      description: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
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
  });

  const institution = adminProfile.institutionId
    ? await prisma.institution.findUnique({
        where: {
          id: adminProfile.institutionId,
        },
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true,
          type: true,
        },
      })
    : null;

  const totalDepartments = faculty?.id
    ? await prisma.department.count({
        where: {
          facultyId: faculty.id,
        },
      })
    : 0;

  const [totalTeachers, totalStudents, departmentAccounts, activeCourses] = faculty?.id
    ? await Promise.all([
        prisma.teacherProfile.count({
          where: {
            institutionId: adminProfile.institutionId,
            department: {
              facultyId: faculty.id,
            },
          },
        }),
        prisma.studentProfile.count({
          where: {
            institutionId: adminProfile.institutionId,
            department: {
              facultyId: faculty.id,
            },
          },
        }),
        prisma.adminProfile.count({
          where: {
            institutionId: adminProfile.institutionId,
            role: AdminRole.DEPARTMENTADMIN,
          },
        }),
        prisma.course.count({
          where: {
            institutionId: adminProfile.institutionId,
            department: {
              facultyId: faculty.id,
            },
          },
        }),
      ])
    : [0, 0, 0, 0];

  return {
    userId,
    institutionId: adminProfile.institutionId,
    facultyId: faculty?.id ?? null,
    fullName: faculty?.fullName ?? user?.name ?? "",
    shortName: faculty?.shortName ?? null,
    description: faculty?.description ?? null,
    user: {
      id: user?.id ?? userId,
      name: user?.name ?? "",
      email: user?.email ?? "",
      image: user?.image ?? null,
      contactNo: user?.contactNo ?? null,
      presentAddress: user?.presentAddress ?? null,
      permanentAddress: user?.permanentAddress ?? null,
      bloodGroup: user?.bloodGroup ?? null,
      gender: user?.gender ?? null,
    },
    institution,
    stats: {
      totalDepartments,
      totalTeachers,
      totalStudents,
      departmentAccounts,
      activeCourses,
    },
  };
};

const createDepartment = async (
  userId: string,
  payload: ICreateFacultyDepartmentPayload,
): Promise<IFacultyDepartmentResult> => {
  const adminProfile = await resolveFacultyManagementContext(userId);

  let targetFacultyId: string | undefined = payload.facultyId;

  if (targetFacultyId) {
    const byId = await prisma.faculty.findFirst({
      where: {
        id: targetFacultyId,
        institutionId: adminProfile.institutionId,
      },
      select: {
        id: true,
      },
    });

    if (!byId) {
      throw createHttpError(404, "Faculty not found for this institution");
    }
  } else {
    const faculties = await prisma.faculty.findMany({
      where: {
        institutionId: adminProfile.institutionId,
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
        404,
        "No faculty found for this institution. Update faculty profile first",
      );
    }

    if (faculties.length > 1) {
      throw createHttpError(400, "Multiple faculties found. Please provide facultyId");
    }

    targetFacultyId = faculties[0].id;
  }

  return prisma.department.create({
    data: {
      fullName: payload.fullName.trim(),
      shortName: payload.shortName?.trim() || null,
      description: payload.description?.trim() || null,
      facultyId: targetFacultyId,
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
      description: true,
      facultyId: true,
      createdAt: true,
    },
  });
};

export const FacultyProfileService = {
  createDepartment,
  getFacultyProfileDetails,
  updateFacultyDisplayName,
};
