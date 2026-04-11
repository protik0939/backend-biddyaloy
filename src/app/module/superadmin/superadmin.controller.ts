import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SuperAdminService, type PaginationQuery } from "./superadmin.service";

const readPositiveInt = (value: any, defaultValue = 1): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
};

const readQueryValue = (value: any): string | undefined => {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
};

const listAdmins = catchAsync(async (req: Request, res: Response) => {
  const query: PaginationQuery = {
    page: readPositiveInt(req.query.page, 1),
    pageSize: readPositiveInt(req.query.pageSize, 20),
    search: readQueryValue(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc",
  };

  const result = await SuperAdminService.listAdmins(query);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Admins fetched successfully",
    data: result,
  });
});

const listInstitutions = catchAsync(async (req: Request, res: Response) => {
  const query: PaginationQuery = {
    page: readPositiveInt(req.query.page, 1),
    pageSize: readPositiveInt(req.query.pageSize, 20),
    search: readQueryValue(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc",
  };

  const result = await SuperAdminService.listInstitutions(query);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Institutions fetched successfully",
    data: result,
  });
});

const listStudents = catchAsync(async (req: Request, res: Response) => {
  const query: PaginationQuery = {
    page: readPositiveInt(req.query.page, 1),
    pageSize: readPositiveInt(req.query.pageSize, 20),
    search: readQueryValue(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc",
  };

  const result = await SuperAdminService.listStudents(query);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Students fetched successfully",
    data: result,
  });
});

const listTeachers = catchAsync(async (req: Request, res: Response) => {
  const query: PaginationQuery = {
    page: readPositiveInt(req.query.page, 1),
    pageSize: readPositiveInt(req.query.pageSize, 20),
    search: readQueryValue(req.query.search),
    sort: req.query.sort === "asc" ? "asc" : "desc",
  };

  const result = await SuperAdminService.listTeachers(query);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Teachers fetched successfully",
    data: result,
  });
});

const listRecentHighlights = catchAsync(async (req: Request, res: Response) => {
  const query: PaginationQuery = {
    page: readPositiveInt(req.query.page, 1),
    pageSize: readPositiveInt(req.query.pageSize, 6),
    sort: req.query.sort === "asc" ? "asc" : "desc",
  };

  const result = await SuperAdminService.listRecentHighlights(query);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Recent highlights fetched successfully",
    data: result,
  });
});

export const SuperAdminController = {
  listAdmins,
  listInstitutions,
  listStudents,
  listTeachers,
  listRecentHighlights,
};
