import priceService from "../services/price.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class PriceController {

    getAll = asyncHandler(async (req, res) => {
        const list = await priceService.getAll();
        return res.status(200).json(list);
    });

    getById = asyncHandler(async (req, res) => {
        const { idLoungeType, effectiveDate } = req.params;
        const price = await priceService.getById(idLoungeType, effectiveDate);
        return res.status(200).json(price);
    });

    getActive = asyncHandler(async (req, res) => {
        const { idLoungeType, dateEvent } = req.params;
        const price = await priceService.getActive(idLoungeType, dateEvent);
        return res.status(200).json(price);
    });

    create = asyncHandler(async (req, res) => {
        const newPrice = await priceService.create(req.body);
        return res.status(201).json(newPrice);
    });

    update = asyncHandler(async (req, res) => {
        const { idLoungeType, effectiveDate } = req.params;
        const updated = await priceService.update(idLoungeType, effectiveDate, req.body);
        return res.status(200).json(updated);
    });

    delete = asyncHandler(async (req, res) => {
        const { idLoungeType, effectiveDate } = req.params;
        await priceService.delete(idLoungeType, effectiveDate);
        return res.status(200).json({ message: "Precio eliminado correctamente." });
    });

}

export default new PriceController();
