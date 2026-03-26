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
  listPublicPostingSchema,
};
