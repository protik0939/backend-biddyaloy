import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { InstituteRoutes } from "../module/institute/institute.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/institute", InstituteRoutes);

export const IndexRouters = router;