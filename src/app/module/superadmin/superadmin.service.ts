import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

// Helper function for HTTP errors
function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

// Pagination types
export interface PaginationQuery {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Admin/Staff types
export interface AdminListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN";
  adminRole?: "INSTITUTIONADMIN" | "FACULTYADMIN" | "DEPARTMENTADMIN" | null;
  institutionName?: string | null;
  createdAt: string;
}

// Institution types
export interface InstitutionListItem {
  id: string;
  name: string;
  shortName: string | null;
  type: string;
  logo: string | null;
  createdAt: string;
  studentCount: number;
  teacherCount: number;
}

// Student types
export interface StudentListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  institutionName: string;
  departmentName?: string | null;
  enrolledAt: string;
}

// Teacher types
export interface TeacherListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  institutionName: string;
  departmentName?: string | null;
  joinedAt: string;
}

export type HighlightType =
  | "USER_REGISTERED"
  | "INSTITUTION_APPLICATION"
  | "TEACHER_JOB_APPLICATION"
  | "STUDENT_ADMISSION_APPLICATION";

export interface RecentHighlightItem {
  id: string;
  type: HighlightType;
  actorName: string;
  actorEmail: string;
  title: string;
  description: string;
  createdAt: string;
}

// Helper functions
const normalizePage = (value: any): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

const normalizePageSize = (value: any, max = 50): number => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return 20;
  return Math.min(parsed, max);
};

// Service methods
const listAdmins = async (query: PaginationQuery): Promise<PaginatedResponse<AdminListItem>> => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize, 50);
  const skip = (page - 1) * pageSize;

  const where: Prisma.AdminProfileWhereInput = query.search
    ? {
        OR: [
          {
            user: {
              is: {
                name: { contains: query.search, mode: Prisma.QueryMode.insensitive },
              },
            },
          },
          {
            user: {
              is: {
                email: { contains: query.search, mode: Prisma.QueryMode.insensitive },
              },
            },
          },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.adminProfile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        role: true,
        institution: {
          select: { name: true },
        },
        user: {
          select: { name: true, email: true, role: true },
        },
        createdAt: true,
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
    }),
    prisma.adminProfile.count({ where }),
  ]);

  const mappedItems: AdminListItem[] = items.map((admin) => ({
    id: admin.id,
    userId: admin.userId,
    name: admin.user.name,
    email: admin.user.email,
    role: admin.user.role as "SUPERADMIN" | "ADMIN",
    adminRole: admin.role as "INSTITUTIONADMIN" | "FACULTYADMIN" | "DEPARTMENTADMIN",
    institutionName: admin.institution?.name ?? null,
    createdAt: admin.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const listInstitutions = async (
  query: PaginationQuery,
): Promise<PaginatedResponse<InstitutionListItem>> => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize, 50);
  const skip = (page - 1) * pageSize;

  const where = query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { shortName: { contains: query.search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    (prisma as any).institution.findMany({
      where,
      select: {
        id: true,
        name: true,
        shortName: true,
        type: true,
        institutionLogo: true,
        createdAt: true,
        _count: {
          select: {
            studentProfiles: true,
            teacherProfiles: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
    }) as Promise<any[]>,
    (prisma as any).institution.count({ where }),
  ]);

  const mappedItems: InstitutionListItem[] = items.map((institution) => ({
    id: institution.id,
    name: institution.name,
    shortName: institution.shortName,
    type: institution.type,
    logo: institution.institutionLogo,
    createdAt: institution.createdAt.toISOString(),
    studentCount: institution._count?.studentProfiles ?? 0,
    teacherCount: institution._count?.teacherProfiles ?? 0,
  }));

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const listStudents = async (
  query: PaginationQuery,
): Promise<PaginatedResponse<StudentListItem>> => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize, 50);
  const skip = (page - 1) * pageSize;

  const where = query.search
    ? {
        OR: [
          { user: { name: { contains: query.search, mode: "insensitive" } } },
          { user: { email: { contains: query.search, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    (prisma as any).studentProfile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        institution: { select: { name: true } },
        department: { select: { fullName: true } },
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
    }),
    (prisma as any).studentProfile.count({ where }),
  ]);

  const mappedItems: StudentListItem[] = items.map((student: any) => ({
    id: student.id,
    userId: student.userId,
    name: student.user.name,
    email: student.user.email,
    institutionName: student.institution?.name ?? "Unknown",
    departmentName: student.department?.fullName ?? null,
    enrolledAt: student.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const listTeachers = async (
  query: PaginationQuery,
): Promise<PaginatedResponse<TeacherListItem>> => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize, 50);
  const skip = (page - 1) * pageSize;

  const where = query.search
    ? {
        OR: [
          { user: { name: { contains: query.search, mode: "insensitive" } } },
          { user: { email: { contains: query.search, mode: "insensitive" } } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    (prisma as any).teacherProfile.findMany({
      where,
      select: {
        id: true,
        userId: true,
        institution: { select: { name: true } },
        department: { select: { fullName: true } },
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
    }),
    (prisma as any).teacherProfile.count({ where }),
  ]);

  const mappedItems: TeacherListItem[] = items.map((teacher: any) => ({
    id: teacher.id,
    userId: teacher.userId,
    name: teacher.user.name,
    email: teacher.user.email,
    institutionName: teacher.institution?.name ?? "Unknown",
    departmentName: teacher.department?.fullName ?? null,
    joinedAt: teacher.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: mappedItems,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const listRecentHighlights = async (
  query: PaginationQuery,
): Promise<PaginatedResponse<RecentHighlightItem>> => {
  const page = normalizePage(query.page);
  const pageSize = normalizePageSize(query.pageSize, 50);
  const skip = (page - 1) * pageSize;
  const take = page * pageSize;

  const [users, institutionApplications, teacherApplications, studentApplications, counts] =
    await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
        take,
      }),
      prisma.institutionApplication.findMany({
        select: {
          id: true,
          institutionName: true,
          applicantUser: {
            select: {
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
        take,
      }),
      prisma.teacherJobApplication.findMany({
        select: {
          id: true,
          posting: {
            select: {
              title: true,
            },
          },
          teacherUser: {
            select: {
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
        take,
      }),
      prisma.studentAdmissionApplication.findMany({
        select: {
          id: true,
          posting: {
            select: {
              title: true,
            },
          },
          studentUser: {
            select: {
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
        orderBy: { createdAt: query.sort === "asc" ? "asc" : "desc" },
        take,
      }),
      Promise.all([
        prisma.user.count(),
        prisma.institutionApplication.count(),
        prisma.teacherJobApplication.count(),
        prisma.studentAdmissionApplication.count(),
      ]),
    ]);

  const timeline: Array<RecentHighlightItem & { createdAtDate: Date }> = [
    ...users.map((user) => ({
      id: `user-${user.id}`,
      type: "USER_REGISTERED" as const,
      actorName: user.name,
      actorEmail: user.email,
      title: `${user.name} registered`,
      description: `New ${user.role.toLowerCase()} account registration`,
      createdAt: user.createdAt.toISOString(),
      createdAtDate: user.createdAt,
    })),
    ...institutionApplications.map((application) => ({
      id: `institution-application-${application.id}`,
      type: "INSTITUTION_APPLICATION" as const,
      actorName: application.applicantUser.name,
      actorEmail: application.applicantUser.email,
      title: `${application.applicantUser.name} submitted institution application`,
      description: `Institution: ${application.institutionName}`,
      createdAt: application.createdAt.toISOString(),
      createdAtDate: application.createdAt,
    })),
    ...teacherApplications.map((application) => ({
      id: `teacher-application-${application.id}`,
      type: "TEACHER_JOB_APPLICATION" as const,
      actorName: application.teacherUser.name,
      actorEmail: application.teacherUser.email,
      title: `${application.teacherUser.name} applied for teacher post`,
      description: `Post: ${application.posting.title}`,
      createdAt: application.createdAt.toISOString(),
      createdAtDate: application.createdAt,
    })),
    ...studentApplications.map((application) => ({
      id: `student-application-${application.id}`,
      type: "STUDENT_ADMISSION_APPLICATION" as const,
      actorName: application.studentUser.name,
      actorEmail: application.studentUser.email,
      title: `${application.studentUser.name} submitted admission application`,
      description: `Post: ${application.posting.title}`,
      createdAt: application.createdAt.toISOString(),
      createdAtDate: application.createdAt,
    })),
  ];

  timeline.sort((a, b) => {
    if (query.sort === "asc") {
      return a.createdAtDate.getTime() - b.createdAtDate.getTime();
    }
    return b.createdAtDate.getTime() - a.createdAtDate.getTime();
  });

  const items = timeline.slice(skip, skip + pageSize).map(({ createdAtDate: _, ...item }) => item);
  const total = counts.reduce((sum, value) => sum + value, 0);
  const totalPages = Math.ceil(total / pageSize);

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const SuperAdminService = {
  listAdmins,
  listInstitutions,
  listStudents,
  listTeachers,
  listRecentHighlights,
};
