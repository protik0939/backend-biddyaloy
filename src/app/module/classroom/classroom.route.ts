import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { ClassroomController } from "./classroom.controller";
import { ClassroomValidation } from "./classroom.validation";

const router = Router();

router.get("/", requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"), ClassroomController.listClassrooms);

router.post(
	"/",
	requireSessionRole("ADMIN", "FACULTY"),
	validateRequest(ClassroomValidation.createClassroomSchema),
	ClassroomController.createClassroom,
);

router.patch(
	"/:classroomId",
	requireSessionRole("ADMIN", "FACULTY"),
	validateRequest(ClassroomValidation.updateClassroomSchema),
	ClassroomController.updateClassroom,
);

router.delete(
	"/:classroomId",
	requireSessionRole("ADMIN", "FACULTY"),
	validateRequest(ClassroomValidation.deleteClassroomSchema),
	ClassroomController.deleteClassroom,
);

export const ClassroomRouter = router;
