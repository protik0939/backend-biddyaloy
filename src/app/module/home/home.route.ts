import { Router } from "express";
import { HomeController } from "./home.controller";

const router = Router();

router.get("/content", HomeController.getContent);

export const HomeRouter = router;
