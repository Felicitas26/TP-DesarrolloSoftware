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
       const { id }  = req.params;
        try {
            const cliente = await clienteService.getById(id);
            if (!cliente) {
                return res.status(404).json({ 
                    error: `Cliente con ID ${id} no encontrado.`
                       });
                 }
            return res.status(200).json(cliente);
        }
        catch (error) {
            return res.status(500).json ({
                error: error.message
                });
        }

    

    async create(req, res) {
        

    }

    async update(req, res) {

    }

    async delete(req, res) {

    }

}

export default new ClienteController();
