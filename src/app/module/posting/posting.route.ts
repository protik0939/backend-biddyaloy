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

router.get(
  "/teacher/manage",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.listManagedPostingSchema),
  PostingController.listTeacherJobPostsManaged,
);

router.get(
  "/student/manage",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.listManagedPostingSchema),
  PostingController.listStudentAdmissionPostsManaged,
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

router.patch(
  "/teacher/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.updatePostingSchema),
  PostingController.updateTeacherJobPost,
);

router.patch(
  "/student/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.updatePostingSchema),
  PostingController.updateStudentAdmissionPost,
);

router.delete(
  "/teacher/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.postingIdParamSchema),
  PostingController.deleteTeacherJobPost,
);

router.delete(
  "/student/:postingId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(PostingValidation.postingIdParamSchema),
  PostingController.deleteStudentAdmissionPost,
);

export const PostingRouter = router;
