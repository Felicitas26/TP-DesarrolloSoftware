import { Router } from "express";
import tipoSalonController from "../controllers/tipoSalon.controller.js";

const router = Router();

router.get("/", tipoSalonController.getAll);

router.get("/:id", tipoSalonController.getById);

router.post("/", tipoSalonController.create);

router.put("/:id", tipoSalonController.update);

router.delete("/:id", tipoSalonController.delete);

export default router;
