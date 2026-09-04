import clientService from "../services/client.service.js";

class ClientController {

    async getAll(req, res) {
        try {
            const clients = await clientService.getAll();
            return res.status(200).json(clients);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const client = await clientService.getById(req.params.id);
            return res.status(200).json(client);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getMyProfile(req, res) {
        try {
            const client = await clientService.getById(req.usuario.idCli);
            return res.status(200).json(client);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateMyProfile(req, res) {
        try {
            const clientUpdated = await clientService.updateMe(
                req.usuario.idCli,
                req.body
            );

            return res.status(200).json({
                message: "Perfil actualizado correctamente.",
                client: clientUpdated
            });

        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const newClient = await clientService.create(req.body);
            return res.status(201).json(newClient);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const clientUpdated = await clientService.update(req.params.id, req.body);
            return res.status(200).json({
                message: "Cliente actualizado correctamente.",
                client: clientUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await clientService.delete(req.params.id);
            return res.status(200).json({ message: "Cliente eliminado correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new ClientController();
