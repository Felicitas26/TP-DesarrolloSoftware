import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/perfil", authenticate, usuarioController.getPerfil);
router.put("/cambiar-password", authenticate, usuarioController.cambiarPassword);
router.delete("/baja", authenticate, usuarioController.darDeBaja);

export default router;
