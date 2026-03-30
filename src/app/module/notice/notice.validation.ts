import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");
const noticeAudienceRoleSchema = z.enum(["ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"]);

const listNoticesSchema = z.object({
  query: z.object({
    search: z.string("search must be a string").trim().max(120).optional(),
  }),
});

const createNoticeSchema = z.object({
  body: z.object({
    title: z.string("title is required").trim().min(2).max(180),
    content: z.string("content is required").trim().min(2).max(5000),
    targetRoles: z.array(noticeAudienceRoleSchema).min(1, "Select at least one target role"),
  }),
});

const updateNoticeSchema = z.object({
  params: z.object({
    noticeId: uuidSchema,
  }),
  body: z
    .object({
      title: z.string("title must be a string").trim().min(2).max(180).optional(),
      content: z.string("content must be a string").trim().min(2).max(5000).optional(),
      targetRoles: z.array(noticeAudienceRoleSchema).min(1, "Select at least one target role").optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

const noticeParamsSchema = z.object({
  params: z.object({
    noticeId: uuidSchema,
  }),
});

export const NoticeValidation = {
  listNoticesSchema,
  createNoticeSchema,
  updateNoticeSchema,
  noticeParamsSchema,
};
