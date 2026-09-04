import { Router } from "express";
import cardDetailController from "../controllers/cardDetail.controller.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", cardDetailController.getAll);
router.get("/:id", cardDetailController.getById);
router.post("/", uploadSingleImage, cardDetailController.create);
router.put("/:id", uploadSingleImage, cardDetailController.update);
router.delete("/:id", cardDetailController.delete);

export default router;