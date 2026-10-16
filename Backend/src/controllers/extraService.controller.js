import extraServiceService from "../services/extraService.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class ExtraServiceController {

    getAll = asyncHandler(async (req, res) => {
        const extraServices = await extraServiceService.getAll();
        return res.status(200).json(extraServices);
    });

    getById = asyncHandler(async (req, res) => {
        const extraService = await extraServiceService.getById(req.params.id);
        return res.status(200).json(extraService);
    });

    create = asyncHandler(async (req, res) => {
        const newExtraService = await extraServiceService.create(req.body);
        return res.status(201).json(newExtraService);
    });

    update = asyncHandler(async (req, res) => {
        const extraServiceUpdated = await extraServiceService.update(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Servicio extra actualizado correctamente.",
            extraService: extraServiceUpdated
        });
    });

    delete = asyncHandler(async (req, res) => {
        await extraServiceService.delete(req.params.id);

        return res.status(200).json({
            message: "Servicio extra eliminado correctamente."
        });
    });
}

export default new ExtraServiceController();
