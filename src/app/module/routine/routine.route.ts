import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { RoutineController } from "./routine.controller";
import { RoutineValidation } from "./routine.validation";

const router = Router();

router.get(
  "/",
  requireSessionRole("SUPERADMIN", "ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(RoutineValidation.listRoutinesSchema),
  RoutineController.listRoutines,
);

export const RoutineRouter = router;
