import { Router } from "express";
import cardDetailController from "../controllers/cardDetail.controller.js";

const router = Router();

router.get("/", cardDetailController.getAll);
router.get("/:id", cardDetailController.getById);
router.post("/", cardDetailController.create);
router.put("/:id", cardDetailController.update);
router.delete("/:id", cardDetailController.delete);

export default router;