import { AttendanceStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateStudentAdmissionApplicationPayload,
  ICreateStudentApplicationProfilePayload,
  ICreateStudentSubmissionPayload,
  IListStudentRegisteredCoursesQuery,
  IListStudentResultQuery,
  IListStudentTimelineQuery,
  IUpdateStudentApplicationProfilePayload,
  IUpdateStudentProfilePayload,
  IUpdateStudentSubmissionPayload,
} from "./student.interface";

const LAB_MARKS_MAX = {
  attendance: 10,
} as const;

const THEORY_MARKS_MAX = {
  attendance: 7,
} as const;

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function isLabCourse(courseTitle: string) {
  const normalized = courseTitle.toLowerCase();
  return normalized.includes("lab") || normalized.includes("laboratory");
}

function toTwoDecimals(value: number) {
  return Number(value.toFixed(2));
}

function studentSubmissionDelegate() {
  // Keep this access isolated until the language service picks up the newly generated model delegate.
  return (prisma as any).studentClassworkSubmission;
}

function studentApplicationProfileDelegate() {
  return (prisma as any).studentApplicationProfile;
}

function studentAdmissionApplicationDelegate() {
  return (prisma as any).studentAdmissionApplication;
}

function toJsonInputValue(value: unknown) {
  if (value === null || value === undefined) {
    return [] as any;
  }

  return value as any;
}

function hasValidStudentAcademicRecords(records: unknown) {
  if (!Array.isArray(records) || records.length === 0) {
    return false;
  }

  return records.every((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const value = item as Record<string, unknown>;
    const year = Number(value.year);

    return (
      typeof value.examName === "string" &&
      value.examName.trim().length >= 2 &&
      typeof value.institute === "string" &&
      value.institute.trim().length >= 2 &&
      typeof value.result === "string" &&
      value.result.trim().length >= 1 &&
      Number.isFinite(year) &&
      year >= 1950 &&
      year <= 2100
    );
  });
}

function computeStudentApplicationProfileCompleteness(input: {
  headline: string;
  about: string;
  documentUrls: string[];
  academicRecords: unknown;
}) {
  const hasDocuments =
    Array.isArray(input.documentUrls) &&
    input.documentUrls.some((item) => typeof item === "string" && item.trim().length > 0);

  return (
    input.headline.trim().length >= 2 &&
    input.about.trim().length >= 20 &&
    hasDocuments &&
    hasValidStudentAcademicRecords(input.academicRecords)
  );
}

async function resolveStudentContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      accountStatus: true,
      contactNo: true,
      presentAddress: true,
      permanentAddress: true,
      bloodGroup: true,
      gender: true,
    },
  });

  if (!user) {
    throw createHttpError(404, "Student account not found");
  }

  const profile = await prisma.studentProfile.findFirst({
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

async function resolveStudentInstitutionContext(userId: string) {
  const context = await resolveStudentContext(userId);

  if (!context.profile?.institutionId) {
    throw createHttpError(403, "Student is not assigned to any institution yet");
  }

  return {
    user: context.user,
    profile: context.profile,
  };
}

const getProfileOverview = async (userId: string) => {
  const context = await resolveStudentContext(userId);
  const profile = context.profile;

  const applicationProfile = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId,
    },
  });

  const applications = await studentAdmissionApplicationDelegate().findMany({
    where: {
      studentUserId: userId,
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          institutionId: true,
          summary: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const institutionIds: string[] = Array.from(
    new Set(applications.map((item: any) => item.posting?.institutionId).filter(Boolean)),
  );

  const institutions = institutionIds.length
    ? await prisma.institution.findMany({
        where: {
          id: {
            in: institutionIds,
          },
        },
        select: {
          id: true,
          name: true,
          shortName: true,
          institutionLogo: true,
        },
      })
    : [];

  const institutionMap = new Map(institutions.map((item) => [item.id, item]));

  const totalRegisteredCourses = profile?.institutionId
    ? await prisma.courseRegistration.count({
        where: {
          studentProfileId: profile.id,
          institutionId: profile.institutionId,
        },
      })
    : 0;

  const pendingTimelineItems = profile?.institutionId
    ? await prisma.teacherClasswork.count({
        where: {
          institutionId: profile.institutionId,
          section: {
            courseRegistrations: {
              some: {
                studentProfileId: profile.id,
              },
            },
          },
          dueAt: {
            gte: new Date(),
          },
        },
      })
    : 0;

  return {
    hasInstitution: Boolean(profile?.institutionId),
    user: context.user,
    profile: profile
      ? {
          id: profile.id,
          studentsId: profile.studentsId,
          bio: profile.bio,
          institution: profile.institution,
          department: profile.department,
        }
      : null,
    applicationProfile,
    applications: applications.map((item: any) => {
      const institution = item.posting?.institutionId
        ? institutionMap.get(item.posting.institutionId)
        : null;

      return {
        id: item.id,
        coverLetter: item.coverLetter,
        status: item.status,
        institutionResponse: item.institutionResponse,
        reviewedAt: item.reviewedAt,
        appliedAt: item.appliedAt,
        createdAt: item.createdAt,
        posting: {
          id: item.posting.id,
          title: item.posting.title,
          location: item.posting.location,
          summary: item.posting.summary,
        },
        institution: institution
          ? {
              id: institution.id,
              name: institution.name,
              shortName: institution.shortName,
              institutionLogo: institution.institutionLogo,
            }
          : null,
      };
    }),
    stats: {
      totalRegisteredCourses,
      pendingTimelineItems,
    },
  };
};

const updateProfile = async (userId: string, payload: IUpdateStudentProfilePayload) => {
  const context = await resolveStudentContext(userId);

  const nextName = payload.name?.trim();

  return prisma.$transaction(async (trx) => {
    if (nextName) {
      await trx.user.update({
        where: { id: userId },
        data: {
          name: nextName,
        },
      });
    }

    await trx.user.update({
      where: { id: userId },
      data: {
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
    });

    if (context.profile) {
      await trx.studentProfile.update({
        where: {
          id: context.profile.id,
        },
        data: {
          bio: payload.bio === undefined ? undefined : payload.bio.trim() || null,
        },
      });
    }

    return getProfileOverview(userId);
  });
};

const listTimeline = async (userId: string, query: IListStudentTimelineQuery) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  const registrations = await prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId,
    },
    select: {
      sectionId: true,
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
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
    },
  });

  const sectionIds = Array.from(new Set(registrations.map((item) => item.sectionId)));

  if (sectionIds.length === 0) {
    return [];
  }

  const classworks = await prisma.teacherClasswork.findMany({
    where: {
      institutionId: profile.institutionId,
      sectionId: {
        in: sectionIds,
      },
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
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      submissions: {
        where: {
          studentProfileId: profile.id,
        },
        take: 1,
      },
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
  });

  const sectionCourseMap = new Map<string, Array<{ id: string; courseCode: string; courseTitle: string }>>();
  for (const registration of registrations) {
    const key = registration.sectionId;
    const list = sectionCourseMap.get(key) ?? [];
    const exists = list.some((item) => item.id === registration.course.id);
    if (!exists) {
      list.push(registration.course);
      sectionCourseMap.set(key, list);
    }
  }

  return classworks.map((item) => {
    const submission = (item.submissions?.[0] ?? null) as any;

    return {
    id: item.id,
    title: item.title,
    content: item.content,
    type: item.type,
    dueAt: item.dueAt,
    createdAt: item.createdAt,
    section: item.section,
    courses: sectionCourseMap.get(item.sectionId) ?? [],
    teacher: item.teacherProfile,
    submission: submission
      ? {
          id: submission.id,
          responseText: submission.responseText,
          attachmentUrl: submission.attachmentUrl,
          attachmentName: submission.attachmentName,
          submittedAt: submission.submittedAt,
          updatedAt: submission.updatedAt,
        }
      : null,
  };
  });
};

const listRegisteredCourses = async (userId: string, query: IListStudentRegisteredCoursesQuery) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  return prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId,
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
          credits: true,
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
    orderBy: [
      {
        semester: {
          startDate: "desc",
        },
      },
      {
        createdAt: "desc",
      },
    ],
  });
};

const listResults = async (userId: string, query: IListStudentResultQuery) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  const rows = await prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId,
    },
    include: {
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
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
      attendances: {
        select: {
          status: true,
        },
      },
      mark: true,
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (rows.length === 0) {
    return {
      semesterId: query.semesterId,
      summary: {
        totalCourses: 0,
        averageAttendancePercentage: 0,
        averageResult: 0,
      },
      items: [],
    };
  }

  const items = rows.map((registration) => {
    const labCourse = isLabCourse(registration.course.courseTitle);
    const totalAttendance = registration.attendances.length;
    const presentCount = registration.attendances.filter(
      (item) => item.status === AttendanceStatus.PRESENT,
    ).length;
    const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;
    const attendanceMax = labCourse ? LAB_MARKS_MAX.attendance : THEORY_MARKS_MAX.attendance;
    const attendanceMark = toTwoDecimals((attendancePercentage / 100) * attendanceMax);

    let totalMark = attendanceMark;
    if (labCourse) {
      totalMark +=
        (registration.mark?.labReport ?? 0) +
        (registration.mark?.labTask ?? 0) +
        (registration.mark?.project ?? 0) +
        (registration.mark?.projectReport ?? 0) +
        (registration.mark?.presentation ?? 0) +
        (registration.mark?.labEvaluation ?? 0) +
        (registration.mark?.viva ?? 0);
    } else {
      const quizzes = [registration.mark?.quiz1, registration.mark?.quiz2, registration.mark?.quiz3].filter(
        (item): item is number => typeof item === "number",
      );
      const quizAverage = quizzes.length > 0
        ? toTwoDecimals(quizzes.reduce((sum, value) => sum + value, 0) / quizzes.length)
        : 0;

      totalMark +=
        quizAverage +
        (registration.mark?.presentation ?? 0) +
        (registration.mark?.assignment ?? 0) +
        (registration.mark?.midterm ?? 0) +
        (registration.mark?.finalExam ?? 0);
    }

    return {
      courseRegistrationId: registration.id,
      course: registration.course,
      semester: registration.semester,
      teacher: registration.teacherProfile,
      attendance: {
        percentage: toTwoDecimals(attendancePercentage),
        presentClasses: presentCount,
        totalClasses: totalAttendance,
      },
      marks: registration.mark,
      totalMark: toTwoDecimals(totalMark),
      maxTotal: 100,
    };
  });

  const totalCourses = items.length;
  const averageAttendancePercentage =
    items.reduce((sum, item) => sum + item.attendance.percentage, 0) / totalCourses;
  const averageResult = items.reduce((sum, item) => sum + item.totalMark, 0) / totalCourses;

  return {
    semesterId: query.semesterId,
    summary: {
      totalCourses,
      averageAttendancePercentage: toTwoDecimals(averageAttendancePercentage),
      averageResult: toTwoDecimals(averageResult),
    },
    items,
  };
};

const hasSectionAccessForClasswork = async (
  studentProfileId: string,
  institutionId: string,
  classworkId: string,
) => {
  const classwork = await prisma.teacherClasswork.findUnique({
    where: {
      id: classworkId,
    },
    select: {
      id: true,
      sectionId: true,
      departmentId: true,
      institutionId: true,
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
        },
      },
      teacherProfile: {
        select: {
          id: true,
          teacherInitial: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (classwork?.institutionId !== institutionId) {
    throw createHttpError(404, "Classwork not found");
  }

  const registration = await prisma.courseRegistration.findFirst({
    where: {
      studentProfileId,
      institutionId,
      sectionId: classwork.sectionId,
    },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          courseCode: true,
          courseTitle: true,
        },
      },
    },
  });

  if (!registration) {
    throw createHttpError(403, "You are not registered in this classwork section");
  }

  return {
    classwork,
    registration,
  };
};

const listSubmissions = async (
  userId: string,
  query: { classworkId?: string; semesterId?: string },
) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  const semesterSectionIds = query.semesterId
    ? (
        await prisma.courseRegistration.findMany({
          where: {
            studentProfileId: profile.id,
            institutionId: profile.institutionId,
            semesterId: query.semesterId,
          },
          select: {
            sectionId: true,
          },
        })
      ).map((item) => item.sectionId)
    : undefined;

  return studentSubmissionDelegate().findMany({
    where: {
      studentProfileId: profile.id,
      classworkId: query.classworkId,
      classwork: {
        sectionId: semesterSectionIds ? { in: semesterSectionIds } : undefined,
      },
    },
    include: {
      classwork: {
        select: {
          id: true,
          title: true,
          type: true,
          dueAt: true,
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
            },
          },
          teacherProfile: {
            select: {
              id: true,
              teacherInitial: true,
              designation: true,
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

const createSubmission = async (userId: string, payload: ICreateStudentSubmissionPayload) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  const { classwork } = await hasSectionAccessForClasswork(
    profile.id,
    profile.institutionId,
    payload.classworkId,
  );

  const existing = await studentSubmissionDelegate().findUnique({
    where: {
      classworkId_studentProfileId: {
        classworkId: payload.classworkId,
        studentProfileId: profile.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw createHttpError(409, "Submission already exists. Please update it.");
  }

  return studentSubmissionDelegate().create({
    data: {
      classworkId: payload.classworkId,
      studentProfileId: profile.id,
      responseText: payload.responseText?.trim() || null,
      attachmentUrl: payload.attachmentUrl?.trim() || null,
      attachmentName: payload.attachmentName?.trim() || null,
      institutionId: profile.institutionId,
      departmentId: classwork.departmentId,
      submittedAt: new Date(),
    },
    include: {
      classwork: {
        select: {
          id: true,
          title: true,
          type: true,
          dueAt: true,
        },
      },
    },
  });
};

const updateSubmission = async (
  userId: string,
  submissionId: string,
  payload: IUpdateStudentSubmissionPayload,
) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  const existing = await studentSubmissionDelegate().findFirst({
    where: {
      id: submissionId,
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
    },
    select: {
      id: true,
      classworkId: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Submission not found");
  }

  await hasSectionAccessForClasswork(profile.id, profile.institutionId, existing.classworkId);

  return studentSubmissionDelegate().update({
    where: {
      id: submissionId,
    },
    data: {
      responseText: payload.responseText === undefined ? undefined : payload.responseText.trim() || null,
      attachmentUrl: payload.attachmentUrl === undefined ? undefined : payload.attachmentUrl.trim() || null,
      attachmentName:
        payload.attachmentName === undefined ? undefined : payload.attachmentName.trim() || null,
      submittedAt: new Date(),
    },
    include: {
      classwork: {
        select: {
          id: true,
          title: true,
          type: true,
          dueAt: true,
        },
      },
    },
  });
};

const deleteSubmission = async (userId: string, submissionId: string) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  const existing = await studentSubmissionDelegate().findFirst({
    where: {
      id: submissionId,
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Submission not found");
  }

  await studentSubmissionDelegate().delete({
    where: {
      id: submissionId,
    },
  });

  return {
    id: submissionId,
  };
};

const getApplicationProfile = async (userId: string) => {
  return studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId,
    },
  });
};

const createApplicationProfile = async (
  userId: string,
  payload: ICreateStudentApplicationProfilePayload,
) => {
  const existing = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId,
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
    documentUrls: payload.documentUrls.map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue(payload.academicRecords),
  };

  return studentApplicationProfileDelegate().create({
    data: {
      studentUserId: userId,
      ...normalized,
      isComplete: computeStudentApplicationProfileCompleteness(normalized),
    },
  });
};

const updateApplicationProfile = async (
  userId: string,
  payload: IUpdateStudentApplicationProfilePayload,
) => {
  const existing = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Application profile not found");
  }

  const next = {
    headline: payload.headline?.trim() ?? existing.headline,
    about: payload.about?.trim() ?? existing.about,
    documentUrls:
      payload.documentUrls === undefined
        ? existing.documentUrls
        : payload.documentUrls.map((item) => item.trim()).filter(Boolean),
    academicRecords: toJsonInputValue(payload.academicRecords ?? existing.academicRecords),
  };

  return studentApplicationProfileDelegate().update({
    where: {
      studentUserId: userId,
    },
    data: {
      ...next,
      isComplete: computeStudentApplicationProfileCompleteness(next),
    },
  });
};

const deleteApplicationProfile = async (userId: string) => {
  const existing = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Application profile not found");
  }

  await studentApplicationProfileDelegate().delete({
    where: {
      studentUserId: userId,
    },
  });

  return {
    id: existing.id,
  };
};

const applyToAdmissionPosting = async (
  userId: string,
  postingId: string,
  payload: ICreateStudentAdmissionApplicationPayload,
) => {
  const context = await resolveStudentContext(userId);

  const applicationProfile = await studentApplicationProfileDelegate().findUnique({
    where: {
      studentUserId: userId,
    },
    select: {
      id: true,
      isComplete: true,
    },
  });

  if (!applicationProfile?.isComplete) {
    throw createHttpError(
      400,
      "Complete your application profile and upload required documents before applying.",
    );
  }

  if (context.profile?.institutionId) {
    throw createHttpError(400, "You are already assigned to an institution");
  }

  const posting = await prisma.studentAdmissionPost.findUnique({
    where: {
      id: postingId,
    },
    select: {
      id: true,
      title: true,
      location: true,
    },
  });

  if (!posting) {
    throw createHttpError(404, "Student admission posting not found");
  }

  const existing = await studentAdmissionApplicationDelegate().findFirst({
    where: {
      postingId,
      studentUserId: userId,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    throw createHttpError(409, "You already applied to this admission post");
  }

  return studentAdmissionApplicationDelegate().create({
    data: {
      postingId,
      studentUserId: userId,
      studentProfileId: context.profile?.id,
      coverLetter: payload.coverLetter?.trim() || null,
      status: "PENDING",
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });
};

const listMyAdmissionApplications = async (userId: string) => {
  return studentAdmissionApplicationDelegate().findMany({
    where: {
      studentUserId: userId,
    },
    include: {
      posting: {
        select: {
          id: true,
          title: true,
          location: true,
          summary: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getFeePlaceholder = async () => {
  return {
    status: "COMING_SOON",
    message: "Fee payment module will be available soon.",
  };
};

export const StudentService = {
  getProfileOverview,
  getApplicationProfile,
  createApplicationProfile,
  updateApplicationProfile,
  deleteApplicationProfile,
  applyToAdmissionPosting,
  listMyAdmissionApplications,
  updateProfile,
  listTimeline,
  listRegisteredCourses,
  listResults,
  listSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getFeePlaceholder,
};
