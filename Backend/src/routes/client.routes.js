import { Router } from "express";
import clientController from "../../src/controllers/client.controller.js"; 
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", clientController.getAll);
router.get("/me", authenticate, clientController.getMyProfile);
router.put("/me", authenticate, clientController.updateMyProfile);
router.get("/:id", clientController.getById);
router.post("/", clientController.create);
router.put("/:id", clientController.update);
router.delete("/:id", clientController.delete);

export default router;
