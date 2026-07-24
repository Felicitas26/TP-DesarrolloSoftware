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
    }
    
    async create(req, res) {
        const {
            nombreCli, apellidoCli, telefonoCli, dniCli, emailCli, direccionCli, localidadCli } = req.body;

        try {
        
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
            
            const nuevoCliente = await clienteService.create(req.body);
            return res.status(201).json(nuevoCliente);
            }
        
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });

    }

    async update(req, res) {

        try {
            const { id } = req.params;
            const clienteUpdated = await clienteService.update(id, req.body);
           
            if (!clienteUpdated) {
                return res.status(404).json({
                   error: "No se ha encontrado al cliente."
                });

            }
            return res.status(200).json({
                mensaje: "Cliente actualizado correctamente.",
                cliente: clienteUpdated
        });
        }
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });
    }

    async delete(req, res) {
        try {

            const { id } = req.params;
            const clienteDeleted = await clienteService.delete(id);
    
            if (!clienteDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado al cliente."
                });
        }

        return res.status(200).json({
            mensaje: "Cliente eliminado correctamente."
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    }

}

export default new ClienteController();
