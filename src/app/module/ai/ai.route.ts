import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AIController } from "./ai.controller";
import { AIValidation } from "./ai.validation";

const router = Router();

router.post(
  "/recommend-postings",
  validateRequest(AIValidation.recommendationRequestSchema),
  AIController.recommendPostings,
);

export const AIRouter = router;
