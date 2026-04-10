import { AdminRole } from "../../../generated/prisma/enums";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostingPayload,
  IPublicPostingExploreQuery,
  IUpdatePostingPayload,
  PublicPostingSort,
  PublicPostingType,
} from "./posting.interface";

const DEFAULT_PUBLIC_PAGE_SIZE = 12;
const MAX_PUBLIC_PAGE_SIZE = 40;

type PublicPostingRecord = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  institutionId: string;
  facultyId: string | null;
  departmentId: string | null;
  programId: string | null;
};

type ListPublicPostingOptions = {
  limit?: number;
  search?: string;
  location?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

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

function normalizePage(value: number | undefined) {
  if (!value || !Number.isFinite(value) || value < 1) {
    return 1;
  }

  return Math.floor(value);
}

function normalizePageSize(value: number | undefined) {
  if (!value || !Number.isFinite(value) || value < 1) {
    return DEFAULT_PUBLIC_PAGE_SIZE;
  }

  return Math.min(Math.floor(value), MAX_PUBLIC_PAGE_SIZE);
}

function normalizePublicSort(sort?: string): PublicPostingSort {
  switch (sort) {
    case "oldest":
      return "oldest";
    case "title_asc":
      return "title_asc";
    case "title_desc":
      return "title_desc";
    default:
      return "newest";
  }
}

type PublicPostingOrderBy = {
  createdAt?: Prisma.SortOrder;
  title?: Prisma.SortOrder;
};

function getPublicPostingOrderBy(sort: PublicPostingSort): PublicPostingOrderBy {
  if (sort === "oldest") {
    return { createdAt: "asc" };
  }

  if (sort === "title_asc") {
    return { title: "asc" };
  }

  if (sort === "title_desc") {
    return { title: "desc" };
  }

  return { createdAt: "desc" };
}

function buildPublicPostingWhere(search?: string, location?: string, department?: string) {
  const normalizedSearch = normalizeSearch(search);
  const normalizedLocation = normalizeSearch(location);
  const normalizedDepartment = normalizeSearch(department);

  const where: Record<string, unknown> = {};

  if (normalizedSearch) {
    where.OR = [
      { title: { contains: normalizedSearch, mode: "insensitive" } },
      { summary: { contains: normalizedSearch, mode: "insensitive" } },
      { location: { contains: normalizedSearch, mode: "insensitive" } },
      { institution: { name: { contains: normalizedSearch, mode: "insensitive" } } },
      { department: { fullName: { contains: normalizedSearch, mode: "insensitive" } } },
      { program: { title: { contains: normalizedSearch, mode: "insensitive" } } },
    ];
  }

  if (normalizedLocation) {
    where.location = { contains: normalizedLocation, mode: "insensitive" };
  }

  if (normalizedDepartment) {
    where.department = {
      fullName: {
        contains: normalizedDepartment,
        mode: "insensitive",
      },
    };
  }

  return where;
}

function buildPostingMedia(institutionLogo: string | null) {
  const fallbackBanner = "/biddyaloycover.webp";
  const fallbackLogo = "/logo/BidyaloylogoIconOnly.svg";

  return [institutionLogo, fallbackBanner, fallbackLogo].filter(
    (item): item is string => Boolean(item),
  );
}

function toPublicPostingItem(
  post: PublicPostingRecord,
  maps: Awaited<ReturnType<typeof buildLookupMaps>>,
  postingType: PublicPostingType,
) {
  const institution = maps.institutionMap.get(post.institutionId);
  const faculty = post.facultyId ? maps.facultyMap.get(post.facultyId) : null;
  const department = post.departmentId ? maps.departmentMap.get(post.departmentId) : null;
  const program = post.programId ? maps.programMap.get(post.programId) : null;
  const scoreSeed = post.title.length + post.summary.length;
  const rating = Number((3.8 + (scoreSeed % 12) / 10).toFixed(1));

  return {
    id: post.id,
    postingType,
    title: post.title,
    summary: post.summary,
    details: post.details,
    location: post.location,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    institution: institution?.name ?? "Unknown institution",
    institutionShortName: institution?.shortName ?? null,
    institutionLogo: institution?.institutionLogo ?? null,
    facultyName: faculty?.fullName ?? null,
    departmentName: department?.fullName ?? null,
    programTitle: program?.title ?? null,
    media: buildPostingMedia(institution?.institutionLogo ?? null),
    status: "Open",
    rating,
    reviewCount: 16 + (scoreSeed % 41),
  };
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

type AdminContext = Awaited<ReturnType<typeof resolveAdminContext>>;

async function resolveInstitutionAdminScopedIds(
  context: AdminContext,
  payload: ICreatePostingPayload,
) {
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

async function resolveFacultyAdminScopedIds(
  context: AdminContext,
  payload: ICreatePostingPayload,
) {
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

async function resolveDepartmentAdminScopedIds(context: AdminContext) {
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

async function resolveScopedIds(
  userId: string,
  payload: ICreatePostingPayload,
) {
  const context = await resolveAdminContext(userId);

  if (context.role === AdminRole.INSTITUTIONADMIN) {
    return resolveInstitutionAdminScopedIds(context, payload);
  }

  if (context.role === AdminRole.FACULTYADMIN) {
    return resolveFacultyAdminScopedIds(context, payload);
  }

  if (context.role === AdminRole.DEPARTMENTADMIN) {
    return resolveDepartmentAdminScopedIds(context);
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

const toPostingUpdateData = (payload: IUpdatePostingPayload) => ({
  title: payload.title?.trim(),
  location: payload.location?.trim() || undefined,
  summary: payload.summary?.trim(),
  details: payload.details?.map((item) => item.trim()).filter(Boolean),
});

const listTeacherJobPostsManaged = async (userId: string, search?: string) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch(search);

  const posts = await prisma.teacherJobPost.findMany({
    where: {
      institutionId: context.institutionId,
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch, mode: "insensitive" } },
              { summary: { contains: normalizedSearch, mode: "insensitive" } },
              { location: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
      updatedAt: post.updatedAt,
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null,
    };
  });
};

const listStudentAdmissionPostsManaged = async (userId: string, search?: string) => {
  const context = await resolveAdminContext(userId);
  const normalizedSearch = normalizeSearch(search);

  const posts = await prisma.studentAdmissionPost.findMany({
    where: {
      institutionId: context.institutionId,
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch, mode: "insensitive" } },
              { summary: { contains: normalizedSearch, mode: "insensitive" } },
              { location: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
      updatedAt: post.updatedAt,
      institution: institution?.name ?? "Unknown institution",
      institutionShortName: institution?.shortName ?? null,
      institutionLogo: institution?.institutionLogo ?? null,
      facultyName: faculty?.fullName ?? null,
      departmentName: department?.fullName ?? null,
      programTitle: program?.title ?? null,
    };
  });
};

const updateTeacherJobPost = async (userId: string, postingId: string, payload: IUpdatePostingPayload) => {
  const context = await resolveAdminContext(userId);

  const existing = await prisma.teacherJobPost.findUnique({
    where: {
      id: postingId,
    },
    select: {
      id: true,
      institutionId: true,
    },
  });

  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError(404, "Teacher job post not found");
  }

  return prisma.teacherJobPost.update({
    where: {
      id: postingId,
    },
    data: toPostingUpdateData(payload),
  });
};

const updateStudentAdmissionPost = async (userId: string, postingId: string, payload: IUpdatePostingPayload) => {
  const context = await resolveAdminContext(userId);

  const existing = await prisma.studentAdmissionPost.findUnique({
    where: {
      id: postingId,
    },
    select: {
      id: true,
      institutionId: true,
    },
  });

  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError(404, "Student admission post not found");
  }

  return prisma.studentAdmissionPost.update({
    where: {
      id: postingId,
    },
    data: toPostingUpdateData(payload),
  });
};

const deleteTeacherJobPost = async (userId: string, postingId: string) => {
  const context = await resolveAdminContext(userId);

  const existing = await prisma.teacherJobPost.findUnique({
    where: {
      id: postingId,
    },
    select: {
      id: true,
      institutionId: true,
    },
  });

  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError(404, "Teacher job post not found");
  }

  await prisma.teacherJobPost.delete({
    where: {
      id: postingId,
    },
  });

  return {
    id: postingId,
  };
};

const deleteStudentAdmissionPost = async (userId: string, postingId: string) => {
  const context = await resolveAdminContext(userId);

  const existing = await prisma.studentAdmissionPost.findUnique({
    where: {
      id: postingId,
    },
    select: {
      id: true,
      institutionId: true,
    },
  });

  if (existing?.institutionId !== context.institutionId) {
    throw createHttpError(404, "Student admission post not found");
  }

  await prisma.studentAdmissionPost.delete({
    where: {
      id: postingId,
    },
  });

  return {
    id: postingId,
  };
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

const listTeacherJobPostsPublic = async (options: ListPublicPostingOptions = {}) => {
  let posts: Awaited<ReturnType<typeof prisma.teacherJobPost.findMany>>;

  const page = normalizePage(options.page);
  const pageSize = normalizePageSize(options.pageSize ?? options.limit);
  const sort = normalizePublicSort(options.sort);
  const where = buildPublicPostingWhere(options.search, options.location);

  try {
    posts = await prisma.teacherJobPost.findMany({
      where: where as never,
      orderBy: getPublicPostingOrderBy(sort) as Prisma.TeacherJobPostOrderByWithRelationInput,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }

  const maps = await buildLookupMaps(posts);

  return posts.map((post) =>
    toPublicPostingItem(post, maps, "teacher"),
  );
};

const listStudentAdmissionPostsPublic = async (options: ListPublicPostingOptions = {}) => {
  let posts: Awaited<ReturnType<typeof prisma.studentAdmissionPost.findMany>>;

  const page = normalizePage(options.page);
  const pageSize = normalizePageSize(options.pageSize ?? options.limit);
  const sort = normalizePublicSort(options.sort);
  const where = buildPublicPostingWhere(options.search, options.location);

  try {
    posts = await prisma.studentAdmissionPost.findMany({
      where: where as never,
      orderBy: getPublicPostingOrderBy(sort) as Prisma.StudentAdmissionPostOrderByWithRelationInput,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }

  const maps = await buildLookupMaps(posts);

  return posts.map((post) =>
    toPublicPostingItem(post, maps, "student"),
  );
};

const listPublicExplorePostings = async (query: IPublicPostingExploreQuery) => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize);
  const sort = normalizePublicSort(query.sort);
  const where = buildPublicPostingWhere(query.search, query.location, query.department);

  let posts: PublicPostingRecord[] = [];
  let total = 0;

  try {
    if (query.type === "student") {
      const [count, rows] = await Promise.all([
        prisma.studentAdmissionPost.count({ where: where as never }),
        prisma.studentAdmissionPost.findMany({
          where: where as never,
          orderBy: getPublicPostingOrderBy(sort) as never,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      total = count;
      posts = rows;
    } else {
      const [count, rows] = await Promise.all([
        prisma.teacherJobPost.count({ where: where as never }),
        prisma.teacherJobPost.findMany({
          where: where as never,
          orderBy: getPublicPostingOrderBy(sort) as never,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      total = count;
      posts = rows;
    }
  } catch (error) {
    if (isMissingTableError(error)) {
      return {
        type: query.type,
        sort,
        pagination: {
          page,
          pageSize,
          total: 0,
          totalPages: 0,
        },
        filters: {
          locations: [] as string[],
          departments: [] as string[],
        },
        items: [],
      };
    }

    throw error;
  }

  const maps = await buildLookupMaps(posts);
  const items = posts.map((post) => toPublicPostingItem(post, maps, query.type));

  const locations = Array.from(
    new Set(items.map((item) => item.location).filter((item): item is string => Boolean(item))),
  ).slice(0, 20);

  const departments = Array.from(
    new Set(items.map((item) => item.departmentName).filter((item): item is string => Boolean(item))),
  ).slice(0, 20);

  return {
    type: query.type,
    sort,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: total > 0 ? Math.ceil(total / pageSize) : 0,
    },
    filters: {
      locations,
      departments,
    },
    items,
  };
};

function buildRelatedPostingWhere(post: PublicPostingRecord) {
  return {
    id: { not: post.id },
    OR: [
      { institutionId: post.institutionId },
      ...(post.departmentId ? [{ departmentId: post.departmentId }] : []),
      ...(post.programId ? [{ programId: post.programId }] : []),
    ],
  };
}

async function loadStudentPostingWithRelated(postingId: string) {
  const post = await prisma.studentAdmissionPost.findUnique({ where: { id: postingId } });
  if (!post) {
    return { post: null, related: [] as PublicPostingRecord[] };
  }

  const related = await prisma.studentAdmissionPost.findMany({
    where: buildRelatedPostingWhere(post) as never,
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return { post, related };
}

async function loadTeacherPostingWithRelated(postingId: string) {
  const post = await prisma.teacherJobPost.findUnique({ where: { id: postingId } });
  if (!post) {
    return { post: null, related: [] as PublicPostingRecord[] };
  }

  const related = await prisma.teacherJobPost.findMany({
    where: buildRelatedPostingWhere(post) as never,
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  });

  return { post, related };
}

async function loadPostingWithRelated(postingType: PublicPostingType, postingId: string) {
  if (postingType === "student") {
    return loadStudentPostingWithRelated(postingId);
  }

  return loadTeacherPostingWithRelated(postingId);
}

const getPublicPostingDetails = async (postingType: PublicPostingType, postingId: string) => {
  let data: { post: PublicPostingRecord | null; related: PublicPostingRecord[] };

  try {
    data = await loadPostingWithRelated(postingType, postingId);
  } catch (error) {
    if (isMissingTableError(error)) {
      throw createHttpError(404, "Posting not found");
    }

    throw error;
  }

  if (!data.post) {
    throw createHttpError(404, "Posting not found");
  }

  const maps = await buildLookupMaps([data.post, ...data.related]);
  const details = toPublicPostingItem(data.post, maps, postingType);
  const relatedItems = data.related.map((item) => toPublicPostingItem(item, maps, postingType));

  return {
    ...details,
    overview: details.summary,
    keyInfo: [
      { label: "Institution", value: details.institution },
      { label: "Department", value: details.departmentName ?? "N/A" },
      { label: "Program", value: details.programTitle ?? "N/A" },
      { label: "Location", value: details.location ?? "Not specified" },
      { label: "Posted", value: details.createdAt.toISOString() },
      { label: "Status", value: details.status },
    ],
    reviews: {
      averageRating: details.rating,
      totalReviews: details.reviewCount,
      highlights: [
        "Clear requirements and role expectations",
        "Responsive institution onboarding process",
        "Strong role-based workflow support",
      ],
    },
    relatedItems,
  };
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
  listPublicExplorePostings,
  getPublicPostingDetails,
  getPostingOptions,
  listTeacherJobPostsManaged,
  listStudentAdmissionPostsManaged,
  updateTeacherJobPost,
  updateStudentAdmissionPost,
  deleteTeacherJobPost,
  deleteStudentAdmissionPost,
};
