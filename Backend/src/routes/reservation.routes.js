import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import reservationController from "../controllers/reservation.controller.js";

const router = Router();

console.log("authenticate:", typeof authenticate);
console.log("getByClient:", typeof reservationController.getByClient);

router.get("/", reservationController.getAll);
router.get("/mis-reservas", authenticate, reservationController.getByClient);
router.put("/:id/status", reservationController.updateStatus);
router.get("/:id", reservationController.getById);
router.post("/", authenticate, reservationController.create);
router.put("/:id", reservationController.update);
router.delete("/:id", reservationController.delete);

export default router;