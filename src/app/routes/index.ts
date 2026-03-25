import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { InstituteRoutes } from "../module/institute/institute.route";
import { InstitutionApplicationRouter } from "../module/institutionApplication/institutionApplication.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/institute", InstituteRoutes);
router.use("/institution-applications", InstitutionApplicationRouter);

export const IndexRouters = router;