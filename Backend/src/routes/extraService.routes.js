import express from "express";
import extraServiceController from "../controllers/extraService.controller.js";

const router = express.Router();

router.get("/", extraServiceController.getAll);
router.get("/:id", extraServiceController.getById);
router.post("/", extraServiceController.create);
router.put("/:id", extraServiceController.update);
router.delete("/:id", extraServiceController.delete);

export default router;
