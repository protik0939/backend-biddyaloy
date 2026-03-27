export interface IUpdateFacultyDisplayNamePayload {
  name?: string;
  fullName?: string;
  facultyId?: string;
  shortName?: string;
  description?: string;
  image?: string;
  contactNo?: string;
  presentAddress?: string;
  permanentAddress?: string;
  bloodGroup?: string;
  gender?: string;
}

export interface IUpdatedFacultyDisplayNameResult {
  userId: string;
  name: string;
  facultyId: string | null;
  facultyName: string | null;
}

export interface IFacultyProfileDetailsResult {
  userId: string;
  institutionId: string;
  facultyId: string | null;
  fullName: string;
  shortName: string | null;
  description: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    contactNo?: string | null;
    presentAddress?: string | null;
    permanentAddress?: string | null;
    bloodGroup?: string | null;
    gender?: string | null;
  };
  institution: {
    id: string;
    name: string;
    shortName: string | null;
    institutionLogo: string | null;
  } | null;
  stats: {
    totalDepartments: number;
    totalTeachers: number;
    totalStudents: number;
    departmentAccounts: number;
    activeCourses: number;
  };
}

export interface ICreateFacultyDepartmentPayload {
  fullName: string;
  shortName?: string;
  description?: string;
  facultyId?: string;
}

export interface IFacultyDepartmentResult {
  id: string;
  fullName: string;
  shortName: string | null;
  description: string | null;
  facultyId: string | null;
  createdAt: Date;
}
