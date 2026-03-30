import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");

const createPostingSchema = z.object({
  body: z.object({
    title: z.string("Title is required").trim().min(2).max(150),
    location: z.string("Location must be a string").trim().min(2).max(150).optional(),
    summary: z.string("Summary is required").trim().min(10).max(600),
    details: z.array(z.string("Detail must be a string").trim().min(2).max(300)).max(20).optional(),
    facultyId: uuidSchema.optional(),
    departmentId: uuidSchema.optional(),
  }),
});

const updatePostingSchema = z.object({
  params: z.object({
    postingId: uuidSchema,
  }),
  body: z
    .object({
      title: z.string("Title must be a string").trim().min(2).max(150).optional(),
      location: z.string("Location must be a string").trim().min(2).max(150).optional(),
      summary: z.string("Summary must be a string").trim().min(10).max(600).optional(),
      details: z.array(z.string("Detail must be a string").trim().min(2).max(300)).max(20).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field is required",
    }),
});

const postingIdParamSchema = z.object({
  params: z.object({
    postingId: uuidSchema,
  }),
});

const listManagedPostingSchema = z.object({
  query: z.object({
    search: z.string("search must be a string").trim().max(120).optional(),
  }),
});

const listPublicPostingSchema = z.object({
  query: z.object({
    limit: z
      .string("limit must be a number")
      .regex(/^\d+$/, "limit must be a positive integer")
      .optional(),
  }),
});

export const PostingValidation = {
  createPostingSchema,
  updatePostingSchema,
  postingIdParamSchema,
  listPublicPostingSchema,
  listManagedPostingSchema,
};
