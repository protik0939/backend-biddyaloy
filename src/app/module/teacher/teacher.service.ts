import {
  AccountStatus,
  AttendanceStatus,
  TeacherClassworkType,
  TeacherJobApplicationStatus,
} from "../../../generated/prisma/enums";
import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  ICreateTeacherApplicationProfilePayload,
  ICreateTeacherClassworkPayload,
  ICreateTeacherJobApplicationPayload,
  ITeacherAcademicRecord,
  ITeacherExperienceRecord,
  IReviewTeacherJobApplicationPayload,
  IUpdateTeacherApplicationProfilePayload,
  IUpsertSectionMarkPayload,
  IUpdateTeacherClassworkPayload,
  IUpsertSectionAttendancePayload,
} from "./teacher.interface";

const hasValidAcademicRecords = (records: unknown): records is ITeacherAcademicRecord[] => {
  if (!Array.isArray(records) || records.length === 0) {
    return false;
  }

  return records.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const value = item as Record<string, unknown>;
    return (
      typeof value.degree === "string" &&
      value.degree.trim().length >= 2 &&
      typeof value.institute === "string" &&
      value.institute.trim().length >= 2 &&
      typeof value.result === "string" &&
      value.result.trim().length >= 1 &&
      typeof value.year === "number"
    );
  });
};

const hasValidExperienceRecords = (records: unknown): records is ITeacherExperienceRecord[] => {
  if (!Array.isArray(records) || records.length === 0) {
    return false;
  }

  return records.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const value = item as Record<string, unknown>;
    return (
      typeof value.organization === "string" &&
      value.organization.trim().length >= 2 &&
      typeof value.title === "string" &&
      value.title.trim().length >= 2 &&
      typeof value.startDate === "string" &&
      value.startDate.trim().length >= 10
    );
  });
};

const computeApplicationProfileCompleteness = (input: {
  headline: string;
  about: string;
  resumeUrl: string;
  skills: string[];
  academicRecords: unknown;
  experiences: unknown;
}) => {
  const hasSkills = Array.isArray(input.skills) && input.skills.some((item) => item.trim().length > 0);
  return (
    input.headline.trim().length >= 2 &&
    input.about.trim().length >= 20 &&
    input.resumeUrl.trim().length > 0 &&
    hasSkills &&
    hasValidAcademicRecords(input.academicRecords) &&
    hasValidExperienceRecords(input.experiences)
  );
};

const toJsonInputValue = (value: unknown): Prisma.InputJsonValue => {
  if (value === null || value === undefined) {
    return [];
  }

  return value as Prisma.InputJsonValue;
};

const LAB_MARKS_MAX = {
  labReport: 15,
  labTask: 10,
  project: 15,
  projectReport: 10,
  attendance: 10,
  presentation: 10,
  labEvaluation: 20,
  viva: 10,
} as const;

const THEORY_MARKS_MAX = {
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  presentation: 8,
  attendance: 7,
  assignment: 5,
  midterm: 25,
  finalExam: 40,
} as const;

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function normalizeDateToMidnight(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError(400, "Invalid date");
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function getDayRange(value: string) {
  const start = normalizeDateToMidnight(value);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function isLabCourse(courseTitle: string) {
  return /\blab$/i.test(courseTitle.trim());
}

function toTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

type MarkPayloadKey = keyof IUpsertSectionMarkPayload;

function enforceMaxMark(value: number, maxValue: number, fieldName: string) {
  if (value < 0) {
    throw createHttpError(400, `${fieldName} cannot be negative`);
  }

  if (value > maxValue) {
    throw createHttpError(400, `${fieldName} cannot exceed ${maxValue}`);
  }
}

async function resolveTeacherContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      accountStatus: true,
      role: true,
    },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const profile = await prisma.teacherProfile.findFirst({
    where: {
      userId,
    },
    include: {
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true,
        },
      },
      department: {
        select: {
          id: true,
          fullName: true,
          shortName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    user,
    profile,
  };
}

async function resolveTeacherInstitutionContext(userId: string) {
  const context = await resolveTeacherContext(userId);

  if (!context.profile?.institutionId) {
    throw createHttpError(403, "Teacher is not assigned to any institution yet");
  }

  return {
    user: context.user,
    profile: context.profile,
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
    throw createHttpError(403, "Only institution admins can perform this action");
  }

  return adminProfile;
}

const getProfileOverview = async (userId: string) => {
  const context = await resolveTeacherContext(userId);

  const applications = await prisma.teacherJobApplication.findMany({
    where: {
      teacherUserId: userId,
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true,
        },
      },
      department: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const applicationProfile = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId,
    },
  });

  return {
    hasInstitution: Boolean(context.profile?.institutionId),
    user: context.user,
    profile: context.profile,
    applicationProfile,
    applications,
  };
};

const getApplicationProfile = async (userId: string) => {
  return prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId,
    },
  });
};

const createApplicationProfile = async (
  userId: string,
  payload: ICreateTeacherApplicationProfilePayload,
) => {
  const existing = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw createHttpError(409, "Application profile already exists. Use update instead.");
  }

  const normalized = {
    headline: payload.headline.trim(),
    about: payload.about.trim(),
    resumeUrl: payload.resumeUrl.trim(),
    portfolioUrl: payload.portfolioUrl?.trim() || null,
    skills: payload.skills.map((item) => item.trim()).filter(Boolean),
    certifications: (payload.certifications ?? []).map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue(payload.academicRecords),
    experiences: toJsonInputValue(payload.experiences),
  };

  return prisma.teacherApplicationProfile.create({
    data: {
      teacherUserId: userId,
      ...normalized,
      isComplete: computeApplicationProfileCompleteness(normalized),
    },
  });
};

const updateApplicationProfile = async (
  userId: string,
  payload: IUpdateTeacherApplicationProfilePayload,
) => {
  const existing = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Application profile not found");
  }

  const next = {
    headline: payload.headline?.trim() ?? existing.headline,
    about: payload.about?.trim() ?? existing.about,
    resumeUrl: payload.resumeUrl?.trim() ?? existing.resumeUrl,
    portfolioUrl:
      payload.portfolioUrl === undefined ? existing.portfolioUrl : payload.portfolioUrl.trim() || null,
    skills:
      payload.skills === undefined
        ? existing.skills
        : payload.skills.map((item) => item.trim()).filter(Boolean),
    certifications:
      payload.certifications === undefined
        ? existing.certifications
        : payload.certifications.map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue(payload.academicRecords ?? existing.academicRecords),
    experiences: toJsonInputValue(payload.experiences ?? existing.experiences),
  };

  return prisma.teacherApplicationProfile.update({
    where: {
      teacherUserId: userId,
    },
    data: {
      ...next,
      isComplete: computeApplicationProfileCompleteness(next),
    },
  });
};

const deleteApplicationProfile = async (userId: string) => {
  const existing = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Application profile not found");
  }

  await prisma.teacherApplicationProfile.delete({
    where: {
      teacherUserId: userId,
    },
  });

  return {
    id: existing.id,
  };
};

const applyToTeacherJobPosting = async (
  userId: string,
  postingId: string,
  payload: ICreateTeacherJobApplicationPayload,
) => {
  const context = await resolveTeacherContext(userId);

  const applicationProfile = await prisma.teacherApplicationProfile.findUnique({
    where: {
      teacherUserId: userId,
    },
    select: {
      id: true,
      isComplete: true,
    },
  });

  if (!applicationProfile?.isComplete) {
    throw createHttpError(
      400,
      "Complete your application profile (academic records, experiences, resume, and skills) before applying.",
    );
  }

  if (context.profile?.institutionId) {
    throw createHttpError(400, "You are already assigned to an institution");
  }

  const posting = await prisma.teacherJobPost.findUnique({
    where: {
      id: postingId,
    },
    select: {
      id: true,
      institutionId: true,
      departmentId: true,
    },
  });

  if (!posting) {
    throw createHttpError(404, "Teacher posting not found");
  }

  const existing = await prisma.teacherJobApplication.findFirst({
    where: {
      postingId,
      teacherUserId: userId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw createHttpError(409, "You already applied to this posting");
  }

  return prisma.teacherJobApplication.create({
    data: {
      postingId,
      teacherUserId: userId,
      teacherProfileId: context.profile?.id,
      institutionId: posting.institutionId,
      departmentId: posting.departmentId,
      coverLetter: payload.coverLetter?.trim() || null,
      status: TeacherJobApplicationStatus.PENDING,
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true,
        },
      },
      department: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });
};

const listMyJobApplications = async (userId: string) => {
  return prisma.teacherJobApplication.findMany({
    where: {
      teacherUserId: userId,
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          summary: true,
        },
      },
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true,
        },
      },
      department: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const listAssignedSectionsWithStudents = async (userId: string) => {
  const context = await resolveTeacherInstitutionContext(userId);

  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
    },
    include: {
      section: {
        include: {
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
            },
          },
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              accountStatus: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const grouped = new Map<string, {
    section: {
      id: string;
      name: string;
      description: string | null;
      sectionCapacity: number | null;
      semester: {
        id: string;
        name: string;
        startDate: Date;
        endDate: Date;
      };
      batch: {
        id: string;
        name: string;
      } | null;
    };
    students: Array<{
      courseRegistrationId: string;
      course: {
        id: string;
        courseCode: string;
        courseTitle: string;
      };
      studentProfile: {
        id: string;
        studentInitial: string;
        studentsId: string;
        bio: string | null;
        user: {
          id: string;
          name: string;
          email: string;
          accountStatus: string;
        };
      };
    }>;
  }>();

  for (const registration of registrations) {
    const existing = grouped.get(registration.sectionId);
    const studentRecord = {
      courseRegistrationId: registration.id,
      course: registration.course,
      studentProfile: registration.studentProfile,
    };

    if (!existing) {
      grouped.set(registration.sectionId, {
        section: {
          id: registration.section.id,
          name: registration.section.name,
          description: registration.section.description,
          sectionCapacity: registration.section.sectionCapacity,
          semester: registration.section.semester,
          batch: registration.section.batch,
        },
        students: [studentRecord],
      });
      continue;
    }

    const duplicateStudent = existing.students.some(
      (item) => item.courseRegistrationId === registration.id,
    );

    if (!duplicateStudent) {
      existing.students.push(studentRecord);
    }
  }

  return Array.from(grouped.values()).sort((a, b) =>
    a.section.name.localeCompare(b.section.name, undefined, { sensitivity: "base" }),
  );
};

const listClassworks = async (
  userId: string,
  query: { sectionId?: string; type?: TeacherClassworkType },
) => {
  const context = await resolveTeacherInstitutionContext(userId);

  if (query.sectionId) {
    const hasAccess = await prisma.courseRegistration.findFirst({
      where: {
        teacherProfileId: context.profile.id,
        sectionId: query.sectionId,
        institutionId: context.profile.institutionId,
      },
      select: {
        id: true,
      },
    });

    if (!hasAccess) {
      throw createHttpError(403, "You are not assigned to this section");
    }
  }

  return prisma.teacherClasswork.findMany({
    where: {
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      sectionId: query.sectionId,
      type: query.type,
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
          semester: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
            },
          },
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });
};

const createClasswork = async (userId: string, payload: ICreateTeacherClassworkPayload) => {
  const context = await resolveTeacherInstitutionContext(userId);

  const sectionAccess = await prisma.courseRegistration.findFirst({
    where: {
      teacherProfileId: context.profile.id,
      sectionId: payload.sectionId,
      institutionId: context.profile.institutionId,
    },
    select: {
      id: true,
      departmentId: true,
    },
  });

  if (!sectionAccess) {
    throw createHttpError(403, "You are not assigned to this section");
  }

  return prisma.teacherClasswork.create({
    data: {
      title: payload.title.trim(),
      content: payload.content?.trim() || null,
      type: payload.type,
      dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
      sectionId: payload.sectionId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      departmentId: sectionAccess.departmentId,
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const updateClasswork = async (
  userId: string,
  classworkId: string,
  payload: IUpdateTeacherClassworkPayload,
) => {
  const context = await resolveTeacherInstitutionContext(userId);

  const existing = await prisma.teacherClasswork.findFirst({
    where: {
      id: classworkId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Classwork not found");
  }

  return prisma.teacherClasswork.update({
    where: {
      id: classworkId,
    },
    data: {
      type: payload.type,
      title: payload.title?.trim(),
      content: payload.content === undefined ? undefined : payload.content.trim() || null,
      dueAt: payload.dueAt ? new Date(payload.dueAt) : undefined,
    },
    include: {
      section: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const deleteClasswork = async (userId: string, classworkId: string) => {
  const context = await resolveTeacherInstitutionContext(userId);

  const existing = await prisma.teacherClasswork.findFirst({
    where: {
      id: classworkId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Classwork not found");
  }

  await prisma.teacherClasswork.delete({
    where: {
      id: classworkId,
    },
  });

  return {
    id: classworkId,
  };
};

const getSectionAttendanceForDay = async (userId: string, sectionId: string, date: string) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const { start, end } = getDayRange(date);

  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      sectionId,
      institutionId: context.profile.institutionId,
    },
    include: {
      studentProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      attendances: {
        where: {
          date: {
            gte: start,
            lt: end,
          },
        },
        select: {
          id: true,
          status: true,
          date: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (registrations.length === 0) {
    throw createHttpError(404, "No students found for this section");
  }

  return {
    sectionId,
    date: start,
    items: registrations.map((registration) => ({
      courseRegistrationId: registration.id,
      studentProfile: {
        id: registration.studentProfile.id,
        studentInitial: registration.studentProfile.studentInitial,
        studentsId: registration.studentProfile.studentsId,
        user: registration.studentProfile.user,
      },
      course: registration.course,
      status: registration.attendances[0]?.status ?? AttendanceStatus.ABSENT,
      attendanceId: registration.attendances[0]?.id ?? null,
    })),
  };
};

const upsertSectionAttendanceForDay = async (
  userId: string,
  payload: IUpsertSectionAttendancePayload,
) => {
  const context = await resolveTeacherInstitutionContext(userId);
  const attendanceDate = normalizeDateToMidnight(payload.date);

  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      sectionId: payload.sectionId,
      institutionId: context.profile.institutionId,
    },
    select: {
      id: true,
    },
  });

  if (registrations.length === 0) {
    throw createHttpError(404, "No students found for this section");
  }

  const allowedRegistrationIds = new Set(registrations.map((item) => item.id));

  for (const item of payload.items) {
    if (!allowedRegistrationIds.has(item.courseRegistrationId)) {
      throw createHttpError(400, "One or more attendance records are outside your assigned section");
    }
  }

  await prisma.$transaction(
    payload.items.map((item) =>
      prisma.attendance.upsert({
        where: {
          courseRegistrationId_date: {
            courseRegistrationId: item.courseRegistrationId,
            date: attendanceDate,
          },
        },
        create: {
          courseRegistrationId: item.courseRegistrationId,
          date: attendanceDate,
          status: item.status,
        },
        update: {
          status: item.status,
        },
      }),
    ),
  );

  return getSectionAttendanceForDay(userId, payload.sectionId, attendanceDate.toISOString());
};

const listSectionMarks = async (userId: string, sectionId: string) => {
  const context = await resolveTeacherInstitutionContext(userId);

  const registrations = await prisma.courseRegistration.findMany({
    where: {
      teacherProfileId: context.profile.id,
      sectionId,
      institutionId: context.profile.institutionId,
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
      studentProfile: {
        select: {
          id: true,
          studentInitial: true,
          studentsId: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      attendances: {
        select: {
          status: true,
        },
      },
      mark: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (registrations.length === 0) {
    throw createHttpError(404, "No students found for this section");
  }

  return registrations.map((registration) => {
    const labCourse = isLabCourse(registration.course.courseTitle);
    const totalAttendance = registration.attendances.length;
    const presentCount = registration.attendances.filter(
      (item) => item.status === AttendanceStatus.PRESENT,
    ).length;
    const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;
    const attendanceMax = labCourse ? LAB_MARKS_MAX.attendance : THEORY_MARKS_MAX.attendance;
    const attendanceMark = toTwoDecimals((attendancePercentage / 100) * attendanceMax);

    if (labCourse) {
      const labManualTotal =
        (registration.mark?.labReport ?? 0) +
        (registration.mark?.labTask ?? 0) +
        (registration.mark?.project ?? 0) +
        (registration.mark?.projectReport ?? 0) +
        (registration.mark?.presentation ?? 0) +
        (registration.mark?.labEvaluation ?? 0) +
        (registration.mark?.viva ?? 0);

      return {
        courseRegistrationId: registration.id,
        isLabCourse: true,
        course: registration.course,
        studentProfile: registration.studentProfile,
        marks: registration.mark,
        attendance: {
          percentage: toTwoDecimals(attendancePercentage),
          mark: attendanceMark,
          max: attendanceMax,
          totalClasses: totalAttendance,
          presentClasses: presentCount,
        },
        quizAverage: null,
        totalMark: toTwoDecimals(labManualTotal + attendanceMark),
        maxTotal: 100,
      };
    }

    const quizzes = [registration.mark?.quiz1, registration.mark?.quiz2, registration.mark?.quiz3].filter(
      (item): item is number => typeof item === "number",
    );
    const quizAverage = quizzes.length > 0 ? toTwoDecimals(quizzes.reduce((acc, item) => acc + item, 0) / quizzes.length) : 0;

    const theoryManualTotal =
      quizAverage +
      (registration.mark?.presentation ?? 0) +
      (registration.mark?.assignment ?? 0) +
      (registration.mark?.midterm ?? 0) +
      (registration.mark?.finalExam ?? 0);

    return {
      courseRegistrationId: registration.id,
      isLabCourse: false,
      course: registration.course,
      studentProfile: registration.studentProfile,
      marks: registration.mark,
      attendance: {
        percentage: toTwoDecimals(attendancePercentage),
        mark: attendanceMark,
        max: attendanceMax,
        totalClasses: totalAttendance,
        presentClasses: presentCount,
      },
      quizAverage,
      totalMark: toTwoDecimals(theoryManualTotal + attendanceMark),
      maxTotal: 100,
    };
  });
};

const upsertSectionMark = async (
  userId: string,
  courseRegistrationId: string,
  payload: IUpsertSectionMarkPayload,
) => {
  const context = await resolveTeacherInstitutionContext(userId);

  const registration = await prisma.courseRegistration.findFirst({
    where: {
      id: courseRegistrationId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
    },
    include: {
      course: {
        select: {
          id: true,
          courseTitle: true,
        },
      },
    },
  });

  if (!registration) {
    throw createHttpError(404, "Course registration not found for this teacher");
  }

  const labCourse = isLabCourse(registration.course.courseTitle);

  const allowedWithMax: Partial<Record<MarkPayloadKey, number>> = labCourse
    ? {
        labReport: LAB_MARKS_MAX.labReport,
        labTask: LAB_MARKS_MAX.labTask,
        project: LAB_MARKS_MAX.project,
        projectReport: LAB_MARKS_MAX.projectReport,
        presentation: LAB_MARKS_MAX.presentation,
        labEvaluation: LAB_MARKS_MAX.labEvaluation,
        viva: LAB_MARKS_MAX.viva,
      }
    : {
        quiz1: THEORY_MARKS_MAX.quiz1,
        quiz2: THEORY_MARKS_MAX.quiz2,
        quiz3: THEORY_MARKS_MAX.quiz3,
        presentation: THEORY_MARKS_MAX.presentation,
        assignment: THEORY_MARKS_MAX.assignment,
        midterm: THEORY_MARKS_MAX.midterm,
        finalExam: THEORY_MARKS_MAX.finalExam,
      };

  const dataToSave: Record<string, number> = {};

  for (const [key, rawValue] of Object.entries(payload)) {
    const field = key as MarkPayloadKey;
    const value = rawValue;

    if (typeof value !== "number") {
      continue;
    }

    const max = allowedWithMax[field];
    if (typeof max !== "number") {
      throw createHttpError(400, `${field} is not allowed for this course type`);
    }

    enforceMaxMark(value, max, field);
    dataToSave[field] = toTwoDecimals(value);
  }

  if (Object.keys(dataToSave).length === 0) {
    throw createHttpError(400, "No valid marks field provided for this course type");
  }

  await prisma.teacherMark.upsert({
    where: {
      courseRegistrationId,
    },
    create: {
      courseRegistrationId,
      teacherProfileId: context.profile.id,
      institutionId: context.profile.institutionId,
      departmentId: registration.departmentId,
      ...dataToSave,
    },
    update: {
      ...dataToSave,
    },
  });

  const sectionRows = await listSectionMarks(userId, registration.sectionId);
  return sectionRows.find((item) => item.courseRegistrationId === courseRegistrationId) ?? null;
};

const listTeacherApplicationsForAdmin = async (
  userId: string,
  status?: TeacherJobApplicationStatus,
) => {
  const admin = await resolveAdminContext(userId);

  return prisma.teacherJobApplication.findMany({
    where: {
      institutionId: admin.institutionId,
      status,
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
      teacherUser: {
        select: {
          id: true,
          name: true,
          email: true,
          accountStatus: true,
          teacherApplicationProfile: {
            select: {
              id: true,
              headline: true,
              about: true,
              resumeUrl: true,
              portfolioUrl: true,
              skills: true,
              certifications: true,
              academicRecords: true,
              experiences: true,
              isComplete: true,
              updatedAt: true,
            },
          },
        },
      },
      reviewerUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      department: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const reviewTeacherApplication = async (
  reviewerUserId: string,
  applicationId: string,
  payload: IReviewTeacherJobApplicationPayload,
) => {
  const admin = await resolveAdminContext(reviewerUserId);

  const application = await prisma.teacherJobApplication.findFirst({
    where: {
      id: applicationId,
      institutionId: admin.institutionId,
    },
    include: {
      posting: {
        select: {
          departmentId: true,
        },
      },
    },
  });

  if (!application) {
    throw createHttpError(404, "Application not found");
  }

  if (
    application.status === TeacherJobApplicationStatus.APPROVED ||
    application.status === TeacherJobApplicationStatus.REJECTED
  ) {
    throw createHttpError(400, "Application has already been reviewed");
  }

  if (payload.status === TeacherJobApplicationStatus.REJECTED) {
    return prisma.teacherJobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: TeacherJobApplicationStatus.REJECTED,
        institutionResponse: payload.rejectionReason?.trim() || null,
        reviewerUserId,
        reviewedAt: new Date(),
      },
    });
  }

  if (payload.status === TeacherJobApplicationStatus.SHORTLISTED) {
    return prisma.teacherJobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: TeacherJobApplicationStatus.SHORTLISTED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: new Date(),
      },
    });
  }

  const targetDepartmentId = payload.departmentId ?? application.posting.departmentId ?? application.departmentId;

  if (!targetDepartmentId) {
    throw createHttpError(400, "departmentId is required to approve this application");
  }

  const department = await prisma.department.findFirst({
    where: {
      id: targetDepartmentId,
      faculty: {
        institutionId: admin.institutionId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!department) {
    throw createHttpError(404, "Department not found for this institution");
  }

  return prisma.$transaction(async (trx) => {
    const existingProfile = await trx.teacherProfile.findFirst({
      where: {
        userId: application.teacherUserId,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let teacherProfileId = existingProfile?.id;

    const teacherInitial = payload.teacherInitial?.trim();
    const teachersId = payload.teachersId?.trim();
    const designation = payload.designation?.trim();

    if (!teacherInitial || !teachersId || !designation) {
      throw createHttpError(400, "teacherInitial, teachersId and designation are required for approval");
    }

    if (teacherProfileId) {
      await trx.teacherProfile.update({
        where: {
          id: teacherProfileId,
        },
        data: {
          teacherInitial,
          teachersId,
          designation,
          bio: payload.bio?.trim() || undefined,
          institutionId: admin.institutionId,
          departmentId: targetDepartmentId,
        },
      });
    } else {
      const createdProfile = await trx.teacherProfile.create({
        data: {
          teacherInitial,
          teachersId,
          designation,
          bio: payload.bio?.trim() || null,
          userId: application.teacherUserId,
          institutionId: admin.institutionId,
          departmentId: targetDepartmentId,
        },
        select: {
          id: true,
        },
      });

      teacherProfileId = createdProfile.id;
    }

    await trx.user.update({
      where: {
        id: application.teacherUserId,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    return trx.teacherJobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: TeacherJobApplicationStatus.APPROVED,
        institutionResponse: payload.responseMessage?.trim() || null,
        reviewerUserId,
        reviewedAt: new Date(),
        departmentId: targetDepartmentId,
        teacherProfileId,
      },
      include: {
        teacherUser: {
          select: {
            id: true,
            name: true,
            email: true,
            accountStatus: true,
          },
        },
        department: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  });
};

export const TeacherService = {
  getProfileOverview,
  getApplicationProfile,
  createApplicationProfile,
  updateApplicationProfile,
  deleteApplicationProfile,
  applyToTeacherJobPosting,
  listMyJobApplications,
  listAssignedSectionsWithStudents,
  listClassworks,
  createClasswork,
  updateClasswork,
  deleteClasswork,
  getSectionAttendanceForDay,
  upsertSectionAttendanceForDay,
  listSectionMarks,
  upsertSectionMark,
  listTeacherApplicationsForAdmin,
  reviewTeacherApplication,
};
