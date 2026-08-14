import cardDetailService from "../services/cardDetail.service.js";

class cardDetailController {

    async getAll(req, res) {
        try {
            const cardDetail = await cardDetailService.getAll();

            return res.status(200).json(cardDetail);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const cardDetail = await cardDetailService.getById(id);

            if (!cardDetail) {
                return res.status(404).json({
                    error: `Detalle de Tarjeta con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(cardDetail);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const { MenuStage, detail, budget, idAgreement } = req.body;

        try {

            if (!MenuStage || !detail || !budget || !idAgreement) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            if (typeof budget !== "number" || budget <= 0) {
                return res.status(400).json({
                    error: "El presupuesto debe ser un número positivo."
                });
            }

            const newcardDetail =
                await cardDetailService.create(req.body);

            return res.status(201).json(newcardDetail);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params;

            const cardDetailUpdated =
                await cardDetailService.update(id, req.body);

            if (!cardDetailUpdated) {
                return res.status(404).json({
                    error: "No se ha encontrado el detalle de Tarjeta buscado."
                });
            }

            return res.status(200).json({
                message: "Detalle de Tarjeta actualizado correctamente.",
                datailC: cardDetailUpdated
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

            const cardDetailDeleted =
                await cardDetailService.delete(id);

            if (!cardDetailDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado el detalle de Tarjeta."
                });
            }

            return res.status(200).json({
                message: "Detalle de Tarjeta eliminado correctamente."
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

}

export default new cardDetailController();
