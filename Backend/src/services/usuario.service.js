import bcrypt from "bcryptjs";
import usuarioModel from "../models/usuario.model.js";

const SALT_ROUNDS = 10;

class UsuarioService {

    async getPerfil(idUsuario) {
        const usuario = await usuarioModel.findById(idUsuario);
        if (!usuario) {
            throw { statusCode: 404, message: "Usuario no encontrado." };
        }
        const { password, ...perfil } = usuario;
        return perfil;
    }

    async registerCliente({ dniCli, passwordNueva }) {
        if (!dniCli || !passwordNueva) {
            throw { statusCode: 400, message: "El DNI y la contraseña son obligatorios." };
        }

        const client = await usuarioModel.findByDni(dniCli);
        if (!client) {
            throw {
                statusCode: 404,
                message: "No se encontró una correspondencia para este DNI. Verificá que tus datos estén registrados."
            };
        }

        const existing = await usuarioModel.findByCli(client.idCli);
        if (existing) {
            throw {
                statusCode: 409,
                message: "Este DNI ya posee una cuenta. Iniciá sesión con tu email."
            };
        }

        const email = client.emailCli;
        const usernameExists = await usuarioModel.findByUsername(email);
        if (usernameExists) {
            throw {
                statusCode: 409,
                message: "Ya existe una cuenta con este email."
            };
        }

        const passwordHash = await bcrypt.hash(passwordNueva, SALT_ROUNDS);

        return usuarioModel.create({
            username: email,
            password: passwordHash,
            rol: "cliente",
            idCli: client.idCli,
            passwordTemporal: 0
        });
    }

    async registerClienteAdmin({ idCli, passwordProvisoria }) {
        const usuario = await usuarioModel.findByCli(idCli);
        if (usuario) {
            throw {
                statusCode: 409,
                message: "Este cliente ya posee una cuenta de usuario."
            };
        }

        const passwordHash = await bcrypt.hash(passwordProvisoria, SALT_ROUNDS);

        return usuarioModel.create({
            username: null,
            password: passwordHash,
            rol: "cliente",
            idCli,
            passwordTemporal: 1
        });
    }

    async cambiarPassword(idUsuario, { passwordActual, passwordNueva }) {
        if (!passwordActual || !passwordNueva) {
            throw { statusCode: 400, message: "Debe ingresar la contraseña actual y la nueva." };
        }

        const usuario = await usuarioModel.findById(idUsuario);
        if (!usuario) {
            throw { statusCode: 404, message: "Usuario no encontrado." };
        }

        const match = await bcrypt.compare(passwordActual, usuario.password);
        if (!match) {
            throw { statusCode: 400, message: "La contraseña actual es incorrecta." };
        }

        const passwordHash = await bcrypt.hash(passwordNueva, SALT_ROUNDS);
        const updated = await usuarioModel.updatePassword(idUsuario, passwordHash);
        const { password, ...perfil } = updated;
        return perfil;
    }

    async darDeBaja(idUsuario) {
        const deleted = await usuarioModel.delete(idUsuario);
        if (!deleted) {
            throw { statusCode: 404, message: "No se ha encontrado la cuenta." };
        }
        return deleted;
    }
}

export default new UsuarioService();
