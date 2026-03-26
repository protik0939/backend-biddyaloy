import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { PostingController } from "./posting.controller";
import { PostingValidation } from "./posting.validation";

const router = Router();

router.get(
  "/teacher/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listTeacherJobPostsPublic,
);

router.get(
  "/student/public",
  validateRequest(PostingValidation.listPublicPostingSchema),
  PostingController.listStudentAdmissionPostsPublic,
);

router.get(
  "/options",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  PostingController.getPostingOptions,
);

router.post(
  "/teacher",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createTeacherJobPost,
);

router.post(
  "/student",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.createPostingSchema),
  PostingController.createStudentAdmissionPost,
);

export const PostingRouter = router;
