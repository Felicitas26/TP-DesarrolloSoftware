import { Router } from "express";
import clienteController from "../controllers/cliente.controller.js"; 

const router = Router();

router.get("/", clienteController.getAll);
router.get("/:dni", clienteController.getById);
router.post("/", clienteController.create);
router.put("/:dni", clienteController.update);
router.delete("/:dni", clienteController.delete);

export default router;
