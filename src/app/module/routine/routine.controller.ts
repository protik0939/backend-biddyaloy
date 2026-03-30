import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { RoutineService } from "./routine.service";

const listRoutines = catchAsync(async (req: Request, res: Response) => {
  const user = res.locals.authUser as { id: string };
  const result = await RoutineService.listRoutines(user.id, {
    sectionId: typeof req.query.sectionId === "string" ? req.query.sectionId : undefined,
    semesterId: typeof req.query.semesterId === "string" ? req.query.semesterId : undefined,
    teacherInitial: typeof req.query.teacherInitial === "string" ? req.query.teacherInitial : undefined,
    search: typeof req.query.search === "string" ? req.query.search : undefined,
  });

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Routine list fetched successfully",
    data: result,
  });
});

export const RoutineController = {
  listRoutines,
};
