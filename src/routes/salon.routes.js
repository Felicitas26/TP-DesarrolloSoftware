import { Router } from "express";
import salonController from "../controllers/salon.controller.js";

const router = Router();

router.get("/", salonController.getAll);
router.get("/:id", salonController.getById);
router.post("/", salonController.create);
router.put("/:id", salonController.update);
router.delete("/:id", salonController.delete);

export default router;
