import { Router } from "express";
import usuarioController from "../controllers/usuario.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/perfil", authenticate, usuarioController.getPerfil);
router.put("/cambiar-password", authenticate, usuarioController.cambiarPassword);
router.delete("/baja", authenticate, usuarioController.darDeBaja);
router.get("/desactivados", authenticate, requireRole(["administrador"]), usuarioController.getDesactivados);
router.put("/reactivar/:id", authenticate, requireRole(["administrador"]), usuarioController.reactivarUsuario);
router.get("/administradores", authenticate, requireRole(["administrador"]), usuarioController.getAdministradores);
router.post("/administradores", authenticate, requireRole(["administrador"]), usuarioController.createAdministrador);
router.put("/administradores/:id", authenticate, requireRole(["administrador"]), usuarioController.updateAdministrador);
router.delete("/administradores/:id", authenticate, requireRole(["administrador"]), usuarioController.deleteAdministrador);

export default router;
