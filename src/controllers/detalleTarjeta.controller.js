import detalleTarjetaService from "../services/detalleTarjeta.service.js";

class DetalleTarjetaController {

    async getAll(req, res) {
        try {
            const detallesTarjeta = await detalleTarjetaService.getAll();

            return res.status(200).json(detallesTarjeta);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const detalleTarjeta = await detalleTarjetaService.getById(id);

            if (!detalleTarjeta) {
                return res.status(404).json({
                    error: `Detalle de Tarjeta con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(detalleTarjeta);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const { etapaMenu, detalle, presupuesto, idContrato } = req.body;

        try {

            if (!etapaMenu || !detalle || !presupuesto || !idContrato) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            if (typeof presupuesto !== "number" || presupuesto <= 0) {
                return res.status(400).json({
                    error: "El presupuesto debe ser un número positivo."
                });
            }

            const nuevoDetalleTarjeta =
                await detalleTarjetaService.create(req.body);

            return res.status(201).json(nuevoDetalleTarjeta);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params;

            const detalleTarjetaUpdated =
                await detalleTarjetaService.update(id, req.body);

            if (!detalleTarjetaUpdated) {
                return res.status(404).json({
                    error: "No se ha encontrado el detalle de Tarjeta buscado."
                });
            }

            return res.status(200).json({
                mensaje: "Detalle de Tarjeta actualizado correctamente.",
                detalleT: detalleTarjetaUpdated
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

            const detalleTarjetaDeleted =
                await detalleTarjetaService.delete(id);

            if (!detalleTarjetaDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado el detalle de Tarjeta."
                });
            }

            return res.status(200).json({
                mensaje: "Detalle de Tarjeta eliminado correctamente."
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

}

export default new DetalleTarjetaController();
