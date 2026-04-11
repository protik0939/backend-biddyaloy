import {
  AdminRole,
  InstitutionApplicationStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateInstitutionApplication,
  IInitiateInstitutionSubscriptionPayment,
  IReviewInstitutionApplication,
} from "./institutionApplication.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

const DEFAULT_FRONTEND_BASE = "http://localhost:3000";
const SUBSCRIPTION_PAYMENT_STATUS_PENDING = "PENDING";
const SUBSCRIPTION_PAYMENT_STATUS_PAID = "PAID";
const SUBSCRIPTION_PAYMENT_STATUS_FAILED = "FAILED";
const SUBSCRIPTION_PAYMENT_STATUS_CANCELLED = "CANCELLED";
const INSTITUTION_SUBSCRIPTION_STATUS_ACTIVE = "ACTIVE";

const SUBSCRIPTION_PLAN_CONFIG: Record<
  IInitiateInstitutionSubscriptionPayment["plan"],
  { months: number; amount: number; originalAmount: number; label: string }
> = {
  MONTHLY: { months: 1, amount: 500, originalAmount: 500, label: "Monthly" },
  HALF_YEARLY: { months: 6, amount: 2800, originalAmount: 3000, label: "Half Yearly" },
  YEARLY: { months: 12, amount: 5600, originalAmount: 6000, label: "Yearly" },
};

function getFrontendBaseUrl() {
  const raw =
    process.env.FRONTEND_PUBLIC_URL?.trim() ||
    process.env.NEXT_PUBLIC_FRONTEND_URL?.trim() ||
    DEFAULT_FRONTEND_BASE;
  return raw.replace(/\/$/, "");
}

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_PUBLIC_URL?.trim() || process.env.BASE_URL?.trim();
  if (!raw) {
    throw createHttpError(
      500,
      "Backend public URL is not configured. Set BACKEND_PUBLIC_URL in environment.",
    );
  }

  return raw.replace(/\/$/, "");
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

  return { storeId, storePassword };
}

function toMoneyNumber(value: unknown) {
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return 0;
  }

  return Number(next.toFixed(2));
}

function areMoneyValuesEqual(left: unknown, right: unknown) {
  return Math.abs(toMoneyNumber(left) - toMoneyNumber(right)) <= 0.01;
}

function buildSubscriptionRedirectUrl(status: "success" | "failed" | "cancelled", tranId?: string) {
  const frontendBase = getFrontendBaseUrl();
  const searchParams = new URLSearchParams({
    subscriptionPaymentStatus: status,
  });

  if (tranId) {
    searchParams.set("tranId", tranId);
  }

  return `${frontendBase}/?${searchParams.toString()}`;
}

function toSafeUpper(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized ? normalized.toUpperCase() : fallback;
}

function readQueryValue(value: unknown) {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeCallbackQuery(query: Record<string, unknown>) {
  return {
    tran_id: readQueryValue(query.tran_id),
    val_id: readQueryValue(query.val_id),
    status: readQueryValue(query.status),
    bank_tran_id: readQueryValue(query.bank_tran_id),
    card_type: readQueryValue(query.card_type),
  };
}

function addMonths(value: Date, months: number) {
  const next = new Date(value);
  next.setMonth(next.getMonth() + months);
  return next;
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

const getSubscriptionPricing = async () => {
  const getSupport = (plan: string) => {
    if (plan === "MONTHLY") {
      return "Standard support";
    }

    if (plan === "HALF_YEARLY") {
      return "Priority support";
    }

    return "Dedicated support";
  };

  const getFeatures = (plan: string) => {
    if (plan === "MONTHLY") {
      return [
        "Complete institution portal access",
        "Student and teacher onboarding",
        "Academic management and notices",
      ];
    }

    if (plan === "HALF_YEARLY") {
      return [
        "Everything in Monthly",
        "Priority issue handling",
        "Implementation assistance",
      ];
    }

    return [
      "Everything in Half Yearly",
      "Dedicated support channel",
      "Operational review and guidance",
    ];
  };

  return Object.entries(SUBSCRIPTION_PLAN_CONFIG).map(([plan, config]) => ({
    plan,
    label: config.label,
    amount: config.amount,
    originalAmount: config.originalAmount,
    monthsCovered: config.months,
    currency: "BDT",
    support: getSupport(plan),
    features: getFeatures(plan),
  }));
};

const initiateSubscriptionPayment = async (
  userId: string,
  applicationId: string,
  payload: IInitiateInstitutionSubscriptionPayment,
) => {
  const application = await prisma.institutionApplication.findFirst({
    where: {
      id: applicationId,
      applicantUserId: userId,
    },
  });

  if (!application) {
    throw createHttpError(404, "Application not found");
  }

  if (application.status !== InstitutionApplicationStatus.PENDING) {
    throw createHttpError(400, "Only pending applications can receive subscription payments");
  }

  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
    throw createHttpError(400, "Subscription payment already completed for this application");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      contactNo: true,
      presentAddress: true,
    },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const selectedPlan = SUBSCRIPTION_PLAN_CONFIG[payload.plan];
  const amount = toMoneyNumber(selectedPlan.amount);
  const currency = "BDT";
  const backendBaseUrl = getBackendBaseUrl();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const { storeId, storePassword } = getSslCommerzCredentials();

  const transactionId = `INSTSUB-${application.id.slice(0, 8)}-${Date.now()}`;

  await prisma.institutionApplication.update({
    where: {
      id: application.id,
    },
    data: {
      subscriptionPlan: payload.plan,
      subscriptionAmount: amount,
      subscriptionCurrency: currency,
      subscriptionMonths: selectedPlan.months,
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
      subscriptionTranId: transactionId,
      subscriptionPaidAt: null,
    },
  });

  const requestBody = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: amount.toFixed(2),
    currency,
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/success`,
    fail_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/cancel`,
    ipn_url: `${backendBaseUrl}/api/v1/institution-applications/admin/subscription/payment/fail`,
    shipping_method: "NO",
    product_name: `Institution Subscription - ${selectedPlan.label}`,
    product_category: "Education",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.presentAddress?.trim() || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.contactNo?.trim() || "01700000000",
    value_a: application.id,
    value_b: userId,
    value_c: payload.plan,
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
    await prisma.institutionApplication.update({
      where: {
        id: application.id,
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        subscriptionGatewayStatus: gatewayResponse?.status ?? "FAILED",
        subscriptionGatewayRawPayload: (gatewayResponse ?? { httpStatus: response.status }) as any,
      },
    });

    const failureMessage =
      gatewayResponse?.failedreason?.trim() ||
      gatewayResponse?.status?.trim() ||
      "Unable to initialize SSLCommerz payment session";
    throw createHttpError(502, failureMessage);
  }

  await prisma.institutionApplication.update({
    where: {
      id: application.id,
    },
    data: {
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
      subscriptionGatewayStatus: gatewayResponse?.status,
      subscriptionGatewaySessionKey: gatewayResponse?.sessionkey || null,
      subscriptionGatewayRawPayload: gatewayResponse as any,
    },
  });

  return {
    applicationId: application.id,
    plan: payload.plan,
    amount,
    currency,
    monthsCovered: selectedPlan.months,
    tranId: transactionId,
    paymentUrl: gatewayPageUrl,
  };
};

const handleSubscriptionPaymentCallback = async (
  callbackType: "success" | "failed" | "cancelled",
  rawQuery: Record<string, unknown>,
) => {
  const query = normalizeCallbackQuery(rawQuery);
  const transactionId = query.tran_id?.trim();

  if (!transactionId) {
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed"),
    };
  }

  const application = await prisma.institutionApplication.findFirst({
    where: {
      subscriptionTranId: transactionId,
    },
  });

  if (!application) {
    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId),
    };
  }

  if (callbackType === "cancelled") {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await prisma.institutionApplication.update({
        where: {
          id: application.id,
        },
        data: {
          subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_CANCELLED,
          subscriptionGatewayStatus: query.status || "CANCELLED",
          subscriptionGatewayRawPayload: rawQuery as any,
        },
      });
    }

    return {
      redirectUrl: buildSubscriptionRedirectUrl("cancelled", transactionId),
    };
  }

  if (callbackType === "failed") {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await prisma.institutionApplication.update({
        where: {
          id: application.id,
        },
        data: {
          subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
          subscriptionGatewayStatus: query.status || "FAILED",
          subscriptionGatewayRawPayload: rawQuery as any,
        },
      });
    }

    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId),
    };
  }

  if (application.subscriptionPaymentStatus === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
    return {
      redirectUrl: buildSubscriptionRedirectUrl("success", transactionId),
    };
  }

  const validationId = query.val_id?.trim();
  if (!validationId) {
    await prisma.institutionApplication.update({
      where: {
        id: application.id,
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        subscriptionGatewayStatus: query.status || "FAILED",
        subscriptionGatewayRawPayload: rawQuery as any,
      },
    });

    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId),
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
  const isValidTransaction = validationData?.tran_id === application.subscriptionTranId;
  const isValidAmount = areMoneyValuesEqual(validationData?.amount, application.subscriptionAmount);
  const isValidCurrency =
    toSafeUpper(validationData?.currency_type, application.subscriptionCurrency) ===
    toSafeUpper(application.subscriptionCurrency, "BDT");

  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await prisma.institutionApplication.update({
      where: {
        id: application.id,
      },
      data: {
        subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        subscriptionGatewayStatus: validationData?.status || query.status || "FAILED",
        subscriptionGatewayValId: validationData?.val_id || validationId,
        subscriptionGatewayRawPayload: (validationData ?? rawQuery) as any,
      },
    });

    return {
      redirectUrl: buildSubscriptionRedirectUrl("failed", transactionId),
    };
  }

  await prisma.institutionApplication.update({
    where: {
      id: application.id,
    },
    data: {
      subscriptionPaymentStatus: SUBSCRIPTION_PAYMENT_STATUS_PAID,
      subscriptionPaidAt: new Date(),
      subscriptionGatewayStatus: validationData?.status || "VALID",
      subscriptionGatewayValId: validationData?.val_id || validationId,
      subscriptionGatewayBankTranId: validationData?.bank_tran_id || null,
      subscriptionGatewayCardType: validationData?.card_type || null,
      subscriptionGatewayRawPayload: validationData as any,
    },
  });

  return {
    redirectUrl: buildSubscriptionRedirectUrl("success", transactionId),
  };
};

const listInstitutionStudentPaymentsForSuperAdmin = async (institutionId?: string) => {
  const payments = await (prisma as any).studentFeePayment.findMany({
    where: {
      status: "SUCCESS",
      ...(institutionId
        ? {
            institutionId,
          }
        : {}),
    },
    include: {
      institution: {
        select: {
          id: true,
          name: true,
          shortName: true,
          type: true,
        },
      },
      studentProfile: {
        select: {
          id: true,
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
      semester: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      paidAt: "desc",
    },
  });

  const institutionSummaryMap = new Map<string, { institutionId: string; institutionName: string; shortName: string | null; totalAmount: number; totalPayments: number }>();

  for (const payment of payments) {
    const key = payment.institutionId as string;
    const existing = institutionSummaryMap.get(key);
    const amount = toMoneyNumber(payment.amount);
    if (existing) {
      existing.totalAmount = toMoneyNumber(existing.totalAmount + amount);
      existing.totalPayments += 1;
      institutionSummaryMap.set(key, existing);
    } else {
      institutionSummaryMap.set(key, {
        institutionId: key,
        institutionName: payment.institution?.name ?? "Unknown Institution",
        shortName: payment.institution?.shortName ?? null,
        totalAmount: amount,
        totalPayments: 1,
      });
    }
  }

  return {
    summary: Array.from(institutionSummaryMap.values()).sort((left, right) => right.totalAmount - left.totalAmount),
    payments: payments.map((payment: any) => ({
      id: payment.id,
      institutionId: payment.institutionId,
      institutionName: payment.institution?.name ?? "Unknown Institution",
      institutionType: payment.institution?.type ?? "OTHER",
      studentProfileId: payment.studentProfileId,
      studentsId: payment.studentProfile?.studentsId ?? null,
      studentName: payment.studentProfile?.user?.name ?? "Unknown Student",
      studentEmail: payment.studentProfile?.user?.email ?? null,
      semesterId: payment.semesterId,
      semesterName: payment.semester?.name ?? "N/A",
      paymentMode: payment.paymentMode,
      amount: toMoneyNumber(payment.amount),
      currency: payment.currency,
      tranId: payment.tranId,
      paidAt: payment.paidAt,
    })),
  };
};

const listInstitutionStudentPaymentsForAdmin = async (userId: string) => {
  const adminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId,
    },
    select: {
      institutionId: true,
    },
  });

  if (!adminProfile?.institutionId) {
    throw createHttpError(403, "Only institution admins can view institution payment details");
  }

  return listInstitutionStudentPaymentsForSuperAdmin(adminProfile.institutionId);
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
    newStudentsLast7Days,
    newStudentsPrevious7Days,
    newTeachersLast7Days,
    newTeachersPrevious7Days,
    newStaffLast7Days,
    newStaffPrevious7Days,
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
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPERADMIN"] } } }),
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
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: "TEACHER",
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: "TEACHER",
        createdAt: {
          gte: fourteenDaysAgo,
          lt: sevenDaysAgo,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: {
          in: ["ADMIN", "SUPERADMIN"],
        },
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.user.count({
      where: {
        role: {
          in: ["ADMIN", "SUPERADMIN"],
        },
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
    prisma.studentAdmissionApplication.count({
      where: {
        appliedAt: {
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

  const studentGrowthBase = Math.max(newStudentsPrevious7Days, 1);
  const studentGrowthPercentage = Number(
    (((newStudentsLast7Days - newStudentsPrevious7Days) / studentGrowthBase) * 100).toFixed(2),
  );

  const teacherGrowthBase = Math.max(newTeachersPrevious7Days, 1);
  const teacherGrowthPercentage = Number(
    (((newTeachersLast7Days - newTeachersPrevious7Days) / teacherGrowthBase) * 100).toFixed(2),
  );

  const staffGrowthBase = Math.max(newStaffPrevious7Days, 1);
  const staffGrowthPercentage = Number(
    (((newStaffLast7Days - newStaffPrevious7Days) / staffGrowthBase) * 100).toFixed(2),
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
      studentGrowthPercentage,
      teacherGrowthPercentage,
      staffGrowthPercentage,
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

  if (payload.status === InstitutionApplicationStatus.APPROVED) {
    if (application.subscriptionPaymentStatus !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      throw createHttpError(400, "Subscription payment is pending for this application");
    }

    if (!application.subscriptionPlan || !application.subscriptionMonths || !application.subscriptionAmount) {
      throw createHttpError(400, "Subscription metadata is missing for this application");
    }
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

    const subscriptionStartsAt = new Date();
    const subscriptionEndsAt = addMonths(subscriptionStartsAt, application.subscriptionMonths ?? 1);

    await (trx as any).institutionSubscription.create({
      data: {
        institutionId: institution.id,
        sourceApplicationId: application.id,
        plan: application.subscriptionPlan,
        status: INSTITUTION_SUBSCRIPTION_STATUS_ACTIVE,
        amount: application.subscriptionAmount,
        currency: application.subscriptionCurrency,
        monthsCovered: application.subscriptionMonths,
        startsAt: subscriptionStartsAt,
        endsAt: subscriptionEndsAt,
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
  getSubscriptionPricing,
  initiateSubscriptionPayment,
  handleSubscriptionPaymentCallback,
  listInstitutionStudentPaymentsForSuperAdmin,
  listInstitutionStudentPaymentsForAdmin,
  review,
};
