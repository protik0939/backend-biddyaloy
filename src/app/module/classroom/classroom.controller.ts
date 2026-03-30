import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ClassroomService } from "./classroom.service";

const readParam = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value[0] : (value ?? "");

const readQueryValue = (value: unknown) => {
	if (Array.isArray(value)) {
		return typeof value[0] === "string" ? value[0] : undefined;
	}

	return typeof value === "string" ? value : undefined;
};

const listClassrooms = catchAsync(async (req: Request, res: Response) => {
	const user = res.locals.authUser as { id: string };
	const result = await ClassroomService.listClassrooms(user.id, readQueryValue(req.query.search));

	sendResponse(res, {
		httpStatusCode: 200,
		success: true,
		message: "Rooms fetched successfully",
		data: result,
	});
});

const createClassroom = catchAsync(async (req: Request, res: Response) => {
	const user = res.locals.authUser as { id: string };
	const result = await ClassroomService.createClassroom(user.id, req.body);

	sendResponse(res, {
		httpStatusCode: 201,
		success: true,
		message: "Room created successfully",
		data: result,
	});
});

const updateClassroom = catchAsync(async (req: Request, res: Response) => {
	const user = res.locals.authUser as { id: string };
	const result = await ClassroomService.updateClassroom(user.id, readParam(req.params.classroomId), req.body);

	sendResponse(res, {
		httpStatusCode: 200,
		success: true,
		message: "Room updated successfully",
		data: result,
	});
});

const deleteClassroom = catchAsync(async (req: Request, res: Response) => {
	const user = res.locals.authUser as { id: string };
	const result = await ClassroomService.deleteClassroom(user.id, readParam(req.params.classroomId));

	sendResponse(res, {
		httpStatusCode: 200,
		success: true,
		message: "Room deleted successfully",
		data: result,
	});
});

export const ClassroomController = {
	listClassrooms,
	createClassroom,
	updateClassroom,
	deleteClassroom,
};
