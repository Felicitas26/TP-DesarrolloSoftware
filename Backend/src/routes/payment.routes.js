import express from "express";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/", paymentController.getAll);
router.get("/:id", paymentController.getById);
router.post("/", paymentController.create);
router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.delete);

export default router;