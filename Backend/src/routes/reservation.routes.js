import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

import reservationController from "../controllers/reservation.controller.js";

const router = Router();

router.get("/", authenticate, requireRole(["administrador"]), reservationController.getAll);
router.get("/mis-reservas", authenticate, reservationController.getByClient);
router.get("/reactivaciones", authenticate, requireRole(["administrador"]), reservationController.getPedidosReactivacion);
router.put("/reactivaciones/:id/aprobar", authenticate, requireRole(["administrador"]), reservationController.aprobarReactivacion);
router.put("/reactivaciones/:id/rechazar", authenticate, requireRole(["administrador"]), reservationController.rechazarReactivacion);
router.put("/:id/pedir-reactivacion", authenticate, reservationController.pedirReactivacion);
router.put("/:id/status", authenticate, requireRole(["administrador"]), reservationController.updateStatus);
router.get("/:id", authenticate, reservationController.getById);
router.post("/", authenticate, reservationController.create);
router.put("/:id", authenticate, reservationController.update);
router.delete("/:id", authenticate, reservationController.delete);

export default router;