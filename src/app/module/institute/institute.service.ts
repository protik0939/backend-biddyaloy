import { Institution } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

const createInstitution = async (payload: Institution) => {
  const data = await prisma.institution.create({
    data: payload,
  });
  if (!data) {
    throw new Error("Failed to create institution");
  }
  return data;
};

const listInstitutionOptions = async (userId: string, search?: string) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      institutionId: true,
    },
  });

  if (!adminProfile?.institutionId) {
    throw createHttpError(403, "Only institution admins can list institution options");
  }

  const normalizedSearch = search?.trim();

  return prisma.institution.findMany({
    where: {
      id: {
        not: adminProfile.institutionId,
      },
      ...(normalizedSearch
        ? {
            OR: [
              {
                name: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                shortName: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      institutionLogo: true,
      type: true,
    },
    orderBy: {
      name: "asc",
    },
    take: 50,
  });
};

export const InstituteService = {
  createInstitution,
  listInstitutionOptions,
}; 