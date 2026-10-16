import loungeTypeService from "../services/loungeType.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class LoungeTypeController {

    getAll = asyncHandler(async (req, res) => {
        const list = await loungeTypeService.getAll();
        return res.status(200).json(list);
    });

    getById = asyncHandler(async (req, res) => {
        const loungeType = await loungeTypeService.getById(req.params.id);
        return res.status(200).json(loungeType);
    });

    create = asyncHandler(async (req, res) => {
        const newL = await loungeTypeService.create(req.body);
        return res.status(201).json(newL);
    });

    update = asyncHandler(async (req, res) => {
        const updated = await loungeTypeService.update(req.params.id, req.body);
        return res.status(200).json(updated);
    });

    delete = asyncHandler(async (req, res) => {
        await loungeTypeService.delete(req.params.id);
        return res.status(200).json({ message: "Tipo de salón eliminado correctamente." });
    });

}

export default new LoungeTypeController();
