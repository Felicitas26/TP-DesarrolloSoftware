import { Router } from "express";
import loungeTypeController from "../controllers/loungeType.controller.js";

const router = Router();

router.get("/", loungeTypeController.getAll);
router.get("/:id", loungeTypeController.getById);
router.post("/", loungeTypeController.create);
router.put("/:id", loungeTypeController.update);
router.delete("/:id", loungeTypeController.delete);

export default router;
