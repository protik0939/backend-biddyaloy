import { AdminRole, InstitutionApplicationStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateInstitutionApplication, IReviewInstitutionApplication } from "./institutionApplication.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

const create = async (userId: string, payload: ICreateInstitutionApplication) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      institutionId: true,
    },
  });

  if (adminProfile?.institutionId) {
    throw createHttpError(400, "You are already assigned to an institution");
  }

  const existingPending = await prisma.institutionApplication.findFirst({
    where: {
      applicantUserId: userId,
      status: InstitutionApplicationStatus.PENDING,
    },
    select: {
      id: true,
    },
  });

  if (existingPending) {
    throw createHttpError(400, "You already have a pending application");
  }

  return prisma.institutionApplication.create({
    data: {
      applicantUserId: userId,
      institutionName: payload.institutionName,
      description: payload.description,
      shortName: payload.shortName,
      institutionType: payload.institutionType,
      institutionLogo: payload.institutionLogo,
      status: InstitutionApplicationStatus.PENDING,
    },
  });
};

const getMyApplications = async (userId: string) => {
  return prisma.institutionApplication.findMany({
    where: {
      applicantUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const listForSuperAdmin = async (status?: InstitutionApplicationStatus) => {
  return prisma.institutionApplication.findMany({
    where: status
      ? {
          status,
        }
      : undefined,
    include: {
      applicantUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviewedByUser: {
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const review = async (
  reviewerUserId: string,
  applicationId: string,
  payload: IReviewInstitutionApplication,
) => {
  const application = await prisma.institutionApplication.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw createHttpError(404, "Application not found");
  }

  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError(400, "Application already reviewed");
  }

  if (payload.status === InstitutionApplicationStatus.REJECTED) {
    return prisma.institutionApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: InstitutionApplicationStatus.REJECTED,
        rejectionReason: payload.rejectionReason ?? null,
        reviewedByUserId: reviewerUserId,
        reviewedAt: new Date(),
      },
    });
  }

  return prisma.$transaction(async (trx) => {
    const institution = await trx.institution.create({
      data: {
        name: application.institutionName,
        description: application.description,
        shortName: application.shortName,
        type: application.institutionType,
        institutionLogo: application.institutionLogo,
      },
      select: {
        id: true,
      },
    });

    await trx.adminProfile.upsert({
      where: {
        userId: application.applicantUserId,
      },
      create: {
        userId: application.applicantUserId,
        role: AdminRole.INSTITUTIONADMIN,
        institutionId: institution.id,
      },
      update: {
        institutionId: institution.id,
      },
    });

    return trx.institutionApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: InstitutionApplicationStatus.APPROVED,
        rejectionReason: null,
        reviewedByUserId: reviewerUserId,
        reviewedAt: new Date(),
        institutionId: institution.id,
      },
    });
  });
};

export const InstitutionApplicationService = {
  create,
  getMyApplications,
  listForSuperAdmin,
  review,
};
