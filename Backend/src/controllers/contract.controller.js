import contractService from "../services/contract.service.js";

class ContractController {

    async getAll(req, res) {
        try {
            const contracts = await contractService.getAll();
            return res.status(200).json(contracts);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);
            return res.status(200).json(contract);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newContract = await contractService.create(req.body);
            return res.status(201).json(newContract);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const contractUpdated = await contractService.update(req.params.id, req.body);
            return res.status(200).json({
                message: "Contrato actualizado correctamente.",
                contract: contractUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await contractService.delete(req.params.id);
            return res.status(200).json({ message: "Contrato eliminado correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

}

export default new ContractController();
