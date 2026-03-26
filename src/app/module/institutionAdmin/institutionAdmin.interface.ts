export type InstitutionSubAdminAccountType = "FACULTY" | "DEPARTMENT";

export interface ICreateInstitutionSubAdminPayload {
  name: string;
  email: string;
  password: string;
  accountType: InstitutionSubAdminAccountType;
}
