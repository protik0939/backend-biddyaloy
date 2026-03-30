import { AdminRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  ICreateNoticePayload,
  IListNoticesQuery,
  IUpdateNoticePayload,
  NoticeAudienceRole,
} from "./notice.interface";

type NoticeContext = {
  userId: string;
  institutionId: string;
  role: NoticeAudienceRole;
};

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function normalizeSearch(search?: string) {
  const value = search?.trim();
  return value || undefined;
}

function noticeDelegate() {
  return (prisma as any).notice;
}

function noticeReadDelegate() {
  return (prisma as any).noticeRead;
}

const SENDER_ROLES: NoticeAudienceRole[] = ["ADMIN", "FACULTY", "DEPARTMENT"];

const dedupeRoles = (roles: NoticeAudienceRole[]) => Array.from(new Set(roles));

async function resolveNoticeContext(userId: string): Promise<NoticeContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  if (user.role === "TEACHER") {
    const teacherProfile = await prisma.teacherProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { institutionId: true },
    });

    if (!teacherProfile?.institutionId) {
      throw createHttpError(403, "Teacher is not assigned to any institution yet");
    }

    return {
      userId,
      institutionId: teacherProfile.institutionId,
      role: "TEACHER",
    };
  }

  if (user.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { institutionId: true },
    });

    if (!studentProfile?.institutionId) {
      throw createHttpError(403, "Student is not assigned to any institution yet");
    }

    return {
      userId,
      institutionId: studentProfile.institutionId,
      role: "STUDENT",
    };
  }

  if (user.role === "ADMIN") {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { userId },
      select: { institutionId: true, role: true },
    });

    if (!adminProfile?.institutionId) {
      throw createHttpError(403, "Admin is not assigned to any institution");
    }

    const resolvedRole: NoticeAudienceRole =
      adminProfile.role === AdminRole.FACULTYADMIN
        ? "FACULTY"
        : adminProfile.role === AdminRole.DEPARTMENTADMIN
          ? "DEPARTMENT"
          : "ADMIN";

    return {
      userId,
      institutionId: adminProfile.institutionId,
      role: resolvedRole,
    };
  }

  throw createHttpError(403, "Unsupported role for notices");
}

async function getNoticeByIdForViewer(context: NoticeContext, noticeId: string) {
  const notice = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      OR: [
        {
          senderUserId: context.userId,
        },
        {
          recipients: {
            some: {
              role: context.role,
            },
          },
        },
      ],
    },
    include: {
      senderUser: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      recipients: {
        select: {
          role: true,
        },
      },
      reads: {
        where: {
          userId: context.userId,
        },
        take: 1,
      },
    },
  });

  if (!notice) {
    throw createHttpError(404, "Notice not found");
  }

  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: notice.createdAt,
    updatedAt: notice.updatedAt,
    senderRole: notice.senderRole,
    sender: notice.senderUser,
    targetRoles: notice.recipients.map((item: { role: NoticeAudienceRole }) => item.role),
    isRead: Boolean(notice.reads?.length),
    canEdit: notice.senderUserId === context.userId,
  };
}

const listNotices = async (userId: string, query: IListNoticesQuery) => {
  const context = await resolveNoticeContext(userId);
  const normalizedSearch = normalizeSearch(query.search);

  const notices = await noticeDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      OR: [
        {
          senderUserId: context.userId,
        },
        {
          recipients: {
            some: {
              role: context.role,
            },
          },
        },
      ],
      ...(normalizedSearch
        ? {
            OR: [
              { title: { contains: normalizedSearch, mode: "insensitive" } },
              { content: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      senderUser: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      recipients: {
        select: {
          role: true,
        },
      },
      reads: {
        where: {
          userId: context.userId,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return notices.map((notice: any) => ({
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: notice.createdAt,
    updatedAt: notice.updatedAt,
    senderRole: notice.senderRole,
    sender: notice.senderUser,
    targetRoles: notice.recipients.map((item: { role: NoticeAudienceRole }) => item.role),
    isRead: Boolean(notice.reads?.length),
    canEdit: notice.senderUserId === context.userId,
  }));
};

const getUnreadCount = async (userId: string) => {
  const context = await resolveNoticeContext(userId);

  const unreadCount = await noticeDelegate().count({
    where: {
      institutionId: context.institutionId,
      recipients: {
        some: {
          role: context.role,
        },
      },
      reads: {
        none: {
          userId: context.userId,
        },
      },
    },
  });

  return { unreadCount };
};

const createNotice = async (userId: string, payload: ICreateNoticePayload) => {
  const context = await resolveNoticeContext(userId);

  if (!SENDER_ROLES.includes(context.role)) {
    throw createHttpError(403, "Only admin, faculty, and department can send notices");
  }

  const targetRoles = dedupeRoles(payload.targetRoles);

  const createdNotice = await noticeDelegate().create({
    data: {
      title: payload.title.trim(),
      content: payload.content.trim(),
      institutionId: context.institutionId,
      senderUserId: context.userId,
      senderRole: context.role,
      recipients: {
        create: targetRoles.map((role) => ({ role })),
      },
    },
  });

  return getNoticeByIdForViewer(context, createdNotice.id);
};

const updateNotice = async (userId: string, noticeId: string, payload: IUpdateNoticePayload) => {
  const context = await resolveNoticeContext(userId);

  const existing = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      senderUserId: context.userId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Notice not found");
  }

  await noticeDelegate().update({
    where: {
      id: noticeId,
    },
    data: {
      title: payload.title === undefined ? undefined : payload.title.trim(),
      content: payload.content === undefined ? undefined : payload.content.trim(),
      recipients:
        payload.targetRoles === undefined
          ? undefined
          : {
              deleteMany: {},
              create: dedupeRoles(payload.targetRoles).map((role) => ({ role })),
            },
    },
  });

  return getNoticeByIdForViewer(context, noticeId);
};

const deleteNotice = async (userId: string, noticeId: string) => {
  const context = await resolveNoticeContext(userId);

  const existing = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      senderUserId: context.userId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    throw createHttpError(404, "Notice not found");
  }

  await noticeDelegate().delete({
    where: {
      id: noticeId,
    },
  });

  return {
    id: noticeId,
  };
};

const markNoticeAsRead = async (userId: string, noticeId: string) => {
  const context = await resolveNoticeContext(userId);

  const notice = await noticeDelegate().findFirst({
    where: {
      id: noticeId,
      institutionId: context.institutionId,
      recipients: {
        some: {
          role: context.role,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!notice) {
    throw createHttpError(404, "Notice not found");
  }

  await noticeReadDelegate().upsert({
    where: {
      noticeId_userId: {
        noticeId,
        userId: context.userId,
      },
    },
    create: {
      noticeId,
      userId: context.userId,
      readAt: new Date(),
    },
    update: {
      readAt: new Date(),
    },
  });

  return {
    id: noticeId,
  };
};

const markAllNoticesAsRead = async (userId: string) => {
  const context = await resolveNoticeContext(userId);

  const unreadNotices = await noticeDelegate().findMany({
    where: {
      institutionId: context.institutionId,
      recipients: {
        some: {
          role: context.role,
        },
      },
      reads: {
        none: {
          userId: context.userId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!unreadNotices.length) {
    return {
      markedCount: 0,
    };
  }

  await noticeReadDelegate().createMany({
    data: unreadNotices.map((item: { id: string }) => ({
      noticeId: item.id,
      userId: context.userId,
      readAt: new Date(),
    })),
    skipDuplicates: true,
  });

  return {
    markedCount: unreadNotices.length,
  };
};

export const NoticeService = {
  listNotices,
  getUnreadCount,
  createNotice,
  updateNotice,
  deleteNotice,
  markNoticeAsRead,
  markAllNoticesAsRead,
};
