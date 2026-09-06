import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

import contractController from "../controllers/contract.controller.js";

const router = Router();

router.get("/", authenticate, requireRole(["administrador"]), contractController.getAll);
router.get("/mis-contratos", authenticate, contractController.getByClient);
router.get("/:id", authenticate, contractController.getById);
router.put("/:id", authenticate, contractController.update);
router.post("/:id/enviar", authenticate, contractController.enviar);
router.post("/:id/aceptar", authenticate, contractController.firmar);
router.put("/:id/revision", authenticate, requireRole(["administrador"]), contractController.review);
router.put("/:id/modificacion", authenticate, contractController.solicitarModificacion);
router.put("/:id/modificacion/revision", authenticate, requireRole(["administrador"]), contractController.revisarModificacion);
router.post("/:id/modificacion/rechazo", authenticate, contractController.contestarRechazoModificacion);

export default router;