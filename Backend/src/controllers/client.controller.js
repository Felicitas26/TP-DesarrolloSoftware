import clientService from "../services/client.service.js";
import clientModel from "../models/client.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class ClientController {

    getAll = asyncHandler(async (req, res) => {
        const clients = await clientService.getAll();
        return res.status(200).json(clients);
    });

    getById = asyncHandler(async (req, res) => {
        const client = await clientService.getById(req.params.id);
        return res.status(200).json(client);
    });

    getMyProfile = asyncHandler(async (req, res) => {
        const client = await clientService.getById(req.usuario.idCli);
        return res.status(200).json(client);
    });

    updateMyProfile = asyncHandler(async (req, res) => {
        const clientUpdated = await clientService.updateMe(
            req.usuario.idCli,
            req.body
        );

        return res.status(200).json({
            message: "Perfil actualizado correctamente.",
            client: clientUpdated
        });
    });

    create = asyncHandler(async (req, res) => {
        const newClient = await clientService.create(req.body);
        return res.status(201).json(newClient);
    });

    update = asyncHandler(async (req, res) => {
        const clientUpdated = await clientService.update(req.params.id, req.body);
        return res.status(200).json({
            message: "Cliente actualizado correctamente.",
            client: clientUpdated
        });
    });

    delete = asyncHandler(async (req, res) => {
        await clientService.delete(req.params.id);
        return res.status(200).json({ message: "Cliente eliminado correctamente." });
    });

    checkEmail = asyncHandler(async (req, res) => {
        const { email } = req.query;

        if (!email) {
            const error = new Error("El parámetro email es requerido.");
            error.statusCode = 400;
            throw error;
        }

        const existing = await clientModel.findByEmail(email);
        return res.status(200).json({ available: !existing });
    });
}

export default new ClientController();