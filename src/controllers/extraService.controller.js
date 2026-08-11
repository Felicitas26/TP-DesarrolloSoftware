import extraService from "../services/extraService.service.js";

class extraServiceController {

    async getAll(req, res) {
        try {
            const extraService = await extraServiceService.getAll();

            return res.status(200).json(extraService);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const extraService = await extraServiceService.getById(id);

            if (!extraService) {
                return res.status(404).json({
                    error: `Servicio Extra con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(extraService);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const { nameService, detailService, cost } = req.body;

        try {

            if (!nameService || !detailService || !cost) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            if (typeof cost !== "number" || cost < 0) {
                return res.status(400).json({
                    error: "El costo solo puede contener números."
                });
            }

            const newextraService =
                await extraServiceService.create(req.body);

            return res.status(201).json(newextraService);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params;

            const extraServiceUpdated =
                await extraServiceService.update(id, req.body);

            if (!extraServiceUpdated) {
                return res.status(404).json({
                    error: "No se ha encontrado el Servicio Extra buscado."
                });
            }

            return res.status(200).json({
                message: "Servicio Extra actualizado correctamente.",
                extraService: extraServiceUpdated
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {

            const { id } = req.params;

            const extraServiceDeleted =
                await extraServiceService.delete(id);

            if (!extraServiceDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado el Servicio Extra."
                });
            }

            return res.status(200).json({
                message: "Servicio Extra eliminado correctamente."
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

}

export default new extraServiceController();
