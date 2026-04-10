import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AIService } from "./ai.service";

const recommendPostings = catchAsync(async (req: Request, res: Response) => {
  const result = await AIService.recommendPostings(req.body);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "AI recommendation generated successfully",
    data: result,
  });
});

export const AIController = {
  recommendPostings,
};
