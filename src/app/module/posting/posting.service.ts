import { AdminRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostingPayload } from "./posting.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  if (maybeCode === "P2021") {
    return true;
  }

  const maybeMessage = (error as { message?: unknown }).message;
  return typeof maybeMessage === "string" && maybeMessage.includes("does not exist");
}

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

async function resolveAdminContext(userId: string) {
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
    throw createHttpError(403, "Only admin users under an institution can manage postings");
  }

  return adminProfile;
}

async function resolveScopedIds(
  userId: string,
  payload: ICreatePostingPayload,
) {
  const context = await resolveAdminContext(userId);

  if (context.role === AdminRole.INSTITUTIONADMIN) {
    if (!payload.facultyId || !payload.departmentId) {
      throw createHttpError(
        400,
        "Institution admin must provide facultyId and departmentId",
      );
    }

    const faculty = await prisma.faculty.findFirst({
      where: {
        id: payload.facultyId,
        institutionId: context.institutionId,
      },
      select: {
        id: true,
      },
    });

    if (!faculty) {
      throw createHttpError(404, "Faculty not found for this institution");
    }

    const department = await prisma.department.findFirst({
      where: {
        id: payload.departmentId,
        facultyId: payload.facultyId,
        faculty: {
          institutionId: context.institutionId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!department) {
      throw createHttpError(404, "Department not found under selected faculty");
    }

    return {
      institutionId: context.institutionId,
      facultyId: payload.facultyId,
      departmentId: payload.departmentId,
      programId: null,
    };
  }

  if (context.role === AdminRole.FACULTYADMIN) {
    if (!payload.departmentId) {
      throw createHttpError(400, "Faculty admin must provide departmentId");
    }

    const department = await prisma.department.findFirst({
      where: {
        id: payload.departmentId,
        faculty: {
          institutionId: context.institutionId,
        },
      },
      select: {
        id: true,
        facultyId: true,
      },
    });

    if (!department) {
      throw createHttpError(404, "Department not found for this institution");
    }

    if (!department.facultyId) {
      throw createHttpError(400, "Department is not assigned to a faculty");
    }

    return {
      institutionId: context.institutionId,
      facultyId: department.facultyId,
      departmentId: department.id,
      programId: null,
    };
  }

  if (context.role === AdminRole.DEPARTMENTADMIN) {
    const departments = await prisma.department.findMany({
      where: {
        faculty: {
          institutionId: context.institutionId,
        },
      },
      select: {
        id: true,
        facultyId: true,
      },
      take: 2,
      orderBy: {
        createdAt: "asc",
      },
    });

    if (departments.length === 0) {
      throw createHttpError(404, "Department not found for this institution");
    }

    if (departments.length > 1) {
      throw createHttpError(400, "Multiple departments found. Contact institution admin to resolve mapping");
    }

    return {
      institutionId: context.institutionId,
      facultyId: departments[0].facultyId,
      departmentId: departments[0].id,
      programId: null,
    };
  }

  throw createHttpError(403, "Unsupported admin role for posting management");
}

const createTeacherJobPost = async (userId: string, payload: ICreatePostingPayload) => {
  const scoped = await resolveScopedIds(userId, payload);

  return prisma.teacherJobPost.create({
    data: {
      title: payload.title.trim(),
      location: payload.location?.trim() || null,
      summary: payload.summary.trim(),
      details: payload.details?.map((item) => item.trim()).filter(Boolean) ?? [],
      institutionId: scoped.institutionId,
      facultyId: scoped.facultyId,
      departmentId: scoped.departmentId,
      programId: scoped.programId,
      createdByUserId: userId,
    },
  });
};

const createStudentAdmissionPost = async (userId: string, payload: ICreatePostingPayload) => {
  const scoped = await resolveScopedIds(userId, payload);

  return prisma.studentAdmissionPost.create({
    data: {
      title: payload.title.trim(),
      location: payload.location?.trim() || null,
      summary: payload.summary.trim(),
      details: payload.details?.map((item) => item.trim()).filter(Boolean) ?? [],
      institutionId: scoped.institutionId,
      facultyId: scoped.facultyId,
      departmentId: scoped.departmentId,
      programId: scoped.programId,
      createdByUserId: userId,
    },
  });
};

async function buildLookupMaps(posts: Array<{
  institutionId: string;
  facultyId: string | null;
  departmentId: string | null;
  programId: string | null;
}>) {
  const institutionIds = Array.from(new Set(posts.map((item) => item.institutionId)));
  const facultyIds = Array.from(
    new Set(posts.map((item) => item.facultyId).filter((item): item is string => Boolean(item))),
  );
  const departmentIds = Array.from(
    new Set(posts.map((item) => item.departmentId).filter((item): item is string => Boolean(item))),
  );
  const programIds = Array.from(
    new Set(posts.map((item) => item.programId).filter((item): item is string => Boolean(item))),
  );

  const [institutions, faculties, departments, programs] = await Promise.all([
    institutionIds.length
      ? prisma.institution.findMany({
          where: {
            id: {
              in: institutionIds,
            },
          },
          select: {
            id: true,
            name: true,
            institutionLogo: true,
            shortName: true,
          },
        })
      : Promise.resolve([]),
    facultyIds.length
      ? prisma.faculty.findMany({
          where: {
            id: {
              in: facultyIds,
            },
          },
          select: {
            id: true,
            fullName: true,
          },
        })
      : Promise.resolve([]),
    departmentIds.length
      ? prisma.department.findMany({
          where: {
            id: {
              in: departmentIds,
            },
          },
          select: {
            id: true,
            fullName: true,
          },
        })
      : Promise.resolve([]),
    programIds.length
      ? prisma.program.findMany({
          where: {
            id: {
              in: programIds,
            },
          },
          select: {
            id: true,
            title: true,
            departmentId: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    institutionMap: new Map(institutions.map((item) => [item.id, item])),
    facultyMap: new Map(faculties.map((item) => [item.id, item])),
    departmentMap: new Map(departments.map((item) => [item.id, item])),
    programMap: new Map(programs.map((item) => [item.id, item])),
  };
}

const listTeacherJobPostsPublic = async (limit = 50) => {
  let posts: Awaited<ReturnType<typeof prisma.teacherJobPost.findMany>>;

  try {
    posts = await prisma.teacherJobPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(limit, 100),
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }

  const maps = await buildLookupMaps(posts);

  return posts.map((post) => {
    const institution = maps.institutionMap.get(post.institutionId);
    const faculty = post.facultyId ? maps.facultyMap.get(post.facultyId) : null;
    const department = post.departmentId ? maps.departmentMap.get(post.departmentId) : null;
    const program = post.programId ? maps.programMap.get(post.programId) : null;

    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      details: post.details,
      location: post.location,
      createdAt: post.createdAt,
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null,
    };
  });
};

const listStudentAdmissionPostsPublic = async (limit = 50) => {
  let posts: Awaited<ReturnType<typeof prisma.studentAdmissionPost.findMany>>;

  try {
    posts = await prisma.studentAdmissionPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(limit, 100),
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }

  const maps = await buildLookupMaps(posts);

  return posts.map((post) => {
    const institution = maps.institutionMap.get(post.institutionId);
    const faculty = post.facultyId ? maps.facultyMap.get(post.facultyId) : null;
    const department = post.departmentId ? maps.departmentMap.get(post.departmentId) : null;
    const program = post.programId ? maps.programMap.get(post.programId) : null;

    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      details: post.details,
      location: post.location,
      createdAt: post.createdAt,
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null,
    };
  });
};

const getPostingOptions = async (userId: string, search?: string) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch(search);

  if (context.role === AdminRole.INSTITUTIONADMIN) {
    const [faculties, departments] = await Promise.all([
      prisma.faculty.findMany({
        where: {
          institutionId: context.institutionId,
          ...(normalizedSearch
            ? {
                OR: [{ fullName: { contains: normalizedSearch, mode: "insensitive" } }],
              }
            : {}),
        },
        select: {
          id: true,
          fullName: true,
        },
        orderBy: {
          fullName: "asc",
        },
      }),
      prisma.department.findMany({
        where: {
          faculty: {
            institutionId: context.institutionId,
          },
          ...(normalizedSearch
            ? {
                OR: [{ fullName: { contains: normalizedSearch, mode: "insensitive" } }],
              }
            : {}),
        },
        select: {
          id: true,
          fullName: true,
          facultyId: true,
        },
        orderBy: {
          fullName: "asc",
        },
      }),
    ]);

    return {
      faculties,
      departments,
    };
  }

  if (context.role === AdminRole.FACULTYADMIN) {
    const departments = await prisma.department.findMany({
      where: {
        faculty: {
          institutionId: context.institutionId,
        },
        ...(normalizedSearch
          ? {
              OR: [{ fullName: { contains: normalizedSearch, mode: "insensitive" } }],
            }
          : {}),
      },
      select: {
        id: true,
        fullName: true,
        facultyId: true,
      },
      orderBy: {
        fullName: "asc",
      },
    });

    return {
      faculties: [],
      departments,
    };
  }

  if (context.role === AdminRole.DEPARTMENTADMIN) {
    return {
      faculties: [],
      departments: [],
    };
  }

  throw createHttpError(403, "Unsupported admin role for posting options");
};

export const PostingService = {
  createTeacherJobPost,
  createStudentAdmissionPost,
  listTeacherJobPostsPublic,
  listStudentAdmissionPostsPublic,
  getPostingOptions,
};
