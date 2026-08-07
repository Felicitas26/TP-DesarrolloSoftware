import agreementService from "../services/agreement.service.js";

class AgreementController {

    async getAll(req, res) {
        try {
            const agreements = await agreementService.getAll();
            return res.status(200).json(agreements);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const agreement = await agreementService.getById(id);

            if (!agreement) {
                return res.status(404).json({
                    error: `Contrato con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(agreement);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const {
            EventStartTime,
            EventEndTime
        } = req.body;

        try {

            if (!EventStartTime || !EventEndTime) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            const newAgreement = await agreementService.create(req.body);

            return res.status(201).json(newAgreement);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params;

            const agreementUpdated = await agreementService.update(id, req.body);

            if (!agreementUpdated) {
                return res.status(404).json({
                    error: "No se ha encontrado el contrato."
                });
            }

            return res.status(200).json({
                message: "Contrato actualizado correctamente.",
                agreement: agreementUpdated
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

            const agreementDeleted = await agreementService.delete(id);

            if (!agreementDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado el contrato."
                });
            }

            return res.status(200).json({
                message: "Contrato eliminado correctamente."
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

}

export default new AgreementController();
