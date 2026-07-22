import servicioExtraService from "../services/servicioExtra.service.js";

class ServicioExtraController {

    async getAll(req, res) {
        try {
            const serviciosExtra = await servicioExtraService.getAll();

            return res.status(200).json(serviciosExtra);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const servicioExtra = await servicioExtraService.getById(id);

            if (!servicioExtra) {
                return res.status(404).json({
                    error: `Servicio Extra con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(servicioExtra);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const { nombreServicio, detalleServicio, costo } = req.body;

        try {

            if (!nombreServicio || !detalleServicio || !costo) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            if (typeof costo !== "number" || costo < 0) {
                return res.status(400).json({
                    error: "El costo solo puede contener números."
                });
            }

            const nuevoServicioExtra =
                await servicioExtraService.create(req.body);

            return res.status(201).json(nuevoServicioExtra);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params;

            const servicioExtraUpdated =
                await servicioExtraService.update(id, req.body);

            if (!servicioExtraUpdated) {
                return res.status(404).json({
                    error: "No se ha encontrado el Servicio Extra buscado."
                });
            }

            return res.status(200).json({
                mensaje: "Servicio Extra actualizado correctamente.",
                servicioExtra: servicioExtraUpdated
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

            const servicioExtraDeleted =
                await servicioExtraService.delete(id);

            if (!servicioExtraDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado el Servicio Extra."
                });
            }

            return res.status(200).json({
                mensaje: "Servicio Extra eliminado correctamente."
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

}

export default new ServicioExtraController();
