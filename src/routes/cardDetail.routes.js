import express from "express";
import cardDetailController from "../controllers/cardDetail.controller.js";

const router = express.Router();

router.get("/", cardDetailController.getAll);
router.get("/:id", cardDetailController.getById);
router.post("/", cardDetailController.create);
router.put("/:id", cardDetailController.update);
router.delete("/:id", cradDetailController.delete);

export default router;
