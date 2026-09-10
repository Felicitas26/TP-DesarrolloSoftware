import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/", authenticate, paymentController.getAll);
router.get("/:id", authenticate, paymentController.getById);
router.post("/", authenticate, paymentController.create);
router.put("/:id", authenticate, paymentController.update);
router.delete("/:id", authenticate, paymentController.delete);

export default router;