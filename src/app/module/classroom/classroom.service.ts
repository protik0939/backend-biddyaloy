import { AdminRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateClassroomPayload, IUpdateClassroomPayload } from "./classroom.interface";

function createHttpError(statusCode: number, message: string) {
	const error = new Error(message) as Error & { statusCode?: number };
	error.statusCode = statusCode;
	return error;
}

function normalizeSearch(search?: string) {
	const value = search?.trim();
	return value || undefined;
}

async function resolveAcademicContext(userId: string) {
	const adminProfile = await prisma.adminProfile.findUnique({
		where: {
			userId,
		},
		select: {
			role: true,
			institutionId: true,
		},
	});

	if (!adminProfile?.institutionId) {
		throw createHttpError(403, "Only institution academic admins can access this resource");
	}

	return adminProfile;
}

function assertCanManageRooms(adminRole: AdminRole) {
	if (adminRole !== AdminRole.FACULTYADMIN && adminRole !== AdminRole.INSTITUTIONADMIN) {
		throw createHttpError(403, "Only faculty and institution admins can manage rooms");
	}
}

const listClassrooms = async (userId: string, search?: string) => {
	const context = await resolveAcademicContext(userId);
	const normalizedSearch = normalizeSearch(search);

	return prisma.classRoom.findMany({
		where: {
			institutionId: context.institutionId,
			...(normalizedSearch
				? {
						OR: [
							{ name: { contains: normalizedSearch, mode: "insensitive" } },
							{ roomNo: { contains: normalizedSearch, mode: "insensitive" } },
							{ floor: { contains: normalizedSearch, mode: "insensitive" } },
						],
					}
				: {}),
		},
		orderBy: [{ floor: "asc" }, { roomNo: "asc" }, { createdAt: "desc" }],
	});
};

const createClassroom = async (userId: string, payload: ICreateClassroomPayload) => {
	const context = await resolveAcademicContext(userId);
	assertCanManageRooms(context.role);

	const duplicate = await prisma.classRoom.findFirst({
		where: {
			institutionId: context.institutionId,
			roomNo: {
				equals: payload.roomNo.trim(),
				mode: "insensitive",
			},
			floor: {
				equals: payload.floor.trim(),
				mode: "insensitive",
			},
		},
		select: {
			id: true,
		},
	});

	if (duplicate) {
		throw createHttpError(409, "A room with this room number and floor already exists");
	}

	return prisma.classRoom.create({
		data: {
			name: payload.name?.trim() || null,
			roomNo: payload.roomNo.trim(),
			floor: payload.floor.trim(),
			capacity: payload.capacity,
			roomType: payload.roomType,
			institutionId: context.institutionId,
		},
	});
};

const updateClassroom = async (
	userId: string,
	classroomId: string,
	payload: IUpdateClassroomPayload,
) => {
	const context = await resolveAcademicContext(userId);
	assertCanManageRooms(context.role);

	const current = await prisma.classRoom.findFirst({
		where: {
			id: classroomId,
			institutionId: context.institutionId,
		},
		select: {
			id: true,
			roomNo: true,
			floor: true,
		},
	});

	if (!current) {
		throw createHttpError(404, "Room not found for this institution");
	}

	const nextRoomNo = payload.roomNo?.trim() ?? current.roomNo;
	const nextFloor = payload.floor?.trim() ?? current.floor;

	const duplicate = await prisma.classRoom.findFirst({
		where: {
			id: {
				not: classroomId,
			},
			institutionId: context.institutionId,
			roomNo: {
				equals: nextRoomNo,
				mode: "insensitive",
			},
			floor: {
				equals: nextFloor,
				mode: "insensitive",
			},
		},
		select: {
			id: true,
		},
	});

	if (duplicate) {
		throw createHttpError(409, "A room with this room number and floor already exists");
	}

	return prisma.classRoom.update({
		where: {
			id: classroomId,
		},
		data: {
			name: payload.name === undefined ? undefined : payload.name.trim() || null,
			roomNo: payload.roomNo?.trim(),
			floor: payload.floor?.trim(),
			capacity: payload.capacity,
			roomType: payload.roomType,
		},
	});
};

const deleteClassroom = async (userId: string, classroomId: string) => {
	const context = await resolveAcademicContext(userId);
	assertCanManageRooms(context.role);

	const room = await prisma.classRoom.findFirst({
		where: {
			id: classroomId,
			institutionId: context.institutionId,
		},
		select: {
			id: true,
		},
	});

	if (!room) {
		throw createHttpError(404, "Room not found for this institution");
	}

	const assignedRoutine = await (prisma as any).routine.findFirst({
		where: {
			classRoomId: classroomId,
			institutionId: context.institutionId,
		},
		select: {
			id: true,
		},
	});

	if (assignedRoutine) {
		throw createHttpError(409, "Cannot delete room because routines are assigned to it");
	}

	await prisma.classRoom.delete({
		where: {
			id: classroomId,
		},
	});

	return {
		id: classroomId,
	};
};

export const ClassroomService = {
	listClassrooms,
	createClassroom,
	updateClassroom,
	deleteClassroom,
};
