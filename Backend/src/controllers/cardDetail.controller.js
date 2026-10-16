import cardDetailService from "../services/cardDetail.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "..", "uploads");

const removeUploadedFile = (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith("/uploads/")) {
        return;
    }

    const filename = path.basename(imageUrl);
    const filePath = path.join(uploadsDir, filename);

    fs.unlink(filePath, () => {});
};

class CardDetailController {

    getAll = asyncHandler(async (req, res) => {
        const cardDetails = await cardDetailService.getAll();
        return res.status(200).json(cardDetails);
    });

    getById = asyncHandler(async (req, res) => {
        const cardDetail = await cardDetailService.getById(req.params.id);
        return res.status(200).json(cardDetail);
    });

    create = asyncHandler(async (req, res) => {
        const body = { ...req.body };

        if (req.file) {
            body.imageUrl = `/uploads/${req.file.filename}`;
        }

        const newCardDetail = await cardDetailService.create(body);
        return res.status(201).json(newCardDetail);
    });

    update = asyncHandler(async (req, res) => {
        const body = { ...req.body };

        if (req.file) {
            const current = await cardDetailService.getById(req.params.id);
            body.imageUrl = `/uploads/${req.file.filename}`;
            removeUploadedFile(current?.imageUrl);
        }

        const cardDetailUpdated = await cardDetailService.update(
            req.params.id,
            body
        );

        return res.status(200).json({
            message: "Detalle de tarjeta actualizado correctamente.",
            cardDetail: cardDetailUpdated
        });
    });

    delete = asyncHandler(async (req, res) => {
        const existing = await cardDetailService.getById(req.params.id);
        await cardDetailService.delete(req.params.id);
        removeUploadedFile(existing?.imageUrl);

        return res.status(200).json({
            message: "Detalle de tarjeta eliminado correctamente."
        });
    });
}

export default new CardDetailController();
