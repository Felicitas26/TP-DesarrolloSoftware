import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/", authenticate, requireRole(["administrador"]), paymentController.getAll);
router.get("/:id", authenticate, requireRole(["administrador"]), paymentController.getById);
router.post("/", authenticate, requireRole(["administrador"]), paymentController.create);
router.put("/:id", authenticate, requireRole(["administrador"]), paymentController.update);
router.delete("/:id", authenticate, requireRole(["administrador"]), paymentController.delete);

export default router;