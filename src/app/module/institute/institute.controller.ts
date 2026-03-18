import { request } from "node:http";
import { catchAsync } from "../../shared/catchAsync";
import { Request, Response } from "express";
import { InstituteService } from "./institute.service";
import { sendResponse } from "../../shared/sendResponse";

const createInstitution = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await InstituteService.createInstitution(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Institution created successfully",
    data: result,
  });
});

export const InstituteController = {
  createInstitution,
};