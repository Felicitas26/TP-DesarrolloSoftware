import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

import reservationController from "../controllers/reservation.controller.js";

const router = Router();

router.get("/", authenticate, requireRole(["administrador"]), reservationController.getAll);
router.get("/mis-reservas", authenticate, reservationController.getByClient);
router.put("/:id/status", authenticate, requireRole(["administrador"]), reservationController.updateStatus);
router.get("/:id", authenticate, reservationController.getById);
router.post("/", authenticate, reservationController.create);
router.put("/:id", authenticate, reservationController.update);
router.delete("/:id", authenticate, reservationController.delete);

export default router;