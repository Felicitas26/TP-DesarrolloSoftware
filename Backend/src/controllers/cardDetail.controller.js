import cardDetailService from "../services/cardDetail.service.js";
import fs from "fs";
import path from "path";

const removeUploadedFile = (imageUrl) => {
    if (!imageUrl || !imageUrl.startsWith("/uploads/")) {
        return;
    }

    const filename = path.basename(imageUrl);
    const filePath = path.resolve("uploads", filename);

    fs.unlink(filePath, () => {});
};

class CardDetailController {

    async getAll(req, res) {
        try {
            const cardDetails = await cardDetailService.getAll();
            return res.status(200).json(cardDetails);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const cardDetail = await cardDetailService.getById(req.params.id);
            return res.status(200).json(cardDetail);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const body = { ...req.body };

            if (req.file) {
                body.imageUrl = `/uploads/${req.file.filename}`;
            }

            const newCardDetail = await cardDetailService.create(body);
            return res.status(201).json(newCardDetail);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
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
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const existing = await cardDetailService.getById(req.params.id);
            await cardDetailService.delete(req.params.id);
            removeUploadedFile(existing?.imageUrl);

            return res.status(200).json({
                message: "Detalle de tarjeta eliminado correctamente."
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }
}

export default new CardDetailController();