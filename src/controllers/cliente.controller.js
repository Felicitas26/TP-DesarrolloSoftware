import clienteService from "../services/cliente.service.js";

class ClienteController {

    async getAll(req, res) {
        try { 
            const clientes = await clienteService.getAll();
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
        
        const {
            nombreCli, apellidoCli, telefonoCli, dniCli, emailCli, direccionCli, localidadCli } = req.body;
        
        const nuevoCliente = await clienteService.create(req.body);
        
        if ( !nombreCli || !apellidoCli || !telefonoCli || !dniCli || !emailCli || !direccionCli || !localidadCli) {
            return res.status(400).json ({
                error: "Todos los campos son obligatorios."
            });
            }
       
        if (!/^\d+$/.test(dniCli)) {
           return res.status(400).json({
                error: "El DNI solo puede contener números."
            });
        }
       
        if (!/^\d+$/.test(telefonoCli)) {
           return res.status(400).json({
               error: "El teléfono solo puede contener números."
            });
        }
        
        return res.status(200).json(nuevoCliente);
    }

    async update(req, res) {

    }

    async delete(req, res) {

    }

}

export default new ClienteController();
