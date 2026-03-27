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

const getSuperAdminSummary = async (userId: string) => {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 14);

  const [
    currentUser,
    totalInstitutions,
    totalStudents,
    totalTeachers,
    totalStaffAccounts,
    pendingApplications,
    approvedToday,
    rejectedApplications,
    activeSessions,
    newSignupsLast7Days,
    newSignupsPrevious7Days,
    newInstitutionsThisMonth,
    newAdmissionsThisMonth,
    pendingTeacherApprovals,
    verifiedTeacherProfiles,
    institutionTypeGroups,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    }),
    prisma.institution.count(),
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.adminProfile.count(),
    prisma.institutionApplication.count({
      where: {
        status: InstitutionApplicationStatus.PENDING,
      },
    }),
    prisma.institutionApplication.count({
      where: {
        status: InstitutionApplicationStatus.APPROVED,
        reviewedAt: {
          gte: dayStart,
        },
      },
    }),
    prisma.institutionApplication.count({
      where: {
        status: InstitutionApplicationStatus.REJECTED,
      },
    }),
    prisma.session.count({
      where: {
        expiresAt: {
          gt: now,
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo,
        },
      },
    }),
    prisma.institution.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    }),
    prisma.studentProfile.count({
      where: {
        createdAt: {
          gte: monthStart,
        },
      },
    }),
    prisma.teacherJobApplication.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.teacherProfile.count(),
    prisma.institution.groupBy({
      by: ["type"],
      _count: {
        id: true,
      },
    }),
  ]);

  const growthBase = Math.max(newSignupsPrevious7Days, 1);
  const weeklyGrowthPercentage = Number(
    (((newSignupsLast7Days - newSignupsPrevious7Days) / growthBase) * 100).toFixed(2),
  );

  const institutionTypeBreakdown = institutionTypeGroups.reduce(
    (acc, item) => {
      const key = item.type ?? "OTHER";
      acc[key] = item._count.id;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    user: currentUser,
    stats: {
      totalInstitutions,
      totalStudents,
      totalTeachers,
      totalStaffAccounts,
      activeSessions,
      pendingApplications,
      approvedToday,
      rejectedApplications,
      newSignupsLast7Days,
      weeklyGrowthPercentage,
      pendingInstitutionVerifications: pendingApplications,
      newInstitutionsThisMonth,
      newAdmissionsThisMonth,
      pendingTeacherApprovals,
      verifiedTeacherProfiles,
      institutionTypeBreakdown,
    },
  };
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
  getSuperAdminSummary,
  review,
};
