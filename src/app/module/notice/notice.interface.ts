export type NoticeAudienceRole = "ADMIN" | "FACULTY" | "DEPARTMENT" | "TEACHER" | "STUDENT";

export interface IListNoticesQuery {
  search?: string;
}

export interface ICreateNoticePayload {
  title: string;
  content: string;
  targetRoles: NoticeAudienceRole[];
}

export interface IUpdateNoticePayload {
  title?: string;
  content?: string;
  targetRoles?: NoticeAudienceRole[];
}
