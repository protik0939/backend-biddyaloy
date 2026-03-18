import z from "zod";
import { InstitutionType } from "../../../generated/prisma/enums";

const createInstitutionSchema = z.object({
  body: z.object({
    name: z
      .string("Institution name is required")
      .min(1, "Institution name is required"),
    description: z
      .string("Institution description is required")
      .min(1, "Institution description is required"),
    shortName: z
      .string("Institution short name is required")
      .min(1, "Institution short name is required"),
    type: z.enum([InstitutionType.UNIVERSITY, InstitutionType.COLLEGE, InstitutionType.SCHOOL, InstitutionType.TRAINING_CENTER, InstitutionType.OTHER], {
      message: `Invalid institution type. Must be one of: ${InstitutionType.UNIVERSITY}, ${InstitutionType.COLLEGE}, ${InstitutionType.SCHOOL}, ${InstitutionType.TRAINING_CENTER}, ${InstitutionType.OTHER}`,
    }),
    institutionLogo: z
      .string("Institution logo is required")
      .min(1, "Institution logo is required"),
  }),
});

export const InstituteValidation = {
  createInstitutionSchema,
};