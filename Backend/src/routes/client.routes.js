import { Router } from "express";
import clientController from "../../src/controllers/client.controller.js"; 
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/check-email", clientController.checkEmail);
router.get("/me", authenticate, clientController.getMyProfile);
router.put("/me", authenticate, clientController.updateMyProfile);
router.get("/", authenticate, requireRole(["administrador"]), clientController.getAll);
router.get("/:id", authenticate, requireRole(["administrador"]), clientController.getById);
router.post("/", clientController.create);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.delete);

export default router;
