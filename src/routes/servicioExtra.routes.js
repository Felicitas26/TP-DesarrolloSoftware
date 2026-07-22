import express from "express";
import servicioExtraController from "../controllers/servicioExtra.controller.js";

const router = express.Router();

router.get("/", servicioExtraController.getAll);
router.get("/:id", servicioExtraController.getById);
router.post("/", servicioExtraController.create);
router.put("/:id", servicioExtraController.update);
router.delete("/:id", servicioExtraController.delete);

export default router;
