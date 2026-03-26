export type InstitutionSubAdminAccountType = "FACULTY" | "DEPARTMENT";

export interface ICreateInstitutionSubAdminPayload {
  name: string;
  email: string;
  password: string;
  accountType: InstitutionSubAdminAccountType;
  facultyId?: string;
  facultyFullName?: string;
  facultyShortName?: string;
  facultyDescription?: string;
  departmentFullName?: string;
  departmentShortName?: string;
  departmentDescription?: string;
}
