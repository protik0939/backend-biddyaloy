import { AdminRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  IFacultyProfileDetailsResult,
  IUpdatedFacultyDisplayNameResult,
  IUpdateFacultyDisplayNamePayload,
} from "./facultyProfile.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

const updateFacultyDisplayName = async (
  userId: string,
  payload: IUpdateFacultyDisplayNamePayload,
): Promise<IUpdatedFacultyDisplayNameResult> => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      role: true,
      institutionId: true,
    },
  });

  if (adminProfile?.role !== AdminRole.FACULTYADMIN) {
    throw createHttpError(403, "Only faculty admins can update faculty display name");
  }

  const normalizedName = (payload.fullName ?? payload.name ?? "").trim();

  if (!normalizedName) {
    throw createHttpError(400, "Full name is required");
  }

  let updatedFacultyId: string | null = null;
  let updatedFacultyName: string | null = null;

  await prisma.$transaction(async (trx) => {
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

    await trx.user.update({
      where: {
        id: userId,
      },
      data: {
        name: normalizedName,
      },
    });

    updatedFacultyId = updatedFaculty.id;
    updatedFacultyName = updatedFaculty.fullName;
  });

  return {
    userId,
    name: normalizedName,
    facultyId: updatedFacultyId,
    facultyName: updatedFacultyName,
  };
};

const getFacultyProfileDetails = async (userId: string): Promise<IFacultyProfileDetailsResult> => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      role: true,
      institutionId: true,
    },
  });

  if (adminProfile?.role !== AdminRole.FACULTYADMIN) {
    throw createHttpError(403, "Only faculty admins can view faculty profile");
  }

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
      name: true,
    },
  });

  return {
    userId,
    institutionId: adminProfile.institutionId,
    facultyId: faculty?.id ?? null,
    fullName: faculty?.fullName ?? user?.name ?? "",
    shortName: faculty?.shortName ?? null,
    description: faculty?.description ?? null,
  };
};

export const FacultyProfileService = {
  getFacultyProfileDetails,
  updateFacultyDisplayName,
};
