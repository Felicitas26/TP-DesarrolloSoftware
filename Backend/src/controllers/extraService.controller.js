import extraServiceService from "../services/extraService.service.js";

class ExtraServiceController {

    async getAll(req, res) {
        try {
            const extraServices = await extraServiceService.getAll();
            return res.status(200).json(extraServices);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const extraService = await extraServiceService.getById(req.params.id);
            return res.status(200).json(extraService);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const newExtraService = await extraServiceService.create(req.body);
            return res.status(201).json(newExtraService);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const extraServiceUpdated = await extraServiceService.update(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                message: "Servicio extra actualizado correctamente.",
                extraService: extraServiceUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            await extraServiceService.delete(req.params.id);

            return res.status(200).json({
                message: "Servicio extra eliminado correctamente."
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }
}

export default new ExtraServiceController();
