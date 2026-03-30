import { ClassRoomType } from "../../../generated/prisma/enums";

export interface ICreateClassroomPayload {
	name?: string;
	roomNo: string;
	floor: string;
	capacity: number;
	roomType: ClassRoomType;
}

export interface IUpdateClassroomPayload {
	name?: string;
	roomNo?: string;
	floor?: string;
	capacity?: number;
	roomType?: ClassRoomType;
}
