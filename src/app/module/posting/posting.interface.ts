export interface ICreatePostingPayload {
  title: string;
  location?: string;
  summary: string;
  details?: string[];
  facultyId?: string;
  departmentId?: string;
}

export interface IUpdatePostingPayload {
  title?: string;
  location?: string;
  summary?: string;
  details?: string[];
}

export interface IPostingOptionItem {
  id: string;
  fullName: string;
}

export interface IPostingProgramOptionItem {
  id: string;
  title: string;
  departmentId: string;
}

export type PublicPostingType = "teacher" | "student";

export type PublicPostingSort = "newest" | "oldest" | "title_asc" | "title_desc";

export interface IPublicPostingExploreQuery {
  type: PublicPostingType;
  search?: string;
  location?: string;
  department?: string;
  sort?: PublicPostingSort;
  page?: number;
  pageSize?: number;
}
