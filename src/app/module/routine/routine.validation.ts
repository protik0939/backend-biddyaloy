import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");

export const RoutineValidation = {
  listRoutinesSchema: z.object({
    query: z.object({
      sectionId: uuidSchema.optional(),
      semesterId: uuidSchema.optional(),
      teacherInitial: z.string("teacherInitial must be a string").trim().min(1).max(40).optional(),
      search: z.string("search must be a string").trim().max(120).optional(),
    }),
  }),
};
