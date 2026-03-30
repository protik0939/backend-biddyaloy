import { AccountStatus, AdminRole, UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  decryptCredentialValue,
  encryptCredentialValue,
  hashCredentialValue,
  maskCredentialValue,
} from "../../shared/credentialSecurity";
import {
  ICreateInstitutionSemesterPayload,
  ICreateInstitutionSubAdminPayload,
  IInitiateInstitutionSubscriptionRenewalPayload,
  IUpsertInstitutionSslCommerzCredentialPayload,
  IUpdateInstitutionAdminProfilePayload,
  IUpdateInstitutionSemesterPayload,
} from "./institutionAdmin.interface";

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function resolveAdminRole(accountType: ICreateInstitutionSubAdminPayload["accountType"]) {
  return accountType === "FACULTY" ? AdminRole.FACULTYADMIN : AdminRole.DEPARTMENTADMIN;
}

function canCreateSubAdmin(
  creatorRole: AdminRole,
  targetAccountType: ICreateInstitutionSubAdminPayload["accountType"],
) {
  if (creatorRole === AdminRole.INSTITUTIONADMIN) {
    return true;
  }

  if (creatorRole === AdminRole.FACULTYADMIN && targetAccountType === "DEPARTMENT") {
    return true;
  }

  return false;
}

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

const DEFAULT_FRONTEND_BASE = "http://localhost:3000";
const SUBSCRIPTION_PAYMENT_STATUS_PENDING = "PENDING";
const SUBSCRIPTION_PAYMENT_STATUS_PAID = "PAID";
const SUBSCRIPTION_PAYMENT_STATUS_FAILED = "FAILED";
const SUBSCRIPTION_PAYMENT_STATUS_CANCELLED = "CANCELLED";

const SUBSCRIPTION_PLAN_CONFIG: Record<
  IInitiateInstitutionSubscriptionRenewalPayload["plan"],
  { months: number; amount: number; label: string }
> = {
  MONTHLY: { months: 1, amount: 500, label: "Monthly" },
  HALF_YEARLY: { months: 6, amount: 2800, label: "Half Yearly" },
  YEARLY: { months: 12, amount: 5600, label: "Yearly" },
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

function buildSubscriptionRenewalRedirectUrl(
  status: "success" | "failed" | "cancelled",
  tranId?: string,
) {
  const frontendBase = getFrontendBaseUrl();
  const pathname = status === "success" ? "/admin" : "/subscription-expired";
  const searchParams = new URLSearchParams({
    subscriptionRenewalStatus: status,
  });

  if (tranId) {
    searchParams.set("tranId", tranId);
  }

  return `${frontendBase}${pathname}?${searchParams.toString()}`;
}

const resolveInstitutionAdminContext = async (creatorUserId: string) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId,
    },
    select: {
      institutionId: true,
      role: true,
    },
  });

  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError(403, "Only institution admins can manage semesters");
  }

  if (creatorAdminProfile.role !== AdminRole.INSTITUTIONADMIN) {
    throw createHttpError(403, "Only institution admins can manage semesters");
  }

  return creatorAdminProfile;
};

const listSemesters = async (creatorUserId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  return prisma.semester.findMany({
    where: {
      institutionId: context.institutionId,
    },
    orderBy: {
      startDate: "desc",
    },
  });
};

const getDashboardSummary = async (creatorUserId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const [user, institution, stats] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: creatorUserId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        contactNo: true,
        presentAddress: true,
        permanentAddress: true,
        bloodGroup: true,
        gender: true,
      },
    }),
    prisma.institution.findUnique({
      where: {
        id: context.institutionId,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        institutionLogo: true,
        type: true,
      },
    }),
    Promise.all([
      prisma.faculty.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.department.count({
        where: {
          faculty: {
            institutionId: context.institutionId,
          },
        },
      }),
      prisma.semester.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.teacherProfile.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.studentProfile.count({
        where: {
          institutionId: context.institutionId,
        },
      }),
      prisma.teacherJobApplication.count({
        where: {
          institutionId: context.institutionId,
          status: "PENDING",
        },
      }),
      prisma.studentAdmissionApplication.count({
        where: {
          posting: {
            institutionId: context.institutionId,
          },
          status: "PENDING",
        },
      }),
    ]),
  ]);

  const [
    totalFaculties,
    totalDepartments,
    totalSemesters,
    totalTeachers,
    totalStudents,
    pendingTeacherApplications,
    pendingStudentApplications,
  ] = stats;

  return {
    user,
    institution,
    stats: {
      totalFaculties,
      totalDepartments,
      totalSemesters,
      totalTeachers,
      totalStudents,
      pendingTeacherApplications,
      pendingStudentApplications,
    },
  };
};

const updateProfile = async (
  creatorUserId: string,
  payload: IUpdateInstitutionAdminProfilePayload,
) => {
  await resolveInstitutionAdminContext(creatorUserId);

  const nextName = payload.name?.trim();

  if (nextName) {
    await prisma.user.update({
      where: { id: creatorUserId },
      data: {
        name: nextName,
      },
    });
  }

  await prisma.user.update({
    where: { id: creatorUserId },
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

  return getDashboardSummary(creatorUserId);
};

const getSslCommerzCredential = async (creatorUserId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existing = await (prisma as any).institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId: context.institutionId,
    },
    select: {
      sslCommerzStoreIdEncrypted: true,
      sslCommerzBaseUrlEncrypted: true,
      sslCommerzStorePasswordHash: true,
      updatedAt: true,
      isActive: true,
    },
  });

  if (!existing) {
    return {
      isConfigured: false,
      storeIdMasked: null,
      hasStorePassword: false,
      baseUrl: null,
      updatedAt: null,
      isActive: false,
    };
  }

  const storeId = decryptCredentialValue(existing.sslCommerzStoreIdEncrypted);
  const baseUrl = decryptCredentialValue(existing.sslCommerzBaseUrlEncrypted);

  return {
    isConfigured: true,
    storeIdMasked: maskCredentialValue(storeId),
    hasStorePassword: Boolean(existing.sslCommerzStorePasswordHash),
    baseUrl,
    updatedAt: existing.updatedAt,
    isActive: existing.isActive,
  };
};

const upsertSslCommerzCredential = async (
  creatorUserId: string,
  payload: IUpsertInstitutionSslCommerzCredentialPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existing = await (prisma as any).institutionPaymentGatewayCredential.findUnique({
    where: {
      institutionId: context.institutionId,
    },
    select: {
      id: true,
      sslCommerzStoreIdEncrypted: true,
      sslCommerzStorePasswordEncrypted: true,
      sslCommerzBaseUrlEncrypted: true,
    },
  });

  const nextStoreIdInput = payload.storeId?.trim();
  const nextStorePasswordInput = payload.storePassword?.trim();
  const nextBaseUrlInput = payload.baseUrl?.trim();

  let resolvedStoreId = nextStoreIdInput;
  let resolvedStorePassword = nextStorePasswordInput;
  let resolvedBaseUrl = nextBaseUrlInput;

  if (existing) {
    resolvedStoreId = resolvedStoreId || decryptCredentialValue(existing.sslCommerzStoreIdEncrypted);
    resolvedStorePassword =
      resolvedStorePassword || decryptCredentialValue(existing.sslCommerzStorePasswordEncrypted);
    resolvedBaseUrl = resolvedBaseUrl || decryptCredentialValue(existing.sslCommerzBaseUrlEncrypted);
  }

  if (!resolvedStoreId || !resolvedStorePassword || !resolvedBaseUrl) {
    throw createHttpError(
      400,
      "storeId, storePassword and baseUrl are required for SSLCommerz credential setup",
    );
  }

  let normalizedBaseUrl: string;
  try {
    normalizedBaseUrl = new URL(resolvedBaseUrl).toString().replace(/\/$/, "");
  } catch {
    throw createHttpError(400, "baseUrl must be a valid URL");
  }

  await (prisma as any).institutionPaymentGatewayCredential.upsert({
    where: {
      institutionId: context.institutionId,
    },
    create: {
      institutionId: context.institutionId,
      sslCommerzStoreIdEncrypted: encryptCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordEncrypted: encryptCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlEncrypted: encryptCredentialValue(normalizedBaseUrl),
      sslCommerzStoreIdHash: hashCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordHash: hashCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlHash: hashCredentialValue(normalizedBaseUrl),
      isActive: true,
      lastUpdatedByUserId: creatorUserId,
    },
    update: {
      sslCommerzStoreIdEncrypted: encryptCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordEncrypted: encryptCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlEncrypted: encryptCredentialValue(normalizedBaseUrl),
      sslCommerzStoreIdHash: hashCredentialValue(resolvedStoreId),
      sslCommerzStorePasswordHash: hashCredentialValue(resolvedStorePassword),
      sslCommerzBaseUrlHash: hashCredentialValue(normalizedBaseUrl),
      isActive: true,
      lastUpdatedByUserId: creatorUserId,
    },
  });

  return getSslCommerzCredential(creatorUserId);
};

const initiateSubscriptionRenewal = async (
  creatorUserId: string,
  payload: IInitiateInstitutionSubscriptionRenewalPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const selectedPlan = SUBSCRIPTION_PLAN_CONFIG[payload.plan];

  if (!selectedPlan) {
    throw createHttpError(400, "Invalid subscription plan selected");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: creatorUserId,
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

  const amount = toMoneyNumber(selectedPlan.amount);
  const currency = "BDT";
  const backendBaseUrl = getBackendBaseUrl();
  const sslCommerzBaseUrl = getSslCommerzBaseUrl();
  const { storeId, storePassword } = getSslCommerzCredentials();
  const transactionId = `INSTREN-${context.institutionId.slice(0, 8)}-${Date.now()}`;

  const renewalPayment = await (prisma as any).institutionSubscriptionRenewalPayment.create({
    data: {
      institutionId: context.institutionId,
      initiatedByUserId: creatorUserId,
      plan: payload.plan,
      amount,
      currency,
      monthsCovered: selectedPlan.months,
      status: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
      tranId: transactionId,
      paidAt: null,
    },
    select: {
      id: true,
    },
  });

  const requestBody = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: amount.toFixed(2),
    currency,
    tran_id: transactionId,
    success_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/success`,
    fail_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/cancel`,
    ipn_url: `${backendBaseUrl}/api/v1/institution-admin/subscription/renew/payment/fail`,
    shipping_method: "NO",
    product_name: `Institution Renewal - ${selectedPlan.label}`,
    product_category: "Education",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.presentAddress?.trim() || "N/A",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: user.contactNo?.trim() || "01700000000",
    value_a: context.institutionId,
    value_b: creatorUserId,
    value_c: payload.plan,
    value_d: renewalPayment.id,
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
    await (prisma as any).institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId,
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
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

  await (prisma as any).institutionSubscriptionRenewalPayment.update({
    where: {
      tranId: transactionId,
    },
    data: {
      status: SUBSCRIPTION_PAYMENT_STATUS_PENDING,
      gatewayStatus: gatewayResponse?.status,
      gatewaySessionKey: gatewayResponse?.sessionkey || null,
      gatewayRawPayload: gatewayResponse as any,
    },
  });

  return {
    institutionId: context.institutionId,
    plan: payload.plan,
    amount,
    currency,
    monthsCovered: selectedPlan.months,
    tranId: transactionId,
    paymentUrl: gatewayPageUrl,
  };
};

const handleSubscriptionRenewalPaymentCallback = async (
  callbackType: "success" | "failed" | "cancelled",
  rawQuery: Record<string, unknown>,
) => {
  const query = normalizeCallbackQuery(rawQuery);
  const transactionId = query.tran_id?.trim();

  if (!transactionId) {
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed"),
    };
  }

  const renewalPayment = await (prisma as any).institutionSubscriptionRenewalPayment.findFirst({
    where: {
      tranId: transactionId,
    },
    select: {
      id: true,
      institutionId: true,
      plan: true,
      amount: true,
      currency: true,
      monthsCovered: true,
      status: true,
      tranId: true,
    },
  });

  if (!renewalPayment) {
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId),
    };
  }

  if (callbackType === "cancelled") {
    if (renewalPayment.status !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await (prisma as any).institutionSubscriptionRenewalPayment.update({
        where: {
          tranId: transactionId,
        },
        data: {
          status: SUBSCRIPTION_PAYMENT_STATUS_CANCELLED,
          gatewayStatus: query.status || "CANCELLED",
          gatewayRawPayload: rawQuery as any,
        },
      });
    }

    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("cancelled", transactionId),
    };
  }

  if (callbackType === "failed") {
    if (renewalPayment.status !== SUBSCRIPTION_PAYMENT_STATUS_PAID) {
      await (prisma as any).institutionSubscriptionRenewalPayment.update({
        where: {
          tranId: transactionId,
        },
        data: {
          status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
          gatewayStatus: query.status || "FAILED",
          gatewayRawPayload: rawQuery as any,
        },
      });
    }

    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId),
    };
  }

  if (renewalPayment.status === SUBSCRIPTION_PAYMENT_STATUS_PAID) {
    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("success", transactionId),
    };
  }

  const validationId = query.val_id?.trim();
  if (!validationId) {
    await (prisma as any).institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId,
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        gatewayStatus: query.status || "FAILED",
        gatewayRawPayload: rawQuery as any,
      },
    });

    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId),
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
  const isValidTransaction = validationData?.tran_id === renewalPayment.tranId;
  const isValidAmount = areMoneyValuesEqual(validationData?.amount, renewalPayment.amount);
  const isValidCurrency =
    toSafeUpper(validationData?.currency_type, renewalPayment.currency) ===
    toSafeUpper(renewalPayment.currency, "BDT");

  if (!validationResponse.ok || !isValidStatus || !isValidTransaction || !isValidAmount || !isValidCurrency) {
    await (prisma as any).institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId,
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_FAILED,
        gatewayStatus: validationData?.status || query.status || "FAILED",
        gatewayValId: validationData?.val_id || validationId,
        gatewayRawPayload: (validationData ?? rawQuery) as any,
      },
    });

    return {
      redirectUrl: buildSubscriptionRenewalRedirectUrl("failed", transactionId),
    };
  }

  await prisma.$transaction(async (trx) => {
    await (trx as any).institutionSubscriptionRenewalPayment.update({
      where: {
        tranId: transactionId,
      },
      data: {
        status: SUBSCRIPTION_PAYMENT_STATUS_PAID,
        paidAt: new Date(),
        gatewayStatus: validationData?.status || "VALID",
        gatewayValId: validationData?.val_id || validationId,
        gatewayBankTranId: validationData?.bank_tran_id || null,
        gatewayCardType: validationData?.card_type || null,
        gatewayRawPayload: validationData as any,
      },
    });

    await (trx as any).institutionSubscription.updateMany({
      where: {
        institutionId: renewalPayment.institutionId,
        status: "ACTIVE",
        endsAt: {
          lte: new Date(),
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    const latestSubscription = await (trx as any).institutionSubscription.findFirst({
      where: {
        institutionId: renewalPayment.institutionId,
      },
      select: {
        endsAt: true,
      },
      orderBy: {
        endsAt: "desc",
      },
    });

    const now = new Date();
    const startsAt =
      latestSubscription?.endsAt && latestSubscription.endsAt > now
        ? latestSubscription.endsAt
        : now;

    await (trx as any).institutionSubscription.create({
      data: {
        institutionId: renewalPayment.institutionId,
        sourceApplicationId: null,
        plan: renewalPayment.plan,
        status: "ACTIVE",
        amount: toMoneyNumber(renewalPayment.amount),
        currency: renewalPayment.currency,
        monthsCovered: renewalPayment.monthsCovered,
        startsAt,
        endsAt: addMonths(startsAt, renewalPayment.monthsCovered),
      },
    });
  });

  return {
    redirectUrl: buildSubscriptionRenewalRedirectUrl("success", transactionId),
  };
};

const createSemester = async (
  creatorUserId: string,
  payload: ICreateInstitutionSemesterPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);
  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw createHttpError(400, "Invalid startDate or endDate");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate <= today) {
    throw createHttpError(400, "startDate must be after today");
  }

  if (startDate >= endDate) {
    throw createHttpError(400, "startDate must be before endDate");
  }

  return prisma.semester.create({
    data: {
      name: payload.name.trim(),
      startDate,
      endDate,
      institutionId: context.institutionId,
    },
  });
};

const updateSemester = async (
  creatorUserId: string,
  semesterId: string,
  payload: IUpdateInstitutionSemesterPayload,
) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existingSemester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId,
    },
  });

  if (!existingSemester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  let nextStartDate = existingSemester.startDate;
  let nextEndDate = existingSemester.endDate;

  if (payload.startDate) {
    const parsedStartDate = new Date(payload.startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw createHttpError(400, "Invalid startDate");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedStartDate <= today) {
      throw createHttpError(400, "startDate must be after today");
    }

    nextStartDate = parsedStartDate;
  }

  if (payload.endDate) {
    const parsedEndDate = new Date(payload.endDate);
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw createHttpError(400, "Invalid endDate");
    }

    nextEndDate = parsedEndDate;
  }

  if (nextStartDate >= nextEndDate) {
    throw createHttpError(400, "startDate must be before endDate");
  }

  return prisma.semester.update({
    where: {
      id: existingSemester.id,
    },
    data: {
      name: payload.name?.trim() || undefined,
      startDate: payload.startDate ? nextStartDate : undefined,
      endDate: payload.endDate ? nextEndDate : undefined,
    },
  });
};

const deleteSemester = async (creatorUserId: string, semesterId: string) => {
  const context = await resolveInstitutionAdminContext(creatorUserId);

  const existingSemester = await prisma.semester.findFirst({
    where: {
      id: semesterId,
      institutionId: context.institutionId,
    },
    select: {
      id: true,
    },
  });

  if (!existingSemester) {
    throw createHttpError(404, "Semester not found for this institution");
  }

  await prisma.semester.delete({
    where: {
      id: existingSemester.id,
    },
  });

  return {
    id: existingSemester.id,
  };
};

const listFaculties = async (creatorUserId: string, search?: string) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId,
    },
    select: {
      institutionId: true,
      role: true,
    },
  });

  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError(403, "Only institution-level admins can view faculties");
  }

  if (!canCreateSubAdmin(creatorAdminProfile.role, "DEPARTMENT")) {
    throw createHttpError(403, "You are not allowed to view faculties for department creation");
  }

  const normalizedSearch = normalizeSearch(search);

  return prisma.faculty.findMany({
    where: {
      institutionId: creatorAdminProfile.institutionId,
      ...(normalizedSearch
        ? {
            OR: [
              { fullName: { contains: normalizedSearch, mode: "insensitive" } },
              { shortName: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      fullName: true,
      shortName: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const createSubAdminAccount = async (
  creatorUserId: string,
  payload: ICreateInstitutionSubAdminPayload,
) => {
  const creatorAdminProfile = await prisma.adminProfile.findUnique({
    where: {
      userId: creatorUserId,
    },
    select: {
      institutionId: true,
      role: true,
    },
  });

  if (!creatorAdminProfile?.institutionId) {
    throw createHttpError(403, "Only institution-level admins can create sub-admin accounts");
  }

  if (!canCreateSubAdmin(creatorAdminProfile.role, payload.accountType)) {
    throw createHttpError(
      403,
      "You are not allowed to create this account type. Faculty admins can only create department accounts",
    );
  }

  const registered = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: UserRole.ADMIN,
    },
  });

  if (!registered.user) {
    throw createHttpError(500, "Failed to create account");
  }

  const normalizedFacultyFullName = payload.facultyFullName?.trim();
  const normalizedFacultyShortName = payload.facultyShortName?.trim();
  const normalizedFacultyDescription = payload.facultyDescription?.trim();
  const normalizedDepartmentFullName = payload.departmentFullName?.trim();
  const normalizedDepartmentShortName = payload.departmentShortName?.trim();
  const normalizedDepartmentDescription = payload.departmentDescription?.trim();

  const result = await prisma.$transaction(async (trx) => {
    await trx.user.update({
      where: {
        id: registered.user.id,
      },
      data: {
        accountStatus: AccountStatus.ACTIVE,
      },
    });

    const adminProfile = await trx.adminProfile.upsert({
      where: {
        userId: registered.user.id,
      },
      create: {
        userId: registered.user.id,
        institutionId: creatorAdminProfile.institutionId,
        role: resolveAdminRole(payload.accountType),
      },
      update: {
        institutionId: creatorAdminProfile.institutionId,
        role: resolveAdminRole(payload.accountType),
      },
      select: {
        role: true,
        institutionId: true,
        createdAt: true,
      },
    });

    let createdFaculty:
      | {
          id: string;
          fullName: string;
        }
      | undefined;

    let targetFacultyId: string | undefined;

    if (payload.facultyId) {
      const existingFaculty = await trx.faculty.findFirst({
        where: {
          id: payload.facultyId,
          institutionId: creatorAdminProfile.institutionId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      if (!existingFaculty) {
        throw createHttpError(404, "Faculty not found for this institution");
      }

      targetFacultyId = existingFaculty.id;
    }

    if (normalizedFacultyFullName) {
      const faculty = await trx.faculty.create({
        data: {
          fullName: normalizedFacultyFullName,
          shortName: normalizedFacultyShortName || undefined,
          description: normalizedFacultyDescription || undefined,
          institutionId: creatorAdminProfile.institutionId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      createdFaculty = faculty;
      targetFacultyId = faculty.id;
    }

    let createdDepartment:
      | {
          id: string;
          fullName: string;
        }
      | undefined;

    if (normalizedDepartmentFullName) {
      if (!targetFacultyId) {
        const faculties = await trx.faculty.findMany({
          where: {
            institutionId: creatorAdminProfile.institutionId,
          },
          select: {
            id: true,
          },
          take: 2,
          orderBy: {
            createdAt: "asc",
          },
        });

        if (faculties.length === 0) {
          throw createHttpError(
            400,
            "Cannot create department without a faculty. Provide faculty fields first",
          );
        }

        if (faculties.length > 1) {
          throw createHttpError(
            400,
            "Multiple faculties found. Provide facultyId or faculty fields to select a target faculty",
          );
        }

        targetFacultyId = faculties[0].id;
      }

      const department = await trx.department.create({
        data: {
          fullName: normalizedDepartmentFullName,
          shortName: normalizedDepartmentShortName || undefined,
          description: normalizedDepartmentDescription || undefined,
          facultyId: targetFacultyId,
        },
        select: {
          id: true,
          fullName: true,
        },
      });

      createdDepartment = department;
    }

    return {
      adminProfile,
      createdFaculty,
      createdDepartment,
    };
  });

  return {
    id: registered.user.id,
    name: registered.user.name,
    email: registered.user.email,
    role: UserRole.ADMIN,
    adminRole: result.adminProfile.role,
    institutionId: result.adminProfile.institutionId,
    createdAt: result.adminProfile.createdAt,
    faculty: result.createdFaculty ?? null,
    department: result.createdDepartment ?? null,
  };
};

export const InstitutionAdminService = {
  getDashboardSummary,
  updateProfile,
  getSslCommerzCredential,
  upsertSslCommerzCredential,
  initiateSubscriptionRenewal,
  handleSubscriptionRenewalPaymentCallback,
  listSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  createSubAdminAccount,
  listFaculties,
};
