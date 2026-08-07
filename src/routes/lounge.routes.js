import { Router } from "express";
import loungeController from "../controllers/lounge.controller.js";

const router = Router();

router.get("/", loungeController.getAll);
router.get("/:id", loungeController.getById);
router.post("/", loungeController.create);
router.put("/:id", loungeController.update);
router.delete("/:id", loungeController.delete);

export default router;
