import { AttendanceStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateStudentAdmissionApplicationPayload,
  ICreateStudentApplicationProfilePayload,
  ICreateStudentSubmissionPayload,
  IInitiateStudentFeePaymentPayload,
  IListStudentRegisteredCoursesQuery,
  IListStudentResultQuery,
  IListStudentTimelineQuery,
  IStudentFeeGatewayCallbackQuery,
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

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

function toMoneyNumber(value: unknown) {
  const numericValue = Number(value ?? 0);
  return Number(numericValue.toFixed(2));
}

function toSafeUpper(value: string | undefined, fallbackValue: string) {
  const normalized = value?.trim().toUpperCase();
  return normalized || fallbackValue;
}

function areMoneyValuesEqual(left: unknown, right: unknown) {
  return Math.abs(toMoneyNumber(left) - toMoneyNumber(right)) < 0.01;
}

function createTransactionId() {
  const randomSuffix = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `BIDDY-${Date.now()}-${randomSuffix}`;
}

function getBackendPublicUrl() {
  return (
    process.env.BACKEND_PUBLIC_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:5000"
  );
}

function getFrontendPublicUrl() {
  return (
    process.env.FRONTEND_PUBLIC_URL?.trim().replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function getSslCommerzBaseUrl() {
  const envBaseUrl = process.env.SSLCOMMERZ_BASE_URL?.trim().replace(/\/$/, "");
  return envBaseUrl || "https://sandbox.sslcommerz.com";
}

function getSslCommerzCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();

  if (!storeId || !storePassword) {
    throw createHttpError(
      500,
      "SSLCommerz credentials are not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD.",
    );
  }

  return {
    storeId,
    storePassword,
  };
}

function normalizeCallbackQuery(query: Record<string, unknown>): IStudentFeeGatewayCallbackQuery {
  const readValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return typeof value[0] === "string" ? value[0] : undefined;
    }

    return typeof value === "string" ? value : undefined;
  };

  return {
    tran_id: readValue(query.tran_id),
    val_id: readValue(query.val_id),
    amount: readValue(query.amount),
    currency: readValue(query.currency),
    status: readValue(query.status),
  };
}

function buildFeeRedirectUrl(status: "success" | "failed" | "cancelled", tranId?: string) {
  const frontendBase = getFrontendPublicUrl();
  const searchParams = new URLSearchParams({
    paymentStatus: status,
  });

  if (tranId) {
    searchParams.set("tranId", tranId);
  }

  return `${frontendBase}/fees?${searchParams.toString()}`;
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

function feeConfigurationDelegate() {
  return (prisma as any).departmentSemesterFeeConfiguration;
}

function feePaymentDelegate() {
  return (prisma as any).studentFeePayment;
}

const FEE_PAYMENT_MODE_MONTHLY = "MONTHLY";

const FEE_PAYMENT_STATUS_INITIATED = "INITIATED";
const FEE_PAYMENT_STATUS_PENDING = "PENDING";
const FEE_PAYMENT_STATUS_SUCCESS = "SUCCESS";
const FEE_PAYMENT_STATUS_FAILED = "FAILED";
const FEE_PAYMENT_STATUS_CANCELLED = "CANCELLED";

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
  const normalizedSearch = normalizeSearch(query.search);

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
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch, mode: "insensitive" } },
              { content: { contains: normalizedSearch, mode: "insensitive" } },
              { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
            ],
          }
        : {}),
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
  const normalizedSearch = normalizeSearch(query.search);

  return prisma.courseRegistration.findMany({
    where: {
      studentProfileId: profile.id,
      institutionId: profile.institutionId,
      semesterId: query.semesterId,
      ...(normalizedSearch
        ? {
            OR: [
              { course: { courseCode: { contains: normalizedSearch, mode: "insensitive" } } },
              { course: { courseTitle: { contains: normalizedSearch, mode: "insensitive" } } },
              { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { semester: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              { teacherProfile: { user: { is: { name: { contains: normalizedSearch, mode: "insensitive" } } } } },
            ],
          }
        : {}),
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
  query: { classworkId?: string; semesterId?: string; search?: string },
) => {
  const { profile } = await resolveStudentInstitutionContext(userId);
  const normalizedSearch = normalizeSearch(query.search);

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
        ...(normalizedSearch
          ? {
              OR: [
                { title: { contains: normalizedSearch, mode: "insensitive" } },
                { content: { contains: normalizedSearch, mode: "insensitive" } },
                { section: { name: { contains: normalizedSearch, mode: "insensitive" } } },
              ],
            }
          : {}),
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

const getFeeOverview = async (userId: string) => {
  const { profile } = await resolveStudentInstitutionContext(userId);

  if (!profile.departmentId) {
    throw createHttpError(403, "Student is not assigned to a department yet");
  }

  const feeConfigurations = await feeConfigurationDelegate().findMany({
    where: {
      institutionId: profile.institutionId,
      departmentId: profile.departmentId,
      isActive: true,
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: {
      semester: {
        startDate: "desc",
      },
    },
  });

  const successfulPayments = await feePaymentDelegate().findMany({
    where: {
      studentProfileId: profile.id,
      status: FEE_PAYMENT_STATUS_SUCCESS,
    },
    select: {
      id: true,
      semesterId: true,
      amount: true,
      monthsCovered: true,
      paymentMode: true,
      currency: true,
      tranId: true,
      paidAt: true,
      createdAt: true,
      gatewayCardType: true,
      gatewayBankTranId: true,
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const paidBySemester = new Map<string, number>();
  for (const payment of successfulPayments) {
    paidBySemester.set(
      payment.semesterId,
      toMoneyNumber((paidBySemester.get(payment.semesterId) ?? 0) + toMoneyNumber(payment.amount)),
    );
  }

  const feeItems = feeConfigurations.map((configuration: any) => {
    const totalFeeAmount = toMoneyNumber(configuration.totalFeeAmount);
    const monthlyFeeAmount = toMoneyNumber(configuration.monthlyFeeAmount);
    const paidAmount = toMoneyNumber(paidBySemester.get(configuration.semesterId) ?? 0);
    const dueAmount = Math.max(0, toMoneyNumber(totalFeeAmount - paidAmount));

    return {
      feeConfigurationId: configuration.id,
      semester: configuration.semester,
      totalFeeAmount,
      monthlyFeeAmount,
      paidAmount,
      dueAmount,
      currency: configuration.currency,
    };
  });

  const totalConfiguredAmount = feeItems.reduce((sum, item) => sum + item.totalFeeAmount, 0);
  const totalPaidAmount = feeItems.reduce((sum, item) => sum + item.paidAmount, 0);

  return {
    summary: {
      totalConfiguredAmount: toMoneyNumber(totalConfiguredAmount),
      totalPaidAmount: toMoneyNumber(totalPaidAmount),
      totalDueAmount: toMoneyNumber(Math.max(0, totalConfiguredAmount - totalPaidAmount)),
    },
    feeItems,
    paymentHistory: successfulPayments.map((payment: any) => ({
      ...payment,
      amount: toMoneyNumber(payment.amount),
    })),
  };
};

const initiateFeePayment = async (userId: string, payload: IInitiateStudentFeePaymentPayload) => {
  const { profile, user } = await resolveStudentInstitutionContext(userId);

  if (!profile.departmentId) {
    throw createHttpError(403, "Student is not assigned to a department yet");
  }

  const feeConfiguration = await feeConfigurationDelegate().findFirst({
    where: {
      institutionId: profile.institutionId,
      departmentId: profile.departmentId,
      semesterId: payload.semesterId,
      isActive: true,
    },
    include: {
      semester: {
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  if (!feeConfiguration) {
    throw createHttpError(404, "No fee configuration found for the selected semester/session");
  }

  const successfulPayments = await feePaymentDelegate().findMany({
    where: {
      studentProfileId: profile.id,
      semesterId: payload.semesterId,
      status: FEE_PAYMENT_STATUS_SUCCESS,
    },
    select: {
      amount: true,
    },
  });

  const totalFeeAmount = toMoneyNumber(feeConfiguration.totalFeeAmount);
  const monthlyFeeAmount = toMoneyNumber(feeConfiguration.monthlyFeeAmount);
  const paidAmount = toMoneyNumber(
    successfulPayments.reduce((sum, item) => sum + toMoneyNumber(item.amount), 0),
  );
  const dueAmount = toMoneyNumber(Math.max(0, totalFeeAmount - paidAmount));

  if (dueAmount <= 0) {
    throw createHttpError(409, "No due amount left for this semester/session");
  }

  const mode = payload.paymentMode;
  let requestedAmount = dueAmount;
  let monthsCovered = 0;

  if (mode === FEE_PAYMENT_MODE_MONTHLY) {
    const monthsCount = payload.monthsCount ?? 0;
    if (!monthsCount || monthsCount < 1) {
      throw createHttpError(400, "monthsCount must be at least 1 for monthly payment");
    }

    requestedAmount = toMoneyNumber(Math.min(dueAmount, monthlyFeeAmount * monthsCount));
    monthsCovered = monthsCount;
  } else {
    monthsCovered = Math.max(1, Math.ceil(dueAmount / Math.max(monthlyFeeAmount, 1)));
  }

  if (requestedAmount <= 0) {
    throw createHttpError(400, "Invalid payment amount");
  }

  const transactionId = createTransactionId();
  const backendBaseUrl = getBackendPublicUrl();
  const { storeId, storePassword } = getSslCommerzCredentials();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const currency = toSafeUpper(feeConfiguration.currency, "BDT");

  const createdPayment = await feePaymentDelegate().create({
    data: {
      institutionId: profile.institutionId,
      departmentId: profile.departmentId,
      semesterId: payload.semesterId,
      studentProfileId: profile.id,
      feeConfigurationId: feeConfiguration.id,
      paymentMode: mode,
      status: FEE_PAYMENT_STATUS_INITIATED,
      monthsCovered,
      amount: requestedAmount,
      currency,
      tranId: transactionId,
      paymentInitiatedAt: new Date(),
    },
  });

  const requestBody = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: requestedAmount.toFixed(2),
    currency,
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/student/fees/payment/success`,
    fail_url: `${backendBaseUrl}/api/v1/student/fees/payment/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/student/fees/payment/cancel`,
    ipn_url: `${backendBaseUrl}/api/v1/student/fees/payment/fail`,
    shipping_method: "NO",
    product_name: `Semester Fee - ${feeConfiguration.semester.name}`,
    product_category: "Education",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.presentAddress?.trim() || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.contactNo?.trim() || "01700000000",
    value_a: createdPayment.id,
    value_b: profile.id,
    value_c: payload.semesterId,
  });

  const response = await fetch(`${sslCommerzBaseUrl}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: requestBody.toString(),
  });

  const gatewayResponse = (await response.json().catch(() => null)) as
    | {
        status?: string;
        failedreason?: string;
        GatewayPageURL?: string;
        sessionkey?: string;
      }
    | null;

  const gatewayPageUrl = gatewayResponse?.GatewayPageURL;
  const gatewayStatus = gatewayResponse?.status?.toUpperCase();

  if (!response.ok || !gatewayPageUrl || gatewayStatus !== "SUCCESS") {
    await feePaymentDelegate().update({
      where: {
        id: createdPayment.id,
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: gatewayResponse?.status ?? "FAILED",
        gatewayRawPayload: (gatewayResponse ?? { httpStatus: response.status }) as any,
      },
    });

    const failureMessage =
      gatewayResponse?.failedreason?.trim() ||
      gatewayResponse?.status?.trim() ||
      "Unable to initialize SSLCommerz payment session";
    throw createHttpError(502, failureMessage);
  }

  await feePaymentDelegate().update({
    where: {
      id: createdPayment.id,
    },
    data: {
      status: FEE_PAYMENT_STATUS_PENDING,
      gatewayStatus: gatewayResponse?.status,
      gatewaySessionKey: gatewayResponse?.sessionkey || null,
      gatewayRawPayload: gatewayResponse as any,
    },
  });

  return {
    paymentId: createdPayment.id,
    tranId: transactionId,
    paymentUrl: gatewayPageUrl,
    amount: requestedAmount,
    currency,
    paymentMode: mode,
    monthsCovered,
  };
};

const handleFeeGatewayCallback = async (
  callbackType: "success" | "failed" | "cancelled",
  rawQuery: Record<string, unknown>,
) => {
  const query = normalizeCallbackQuery(rawQuery);
  const transactionId = query.tran_id?.trim();

  if (!transactionId) {
    return {
      redirectUrl: buildFeeRedirectUrl("failed"),
    };
  }

  const payment = await feePaymentDelegate().findUnique({
    where: {
      tranId: transactionId,
    },
    include: {
      feeConfiguration: {
        select: {
          id: true,
          totalFeeAmount: true,
        },
      },
    },
  });

  if (!payment) {
    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId),
    };
  }

  if (callbackType === "cancelled") {
    if (payment.status !== FEE_PAYMENT_STATUS_SUCCESS) {
      await feePaymentDelegate().update({
        where: {
          id: payment.id,
        },
        data: {
          status: FEE_PAYMENT_STATUS_CANCELLED,
          gatewayStatus: query.status || "CANCELLED",
          gatewayRawPayload: rawQuery as any,
        },
      });
    }

    return {
      redirectUrl: buildFeeRedirectUrl("cancelled", transactionId),
    };
  }

  if (callbackType === "failed") {
    if (payment.status !== FEE_PAYMENT_STATUS_SUCCESS) {
      await feePaymentDelegate().update({
        where: {
          id: payment.id,
        },
        data: {
          status: FEE_PAYMENT_STATUS_FAILED,
          gatewayStatus: query.status || "FAILED",
          gatewayRawPayload: rawQuery as any,
        },
      });
    }

    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId),
    };
  }

  if (payment.status === FEE_PAYMENT_STATUS_SUCCESS) {
    return {
      redirectUrl: buildFeeRedirectUrl("success", transactionId),
    };
  }

  const validationId = query.val_id?.trim();
  if (!validationId) {
    await feePaymentDelegate().update({
      where: {
        id: payment.id,
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: query.status || "FAILED",
        gatewayRawPayload: rawQuery as any,
      },
    });

    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId),
    };
  }

  const { storeId, storePassword } = getSslCommerzCredentials();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();

  const validatorParams = new URLSearchParams({
    val_id: validationId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  const validationResponse = await fetch(
    `${sslCommerzBaseUrl}/validator/api/validationserverAPI.php?${validatorParams.toString()}`,
  );

  const validationData = (await validationResponse.json().catch(() => null)) as
    | {
        status?: string;
        tran_id?: string;
        val_id?: string;
        amount?: string;
        currency_type?: string;
        bank_tran_id?: string;
        card_type?: string;
      }
    | null;

  const validationStatus = validationData?.status?.toUpperCase();
  const isValidStatus = validationStatus === "VALID" || validationStatus === "VALIDATED";
  const isValidTransaction = validationData?.tran_id === payment.tranId;
  const isValidAmount = areMoneyValuesEqual(validationData?.amount, payment.amount);
  const isValidCurrency =
    toSafeUpper(validationData?.currency_type, payment.currency) === toSafeUpper(payment.currency, "BDT");

  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await feePaymentDelegate().update({
      where: {
        id: payment.id,
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: validationData?.status || query.status || "FAILED",
        gatewayValId: validationData?.val_id || validationId,
        gatewayRawPayload: (validationData ?? rawQuery) as any,
      },
    });

    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId),
    };
  }

  const successfulSemesterPayments = await feePaymentDelegate().findMany({
    where: {
      studentProfileId: payment.studentProfileId,
      semesterId: payment.semesterId,
      status: FEE_PAYMENT_STATUS_SUCCESS,
      id: {
        not: payment.id,
      },
    },
    select: {
      amount: true,
    },
  });

  const alreadyPaidAmount = toMoneyNumber(
    successfulSemesterPayments.reduce((sum, item) => sum + toMoneyNumber(item.amount), 0),
  );
  const currentAmount = toMoneyNumber(payment.amount);
  const totalFeeAmount = toMoneyNumber(payment.feeConfiguration.totalFeeAmount);

  if (alreadyPaidAmount + currentAmount > totalFeeAmount + 0.01) {
    await feePaymentDelegate().update({
      where: {
        id: payment.id,
      },
      data: {
        status: FEE_PAYMENT_STATUS_FAILED,
        gatewayStatus: "OVERPAYMENT_BLOCKED",
        gatewayValId: validationData?.val_id || validationId,
        gatewayRawPayload: validationData as any,
      },
    });

    return {
      redirectUrl: buildFeeRedirectUrl("failed", transactionId),
    };
  }

  await feePaymentDelegate().update({
    where: {
      id: payment.id,
    },
    data: {
      status: FEE_PAYMENT_STATUS_SUCCESS,
      paidAt: new Date(),
      gatewayStatus: validationData?.status || "VALID",
      gatewayValId: validationData?.val_id || validationId,
      gatewayBankTranId: validationData?.bank_tran_id || null,
      gatewayCardType: validationData?.card_type || null,
      gatewayRawPayload: validationData as any,
    },
  });

  return {
    redirectUrl: buildFeeRedirectUrl("success", transactionId),
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
  getFeeOverview,
  initiateFeePayment,
  handleFeeGatewayCallback,
};
