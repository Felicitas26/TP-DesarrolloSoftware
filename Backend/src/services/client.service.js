import bcrypt from "bcryptjs";
import clientModel from "../../src/models/client.model.js";
import usuarioModel from "../../src/models/usuario.model.js";

const SALT_ROUNDS = 10;

class ClientService {

    async getAll() {
        return await clientModel.getAll();
    }

    async getById(id) {
        const client = await clientModel.getById(id);
        if (!client) {
            throw { statusCode: 404, message: `Cliente con ID ${id} no encontrado.` };
        }
        return client;
    }

    async create(client) {
        const { nameCli, surnameCli, phoneCli, dniCli, emailCli, addressCli, idLocation } = client;

        if (!nameCli || !surnameCli || !phoneCli || !dniCli || !emailCli || !addressCli || idLocation == undefined || idLocation === "") {
            throw { statusCode: 400, message: "Todos los campos son obligatorios." };
        }

        if (!/^\d+$/.test(dniCli)) {
            throw { statusCode: 400, message: "El DNI solo puede contener números." };
        }

        if (dniCli.length < 7 || dniCli.length > 9) {
            throw { statusCode: 400, message: "El DNI debe tener entre 7 y 9 dígitos numéricos." };
        }

        if (!/^\d+$/.test(phoneCli)) {
            throw { statusCode: 400, message: "El teléfono solo puede contener números." };
        }

        const created = await clientModel.create(client);

        try {
            const existingUser = await usuarioModel.findByCli(created.idCli);
            if (!existingUser) {
                const username = client.username || emailCli;
                const password = client.password || String(dniCli);
                const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
                await usuarioModel.create({
                    username,
                    password: passwordHash,
                    rol: "cliente",
                    idCli: created.idCli,
                    passwordTemporal: 1
                });
            }
        } catch (err) {
            console.error("No se pudo crear la cuenta de usuario para el cliente:", err.message);
        }

        return created;
    }

    async update(id, client) {
        const { nameCli, surnameCli, phoneCli, dniCli, emailCli, addressCli, idLocation } = client;

        if (!nameCli || !surnameCli || !phoneCli || !dniCli || !emailCli || !addressCli || idLocation == undefined || idLocation === "") {
            throw { statusCode: 400, message: "Todos los campos son obligatorios." };
        }

        if (!/^\d+$/.test(dniCli)) {
            throw { statusCode: 400, message: "El DNI solo puede contener números." };
        }

        if (dniCli.length < 7 || dniCli.length > 9) {
            throw { statusCode: 400, message: "El DNI debe tener entre 7 y 9 dígitos numéricos." };
        }

        if (!/^\d+$/.test(phoneCli)) {
            throw { statusCode: 400, message: "El teléfono solo puede contener números." };
        }

        const updated = await clientModel.update(id, client);
        if (!updated) {
            throw { statusCode: 404, message: "No se ha encontrado al cliente." };
        }
        return updated;
    }

    async delete(id) {
        const deleted = await clientModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: "No se ha encontrado al cliente." };
        }
        return deleted;
    }
}

export default new ClientService();

