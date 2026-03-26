import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InstitutionAdminService } from "./institutionAdmin.service";

const createSubAdminAccount = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.createSubAdminAccount(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const listFaculties = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await InstitutionAdminService.listFaculties(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculties fetched successfully",
    data: result,
  });
});

export const InstitutionAdminController = {
  createSubAdminAccount,
  listFaculties,
};
