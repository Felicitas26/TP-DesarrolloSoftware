import { Router } from "express";
import extraServiceController from "../controllers/extraService.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", extraServiceController.getAll);
router.get("/:id", authenticate, requireRole(["administrador"]), extraServiceController.getById);
router.post("/", authenticate, requireRole(["administrador"]), extraServiceController.create);
router.put("/:id", authenticate, requireRole(["administrador"]), extraServiceController.update);
router.delete("/:id", authenticate, requireRole(["administrador"]), extraServiceController.delete);

export default router;