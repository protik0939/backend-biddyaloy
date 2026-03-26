import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { FacultyProfileService } from "./facultyProfile.service";

const getFacultyProfileDetails = catchAsync(async (_req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await FacultyProfileService.getFacultyProfileDetails(user.id);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculty profile fetched successfully",
    data: result,
  });
});

const updateFacultyDisplayName = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await FacultyProfileService.updateFacultyDisplayName(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Faculty display name updated successfully",
    data: result,
  });
});

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await FacultyProfileService.createDepartment(user.id, req.body);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Department created successfully",
    data: result,
  });
});

export const FacultyProfileController = {
  createDepartment,
  getFacultyProfileDetails,
  updateFacultyDisplayName,
};
