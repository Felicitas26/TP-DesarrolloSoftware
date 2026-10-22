import bcrypt from "bcryptjs";
import clientModel from "../../src/models/client.model.js";
import usuarioModel from "../../src/models/usuario.model.js";
import locationModel from "../../src/models/location.model.js";
import {
    requireFields,
    validateEmail,
    validateDni,
    validatePhone,
    validateName,
    validateAddress,
    validateId
} from "../../src/utils/validators.js";

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
        const data = await this.validateClientData(client, { checkEmailUnique: true, checkDniUnique: true });

        // El alta del cliente crea además su cuenta de usuario.
        const created = await clientModel.create({
            nameCli: data.nameCli,
            surnameCli: data.surnameCli,
            phoneCli: data.phoneCli,
            dniCli: data.dniCli,
            emailCli: data.emailCli,
            addressCli: data.addressCli,
            idLocation: data.idLocation
        });

        try {
            const existingUser = await usuarioModel.findByCli(created.idCli);
            if (!existingUser) {
                const username = client.username
                    ? String(client.username).trim()
                    : data.emailCli;
                const password = client.password || String(data.dniCli);
                const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
                await usuarioModel.create({
                    username,
                    password: passwordHash,
                    rol: "cliente",
                    idCli: created.idCli,
                    passwordTemporal: true
                });
            }
        } catch (err) {
            console.error("No se pudo crear la cuenta de usuario para el cliente:", err.message);
        }

        return created;
    }

    async update(id, client) {
        const clientId = validateId(id, "ID de cliente");
        const data = await this.validateClientData(client, {
            checkEmailUnique: true,
            checkDniUnique: true,
            excludeClientId: clientId
        });

        const updated = await clientModel.update(clientId, data);
        if (!updated) {
            throw { statusCode: 404, message: "No se ha encontrado al cliente." };
        }
        return updated;
    }

    async updateMe(idCli, client) {
        const clientId = validateId(idCli, "ID de cliente");
        const data = await this.validateClientData(client, {
            checkEmailUnique: true,
            checkDniUnique: true,
            excludeClientId: clientId
        });

        const updated = await clientModel.updateMe(clientId, data);

        if (!updated) {
            throw {
                statusCode: 404,
                message: "No se ha encontrado al cliente."
            };
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

    /**
     * Valida y normaliza los datos de un cliente.
     * @param {object} client
     * @param {{checkEmailUnique?: boolean, checkDniUnique?: boolean, excludeClientId?: number}} opts
     */
    async validateClientData(client, { checkEmailUnique = false, checkDniUnique = false, excludeClientId = null } = {}) {
        requireFields(client, [
            "nameCli",
            "surnameCli",
            "phoneCli",
            "dniCli",
            "emailCli",
            "addressCli",
            "idLocation"
        ]);

        const nameCli = validateName(client.nameCli, "nombre");
        const surnameCli = validateName(client.surnameCli, "apellido");
        const phoneCli = validatePhone(client.phoneCli);
        const dniCli = validateDni(client.dniCli);
        const emailCli = validateEmail(client.emailCli);
        const addressCli = validateAddress(client.addressCli);
        const idLocation = validateId(client.idLocation, "ID de ubicación");

        const location = await locationModel.findByPk(idLocation);
        if (!location) {
            throw {
                statusCode: 400,
                message: "La ubicación seleccionada no existe."
            };
        }

        if (checkEmailUnique) {
            const existingEmail = await clientModel.findByEmail(emailCli);
            if (existingEmail && existingEmail.idCli !== excludeClientId) {
                throw { statusCode: 409, message: "El email ingresado ya está registrado por otro cliente." };
            }
        }

        if (checkDniUnique) {
            const existingDni = await clientModel.findByDni(dniCli);
            if (existingDni && existingDni.idCli !== excludeClientId) {
                throw { statusCode: 409, message: "El DNI ingresado ya está registrado por otro cliente." };
            }
        }

        return {
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            idLocation
        };
    }
}

export default new ClientService();
