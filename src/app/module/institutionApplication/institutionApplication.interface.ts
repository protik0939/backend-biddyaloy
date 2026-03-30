import { InstitutionApplicationStatus, InstitutionType } from "../../../generated/prisma/enums";

export interface ICreateInstitutionApplication {
  institutionName: string;
  description?: string;
  shortName?: string;
  institutionType: InstitutionType;
  institutionLogo?: string;
}

export interface IReviewInstitutionApplication {
  status: Extract<InstitutionApplicationStatus, "APPROVED" | "REJECTED">;
  rejectionReason?: string;
}

export interface IInitiateInstitutionSubscriptionPayment {
  plan: "MONTHLY" | "HALF_YEARLY" | "YEARLY";
}
