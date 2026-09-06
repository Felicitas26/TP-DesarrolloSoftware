import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import notificationController from "../controllers/notification.controller.js";

const router = Router();

router.get("/", authenticate, notificationController.getByUser);
router.get("/contador", authenticate, notificationController.countUnread);
router.put("/:id/leida", authenticate, notificationController.markAsRead);
router.put("/marcar-todas", authenticate, notificationController.markAllAsRead);

export default router;
