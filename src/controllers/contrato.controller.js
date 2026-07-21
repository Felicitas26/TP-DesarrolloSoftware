import contratoService from "../services/contrato.service.js";

class ContratoController {

    async getAll(req, res) {
        try { 
            const contratos = await contratoService.getAll();
            return res.status(200).json(contratos);
        }
        
        catch (error) {
            return res.status(500).json({
            error: error.message
        });

        }

    }

    async getById(req, res) {

    }

    async create(req, res) {

    }

    async update(req, res) {

    }

    async delete(req, res) {

    }

}

export default new ContratoController();
