import z from "zod";
import { InstitutionType } from "../../../generated/prisma/enums";

export const ApplyForInstitutionValidationSchema = {
  applyForInstitutionSchema: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    instituteName: z.string().min(1, "Institute name is required"),
    instituteShortname: z.string().min(1, "Institute shortname is required"),
    description: z.string().min(1, "Description is required"),
    instituteType: z.enum(
      [
        InstitutionType.COLLEGE,
        InstitutionType.SCHOOL,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER,
      ],
      "Invalid institute type",
    ),
    instituteLogo: z.string().min(1, "Institute logo is required"),
  }),
};
