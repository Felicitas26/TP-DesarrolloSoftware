import express from "express";
import detalleTarjetaController from "../controllers/detalleTarjeta.controller.js";

const router = express.Router();

router.get("/", detalleTarjetaController.getAll);
router.get("/:id", detalleTarjetaController.getById);
router.post("/", detalleTarjetaController.create);
router.put("/:id", detalleTarjetaController.update);
router.delete("/:id", detalleTarjetaController.delete);

export default router;
