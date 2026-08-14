import contractService from "../services/contract.service.js";

class ContractController {

    async getAll(req, res) {
        try {
            const contracts = await contractService.getAll();
            return res.status(200).json(contracts);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const contract = await contractService.getById(id);

            if (!contract) {
                return res.status(404).json({
                    error: `Contrato con ID ${id} no encontrado.`
                });
            }

            return res.status(200).json(contract);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        const {
            eventStartTime,
            eventEndTime
        } = req.body;

        try {

            if (!eventStartTime || !eventEndTime) {
                return res.status(400).json({
                    error: "Todos los campos son obligatorios."
                });
            }

            const newContract = await contractService.create(req.body);

            return res.status(201).json(newContract);

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {

            const { id } = req.params;

            const contractUpdated = await contractService.update(id, req.body);

            if (!contractUpdated) {
                return res.status(404).json({
                    error: "No se ha encontrado el contrato."
                });
            }

            return res.status(200).json({
                message: "Contrato actualizado correctamente.",
                contract: contractUpdated
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

            const contractDeleted = await contractService.delete(id);

            if (!contractDeleted) {
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

export default new ContractController();
