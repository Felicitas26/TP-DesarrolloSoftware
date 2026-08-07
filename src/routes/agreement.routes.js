import { Router } from "express";
import agreementController from "../controllers/agreement.controller.js";

const router = Router();

router.get("/", agreementController.getAll);
router.get("/:id", agreementController.getById);
router.post("/", agreementController.create);
router.put("/:id", agreementController.update);
router.delete("/:id", agreementController.delete);

export default router;
