import clienteService from "../services/cliente.service.js";

class ClienteController {

    async getAll(req, res) {
        try { 
            const clientes = await clientesService.getAll();
            return res.status(200).json(clientes);
            }
        catch (error) {
            return res.status(500).json ({
                error: error.message
                });

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

export default new ClienteController();
