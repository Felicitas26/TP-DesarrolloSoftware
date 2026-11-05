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
        const dniValue = validateDni(client.dniCli);
        const existingByDni = await clientModel.findByDni(dniValue);
        if (existingByDni && !existingByDni.activo) {
            const data = await this.validateClientData(client, {
                checkEmailUnique: true,
                checkDniUnique: true,
                excludeClientId: existingByDni.idCli
            });
            return await this.reactivar(existingByDni, data);
        }

        const data = await this.validateClientData(client, { checkEmailUnique: true, checkDniUnique: true });

        const username = client.username
            ? String(client.username).trim()
            : data.emailCli;
        const password = client.password || String(data.dniCli);
        const passwordTemporal = client.passwordTemporal !== false;

        const usernameExists = await usuarioModel.findByUsername(username);
        if (usernameExists) {
            throw {
                statusCode: 409,
                message: "Ya existe una cuenta con ese usuario/email. Iniciá sesión."
            };
        }

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
                const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
                await usuarioModel.create({
                    username,
                    password: passwordHash,
                    rol: "cliente",
                    idCli: created.idCli,
                    passwordTemporal
                });
            }
        } catch (err) {
            await clientModel.delete(created.idCli);
            console.error("No se pudo crear la cuenta de usuario para el cliente:", err.message);
            throw {
                statusCode: 409,
                message: "No se pudo crear la cuenta de usuario. Verificá los datos e intentá nuevamente."
            };
        }

        return created;
    }

    async reactivar(client, data) {
        const linkedUser = await usuarioModel.findByCli(client.idCli);

        if (linkedUser) {
            if (linkedUser.username && linkedUser.username !== data.emailCli) {
                const usernameTaken = await usuarioModel.findByUsername(data.emailCli);
                if (usernameTaken && usernameTaken.idUsuario !== linkedUser.idUsuario) {
                    throw {
                        statusCode: 409,
                        message: "El email ingresado corresponde a otra cuenta de usuario. Contactá a la administración."
                    };
                }
            }
            if (!linkedUser.activo) {
                await usuarioModel.reactivate(linkedUser.idUsuario);
            }
        }

        const reactivated = await clientModel.reactivate(client.idCli, data);
        if (!reactivated) {
            throw { statusCode: 500, message: "No se pudo reactivar al cliente." };
        }
        return await clientModel.getById(client.idCli);
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
        const client = await clientModel.getById(id);
        if (!client) {
            throw { statusCode: 404, message: "No se ha encontrado al cliente." };
        }

        const linkedUser = await usuarioModel.findByCli(Number(id));
        if (linkedUser) {
            await usuarioModel.delete(linkedUser.idUsuario);
        }

        const deleted = await clientModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: "No se ha encontrado al cliente." };
        }
        return deleted;
    }

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
