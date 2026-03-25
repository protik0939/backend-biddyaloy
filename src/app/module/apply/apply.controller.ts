import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { applyService } from "./apply.service";

const applyForInstitution = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await applyService.applyForInstitution(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Application submitted successfully",
    data: result,
  });
});

export const ApplyController = {
  applyForInstitution,
};