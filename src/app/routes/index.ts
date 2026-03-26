import { Router } from "express";
import { DepartmentRouter } from "../module/department/department.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { FacultyProfileRouter } from "../module/facultyProfile/facultyProfile.route";
import { InstituteRoutes } from "../module/institute/institute.route";
import { InstitutionAdminRouter } from "../module/institutionAdmin/institutionAdmin.route";
import { InstitutionApplicationRouter } from "../module/institutionApplication/institutionApplication.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/department", DepartmentRouter);
router.use("/faculty", FacultyProfileRouter);
router.use("/institute", InstituteRoutes);
router.use("/institution-applications", InstitutionApplicationRouter);
router.use("/institution-admin", InstitutionAdminRouter);

export const IndexRouters = router;