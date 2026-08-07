import clientService from "../services/client.service.js";

class ClientController {

    async getAll(req, res) {
        try { 
            const client = await clientService.getAll();
            return res.status(200).json(clients);
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
            const cient = await clientService.getById(id);
            if (!client) {
                return res.status(404).json({ 
                    error: `Cliente con ID ${id} no encontrado.`
                       });
                 }
            return res.status(200).json(client);
        }
        catch (error) {
            return res.status(500).json ({
                error: error.message
                });
        }
    }
    
    async create(req, res) {
        const {
            nameCli, lastNameCli, phoneCli, dniCli, emailCli, addressCli, localityCli } = req.body;

        try {
        
            if ( !nameCli || !lastNameCli || !phoneCli || !dniCli || !emailCli || !addressCli || !localityCli) {
                return res.status(400).json ({
                    error: "Todos los campos son obligatorios."
                });
                }
           
            if (!/^\d+$/.test(dniCli)) {
               return res.status(400).json({
                    error: "El DNI solo puede contener números."
                });
            }
           
            if (!/^\d+$/.test(phoneCli)) {
               return res.status(400).json({
                   error: "El teléfono solo puede contener números."
                });
            }
            
            const newClient = await clientService.create(req.body);
            return res.status(201).json(newClient);
            }
        
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });

    }
}
    async update(req, res) {

        try {
            const { id } = req.params;
            const clientUpdated = await clientService.update(id, req.body);
           
            if (!clientUpdated) {
                return res.status(404).json({
                   error: "No se ha encontrado al cliente."
                });
            }
            return res.status(200).json({
                message: "Cliente actualizado correctamente.",
                client: clientUpdated
        });
        }
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });
    }
}
    async delete(req, res) {
        try {

            const { id } = req.params;
            const clientDeleted = await clientService.delete(id);
    
            if (!clientDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado al cliente."
                });
        }

        return res.status(200).json({
            message: "Cliente eliminado correctamente."
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    }

}

export default new ClientController();
