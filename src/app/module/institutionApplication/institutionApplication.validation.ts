import z from "zod";
import { InstitutionApplicationStatus, InstitutionType } from "../../../generated/prisma/enums";

export const InstitutionApplicationValidation = {
  createSchema: z.object({
    body: z.object({
      institutionName: z.string().min(2, "Institution name is required"),
      description: z.string().max(500, "Description is too long").optional(),
      shortName: z.string().min(2, "Short name must be at least 2 characters").max(50, "Short name is too long").optional(),
      institutionType: z.enum([
        InstitutionType.SCHOOL,
        InstitutionType.COLLEGE,
        InstitutionType.UNIVERSITY,
        InstitutionType.TRAINING_CENTER,
        InstitutionType.OTHER,
      ]),
      institutionLogo: z.string().url("Institution logo must be a valid URL").optional(),
    }),
  }),
  reviewSchema: z.object({
    body: z
      .object({
        status: z.enum([
          InstitutionApplicationStatus.APPROVED,
          InstitutionApplicationStatus.REJECTED,
        ]),
        rejectionReason: z.string().max(500, "Rejection reason is too long").optional(),
      })
      .refine(
        (data) =>
          data.status === InstitutionApplicationStatus.APPROVED ||
          (data.rejectionReason && data.rejectionReason.trim().length > 0),
        {
          message: "Rejection reason is required when rejecting an application",
          path: ["rejectionReason"],
        },
      ),
  }),
  initiateSubscriptionPaymentSchema: z.object({
    body: z.object({
      plan: z.enum(["MONTHLY", "HALF_YEARLY", "YEARLY"]),
    }),
  }),
  paymentCallbackQuerySchema: z.object({
    query: z.object({
      tran_id: z.string().trim().min(1),
      val_id: z.string().trim().optional(),
      status: z.string().trim().optional(),
      bank_tran_id: z.string().trim().optional(),
      card_type: z.string().trim().optional(),
    }),
  }),
};
