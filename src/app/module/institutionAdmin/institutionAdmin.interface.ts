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

export interface ICreateInstitutionSemesterPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface IUpdateInstitutionSemesterPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface IUpdateInstitutionAdminProfilePayload {
  name?: string;
  image?: string;
  contactNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bloodGroup?: string;
  gender?: string;
}

export interface IUpsertInstitutionSslCommerzCredentialPayload {
  storeId?: string;
  storePassword?: string;
  baseUrl?: string;
}
