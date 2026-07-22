import { Router } from "express";
import ubicacionController from "../controllers/ubicacion.controller.js";

const router = Router();

router.get("/", ubicacionController.getAll);
router.get("/:id", ubicacionController.getById);
router.post("/", ubicacionController.create);
router.put("/:id", ubicacionController.update);
router.delete("/:id", ubicacionController.delete);

export default router;
