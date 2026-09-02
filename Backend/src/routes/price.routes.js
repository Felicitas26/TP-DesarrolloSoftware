import { Router } from "express";
import priceController from "../controllers/price.controller.js";

const router = Router();

router.get("/", priceController.getAll);
router.get("/:idLoungeType/:effectiveDate", priceController.getById);
router.post("/", priceController.create);
router.put("/:idLoungeType/:effectiveDate", priceController.update);
router.delete("/:idLoungeType/:effectiveDate", priceController.delete);

export default router;
