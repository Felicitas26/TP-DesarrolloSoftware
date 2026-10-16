import loungeService from "../services/lounge.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class LoungeController {

    getAll = asyncHandler(async (req, res) => {
        const list = await loungeService.getAll();
        return res.status(200).json(list);
    });

    getById = asyncHandler(async (req, res) => {
        const lounge = await loungeService.getById(req.params.id);
        return res.status(200).json(lounge);
    });

    create = asyncHandler(async (req, res) => {
        const newLounge = await loungeService.create(req.body);
        return res.status(201).json(newLounge);
    });

    update = asyncHandler(async (req, res) => {
        const updatedLounge = await loungeService.update(req.params.id, req.body);
        return res.status(200).json(updatedLounge);
    });

    delete = asyncHandler(async (req, res) => {
        await loungeService.delete(req.params.id);
        return res.status(200).json({ message: "Salón eliminado exitosamente." });
    });

}

export default new LoungeController();
