import detalleTarjetaService from "../services/detalleTarjeta.service.js";

class detalleTarjetaController {

    async getAll(req, res) {
        try {
            const detalleT = await detalleTarjetaService.getAll();
            return res.status(200).json(detalleT);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const detalleT = await detalleTarjetaService.getById(id);

            if (!detalleT) {
                return res.status(404).json({
                    error: `Detalle de Tarjeta con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(detalleT);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const { etapaMenu, detalle, presupuesto } = req.body;

        try {

            if (!etapaMenu || !detalle || !presupuesto) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            if (!/^\d+$/.test(presupuesto)) {
               return res.status(400).json({
                    error: "El presupuesto solo puede contener números."
                });
            }
            
            const nuevoDetalleTarjeta = await detalleTarjetaService.create(req.body);

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

            const detalleTarjetaUpdated = await detalleTarjetaService.update(id, req.body);

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

            const detalleTarjetaDeleted = await detalleTaretaService.delete(id);

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

export default new detalleTarjetaController();
