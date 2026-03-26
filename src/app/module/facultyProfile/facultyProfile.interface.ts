export interface IUpdateFacultyDisplayNamePayload {
  name?: string;
  fullName?: string;
  facultyId?: string;
  shortName?: string;
  description?: string;
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
}
