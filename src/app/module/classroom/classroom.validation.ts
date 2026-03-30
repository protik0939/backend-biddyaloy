import { ClassRoomType } from "../../../generated/prisma/enums";
import { z } from "zod";

const uuidSchema = z.uuid("Please provide a valid id");

export const ClassroomValidation = {
	createClassroomSchema: z.object({
		body: z.object({
			name: z.string("Room name must be a string").trim().max(120).optional(),
			roomNo: z.string("Room number is required").trim().min(1).max(40),
			floor: z.string("Floor is required").trim().min(1).max(40),
			capacity: z.number("Capacity must be a number").int().positive().max(2000),
			roomType: z.enum(ClassRoomType),
		}),
	}),

	updateClassroomSchema: z.object({
		params: z.object({
			classroomId: uuidSchema,
		}),
		body: z
			.object({
				name: z.string("Room name must be a string").trim().max(120).optional(),
				roomNo: z.string("Room number must be a string").trim().min(1).max(40).optional(),
				floor: z.string("Floor must be a string").trim().min(1).max(40).optional(),
				capacity: z.number("Capacity must be a number").int().positive().max(2000).optional(),
				roomType: z.enum(ClassRoomType).optional(),
			})
			.refine((value) => Object.keys(value).length > 0, {
				message: "At least one field is required",
			}),
	}),

	deleteClassroomSchema: z.object({
		params: z.object({
			classroomId: uuidSchema,
		}),
	}),
};
