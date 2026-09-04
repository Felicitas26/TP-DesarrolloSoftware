import contratoService from "../services/contrato.service.js";

class ContratoController {

    async getAll(req, res) {
        try {
            const contratos = await contratoService.getAll();
            return res.status(200).json(contratos);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const contrato = await contratoService.getById(req.params.id);
            return res.status(200).json(contrato);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newContrato = await contratoService.create(req.body);
            return res.status(201).json(newContrato);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const contratoUpdated = await contratoService.update(req.params.id, req.body);
            return res.status(200).json({
                message: "Contrato actualizado correctamente.",
                contrato: contratoUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await contratoService.delete(req.params.id);
            return res.status(200).json({ message: "Contrato eliminado correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new ContratoController();
