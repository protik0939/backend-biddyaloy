import { z } from "zod";

const recommendationRequestSchema = z.object({
  body: z.object({
    mode: z.enum(["teacher", "student"]),
    query: z.string("query is required").trim().min(8).max(1200),
    postings: z
      .array(
        z.object({
          id: z.string("id is required").trim().min(1),
          title: z.string("title is required").trim().min(2).max(180),
          summary: z.string("summary is required").trim().min(6).max(1200),
          location: z.string("location must be a string").trim().max(180).nullable().optional(),
          institution: z.string("institution is required").trim().min(2).max(180),
          departmentName: z.string("departmentName must be a string").trim().max(180).nullable().optional(),
          programTitle: z.string("programTitle must be a string").trim().max(180).nullable().optional(),
        }),
      )
      .min(1, "At least one posting is required")
      .max(40, "A maximum of 40 postings can be analyzed per request"),
  }),
});

export const AIValidation = {
  recommendationRequestSchema,
};
