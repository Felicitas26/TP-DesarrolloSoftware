import { Router } from "express";
import cardDetailController from "../controllers/cardDetail.controller.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", cardDetailController.getAll);
router.get("/:id", cardDetailController.getById);
router.post("/", authenticate, requireRole(["administrador"]), uploadSingleImage, cardDetailController.create);
router.put("/:id", authenticate, requireRole(["administrador"]), uploadSingleImage, cardDetailController.update);
router.delete("/:id", authenticate, requireRole(["administrador"]), cardDetailController.delete);

export default router;