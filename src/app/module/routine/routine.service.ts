import { prisma } from "../../lib/prisma";
import { IListRoutineQuery } from "./routine.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

async function resolveInstitutionId(userId: string) {
  const [adminProfile, teacherProfile, studentProfile] = await Promise.all([
    prisma.adminProfile.findUnique({
      where: { userId },
      select: { institutionId: true },
    }),
    prisma.teacherProfile.findFirst({
      where: { userId },
      select: { institutionId: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentProfile.findFirst({
      where: { userId },
      select: { institutionId: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const institutionId =
    adminProfile?.institutionId ?? teacherProfile?.institutionId ?? studentProfile?.institutionId;

  if (!institutionId) {
    throw createHttpError(403, "No institution context found for this account");
  }

  return institutionId;
}

const listRoutines = async (userId: string, query: IListRoutineQuery) => {
  const institutionId = await resolveInstitutionId(userId);
  const normalizedSearch = normalizeSearch(query.search);
  const normalizedTeacherInitial = query.teacherInitial?.trim();
  const courseRegistrationFilter: Record<string, unknown> = {};

  if (query.sectionId) {
    courseRegistrationFilter.sectionId = query.sectionId;
  }

  if (normalizedTeacherInitial) {
    courseRegistrationFilter.teacherProfile = {
      teacherInitial: {
        contains: normalizedTeacherInitial,
        mode: "insensitive",
      },
    };
  }

  return prisma.routine.findMany({
    where: {
      institutionId,
      ...(query.semesterId
        ? {
            schedule: {
              semesterId: query.semesterId,
            },
          }
        : {}),
      ...(Object.keys(courseRegistrationFilter).length > 0
        ? {
            courseRegistration: courseRegistrationFilter,
          }
        : {}),
      ...(normalizedSearch
        ? {
            OR: [
              { name: { contains: normalizedSearch, mode: "insensitive" } },
              { description: { contains: normalizedSearch, mode: "insensitive" } },
              { classRoom: { roomNo: { contains: normalizedSearch, mode: "insensitive" } } },
              { classRoom: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { courseRegistration: { section: { name: { contains: normalizedSearch, mode: "insensitive" } } } },
              { courseRegistration: { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } } },
              { courseRegistration: { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } } },
              { courseRegistration: { teacherProfile: { teacherInitial: { contains: normalizedSearch, mode: "insensitive" } } } },
              { schedule: { name: { contains: normalizedSearch, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      schedule: true,
      classRoom: true,
      courseRegistration: {
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              courseTitle: true,
            },
          },
          section: {
            select: {
              id: true,
              name: true,
              batch: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
            },
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              teachersId: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ schedule: { startTime: "asc" } }, { createdAt: "desc" }],
  });
};

export const RoutineService = {
  listRoutines,
};
