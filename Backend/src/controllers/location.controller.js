import locationService from "../services/location.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class LocationController {

    getAll = asyncHandler(async (req, res) => {
        const list = await locationService.getAll();
        return res.status(200).json(list);
    });

    getById = asyncHandler(async (req, res) => {
        const location = await locationService.getById(req.params.id);
        return res.status(200).json(location);
    });

    create = asyncHandler(async (req, res) => {
        const newLocation = await locationService.create(req.body);
        return res.status(201).json(newLocation);
    });

    update = asyncHandler(async (req, res) => {
        const updatedLocation = await locationService.update(req.params.id, req.body);
        return res.status(200).json(updatedLocation);
    });

    delete = asyncHandler(async (req, res) => {
        await locationService.delete(req.params.id);
        return res.status(200).json({ message: "Ubicación eliminada exitosamente." });
    });

}

export default new LocationController();
