import { Router } from "express";
import contractController from "../controllers/contract.controller.js";

const router = Router();

router.get("/", contractController.getAll);
router.get("/:id", contractController.getById);
router.post("/", contractController.create);
router.put("/:id", contractController.update);
router.delete("/:id", contractController.delete);

export default router;
