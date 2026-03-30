import { Router } from "express";
import { requireSessionRole } from "../../middleware/requireSessionRole";
import { validateRequest } from "../../middleware/validateRequest";
import { NoticeController } from "./notice.controller";
import { NoticeValidation } from "./notice.validation";

const router = Router();

router.get(
  "/",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(NoticeValidation.listNoticesSchema),
  NoticeController.listNotices,
);

router.get(
  "/unread-count",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  NoticeController.getUnreadCount,
);

router.post(
  "/",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.createNoticeSchema),
  NoticeController.createNotice,
);

router.patch(
  "/:noticeId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.updateNoticeSchema),
  NoticeController.updateNotice,
);

router.delete(
  "/:noticeId",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT"),
  validateRequest(NoticeValidation.noticeParamsSchema),
  NoticeController.deleteNotice,
);

router.post(
  "/:noticeId/read",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  validateRequest(NoticeValidation.noticeParamsSchema),
  NoticeController.markNoticeAsRead,
);

router.post(
  "/read-all",
  requireSessionRole("ADMIN", "FACULTY", "DEPARTMENT", "TEACHER", "STUDENT"),
  NoticeController.markAllNoticesAsRead,
);

export const NoticeRouter = router;
