import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { HomeService } from "./home.service";

const getContent = catchAsync(async (_req: Request, res: Response) => {
  const result = await HomeService.getContent();

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Home content fetched successfully",
    data: result,
  });
});

export const HomeController = {
  getContent,
};
