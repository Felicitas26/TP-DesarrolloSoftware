import bcrypt from "bcryptjs";
import usuarioModel from "../models/usuario.model.js";
import clientModel from "../models/client.model.js";
import {
    validatePassword,
    validateUsername,
    validateDni,
    validateEmail,
    validateName,
    validatePhone,
    validateAddress,
    validateId
} from "../utils/validators.js";

const SALT_ROUNDS = 10;

class UsuarioService {

    async getPerfil(idUsuario) {
        const usuario = await usuarioModel.findById(idUsuario);

        if (!usuario) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado."
            };
        }

        const { password, ...perfil } = usuario;

        return perfil;
    }

    async registerCliente({ dniCli, passwordNueva }) {
        const dni = validateDni(dniCli);
        const password = validatePassword(passwordNueva);

        const client = await usuarioModel.findByDni(dni);

        if (!client) {
            throw {
                statusCode: 404,
                message: "No se encontró una correspondencia para este DNI. Verificá que tus datos estén registrados."
            };
        }

        const existing = await usuarioModel.findByCli(client.idCli);

        if (existing) {
            if (!existing.activo) {
                throw {
                    statusCode: 409,
                    message: "Este DNI ya posee una cuenta que fue dada de baja. Contactá a la administración."
                };
            }
            throw {
                statusCode: 409,
                message: "Este DNI ya posee una cuenta. Iniciá sesión con tu email."
            };
        }

        const email = client.emailCli;

        const usernameExists =
            await usuarioModel.findByUsername(email);

        if (usernameExists) {
            throw {
                statusCode: 409,
                message: "Ya existe una cuenta con este email."
            };
        }

        const passwordHash =
            await bcrypt.hash(passwordNueva, SALT_ROUNDS);

        return usuarioModel.create({
            username: email,
            password: passwordHash,
            rol: "cliente",
            idCli: client.idCli,
            passwordTemporal: false
        });
    }

    async registerClienteAdmin({ idCli, passwordProvisoria }) {
        const password = validatePassword(passwordProvisoria);

        const usuario = await usuarioModel.findByCli(idCli);

        if (usuario) {
            throw {
                statusCode: 409,
                message: "Este cliente ya posee una cuenta de usuario."
            };
        }

        const passwordHash =
            await bcrypt.hash(password, SALT_ROUNDS);

        return usuarioModel.create({
            username: null,
            password: passwordHash,
            rol: "cliente",
            idCli,
            passwordTemporal: true
        });
    }

    async resetPassword({ email, passwordNueva }) {
        const emailNormalizado = validateEmail(email);
        const password = validatePassword(passwordNueva);

        const usuario = await usuarioModel.findByEmail(emailNormalizado);

        if (!usuario) {
            throw {
                statusCode: 404,
                message: "No existe una cuenta asociada a ese email."
            };
        }

        const passwordHash =
            await bcrypt.hash(password, SALT_ROUNDS);

        await usuarioModel.updatePassword(
            usuario.idUsuario,
            passwordHash
        );

        return { message: "Contraseña restablecida con éxito." };
    }

    async cambiarPassword(idUsuario, { passwordActual, passwordNueva }) {
        if (!passwordActual) {
            throw {
                statusCode: 400,
                message: "Debe ingresar la contraseña actual."
            };
        }

        const nuevaPassword = validatePassword(passwordNueva);

        const usuario = await usuarioModel.findById(idUsuario);

        if (!usuario) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado."
            };
        }

        const match =
            await bcrypt.compare(passwordActual, usuario.password);

        if (!match) {
            throw {
                statusCode: 400,
                message: "La contraseña actual es incorrecta."
            };
        }

        if (passwordActual === nuevaPassword) {
            throw {
                statusCode: 400,
                message: "La nueva contraseña debe ser diferente a la actual."
            };
        }

        const passwordHash =
            await bcrypt.hash(nuevaPassword, SALT_ROUNDS);

        const updated =
            await usuarioModel.updatePassword(
                idUsuario,
                passwordHash
            );

        const { password, ...perfil } = updated;

        return perfil;
    }

    async darDeBaja(idUsuario) {
        const deleted =
            await usuarioModel.delete(idUsuario);

        if (!deleted) {
            throw {
                statusCode: 404,
                message: "No se ha encontrado la cuenta."
            };
        }

        return deleted;
    }

    // ADMINISTRADORES

    async getAllAdministradores() {
        return await usuarioModel.getAllAdministradores();
    }

    // ============================== DESACTIVADOS / REACTIVACIÓN

    async getDesactivados() {
        return usuarioModel.getDesactivados();
    }

    async reactivarUsuario(id) {
        const usuario = await usuarioModel.findById(id);

        if (!usuario) {
            throw {
                statusCode: 404,
                message: "Usuario no encontrado."
            };
        }

        if (usuario.activo) {
            throw {
                statusCode: 409,
                message: "La cuenta ya está activa."
            };
        }

        // Guardas: no reactivar si otra cuenta activa pisa sus datos de acceso.
        if (usuario.username) {
            const existente =
                await usuarioModel.findByUsername(usuario.username);

            if (
                existente &&
                existente.idUsuario !== usuario.idUsuario &&
                existente.activo
            ) {
                throw {
                    statusCode: 409,
                    message: "Ya existe una cuenta activa con ese usuario."
                };
            }
        }

        if (usuario.idCli && usuario.client) {
            const existenteDni = await clientModel.findByDni(
                usuario.client.dniCli
            );

            if (
                existenteDni &&
                existenteDni.activo &&
                existenteDni.idCli !== usuario.idCli
            ) {
                throw {
                    statusCode: 409,
                    message: "Ya existe una cuenta activa con ese DNI."
                };
            }

            const existenteEmail = await clientModel.findByEmail(
                usuario.client.emailCli
            );

            if (
                existenteEmail &&
                existenteEmail.activo &&
                existenteEmail.idCli !== usuario.idCli
            ) {
                throw {
                    statusCode: 409,
                    message: "Ya existe una cuenta activa con ese email."
                };
            }
        }

        await usuarioModel.reactivate(usuario.idUsuario);

        if (usuario.idCli) {
            await clientModel.reactivate(usuario.idCli, {});
        }

        return usuarioModel.findById(usuario.idUsuario);
    }

    // ============================== DATOS PERSONALES (todos los usuarios)

    async validarDatosPersona(body, { excludeClientId = null } = {}) {
        const nombre = validateName(body.nameCli, "nombre");
        const apellido = validateName(body.surnameCli, "apellido");
        const telefono = validatePhone(body.phoneCli);
        const dni = validateDni(body.dniCli);
        const email = validateEmail(body.emailCli);
        const direccion = validateAddress(body.addressCli);
        const idLocation = validateId(body.idLocation, "localidad");

        const existenteDni = await clientModel.findByDni(dni);
        if (
            existenteDni &&
            existenteDni.activo &&
            existenteDni.idCli !== excludeClientId
        ) {
            throw {
                statusCode: 409,
                message: "Ya existe una cuenta registrada con ese DNI."
            };
        }

        const existenteEmail = await clientModel.findByEmail(email);
        if (
            existenteEmail &&
            existenteEmail.activo &&
            existenteEmail.idCli !== excludeClientId
        ) {
            throw {
                statusCode: 409,
                message: "Ya existe una cuenta registrada con ese email."
            };
        }

        return {
            nameCli: nombre,
            surnameCli: apellido,
            phoneCli: telefono,
            dniCli: dni,
            emailCli: email,
            addressCli: direccion,
            idLocation
        };
    }

    async createAdministrador(body) {
        const { username, password } = body;

        const usuario = validateUsername(username);
        const passwordValida = validatePassword(password);

        const persona = await this.validarDatosPersona(body);

        const existing =
            await usuarioModel.findByUsername(usuario);

        if (existing) {
            if (existing.rol === "administrador" && !existing.activo) {
                const passwordHash =
                    await bcrypt.hash(passwordValida, SALT_ROUNDS);
                await usuarioModel.updateAdministrador(
                    existing.idUsuario,
                    { username: usuario, password: passwordHash }
                );
                await usuarioModel.reactivate(existing.idUsuario);
                const reactivated = await usuarioModel.findById(existing.idUsuario);
                const { password: _, ...perfil } = reactivated;
                return perfil;
            }
            throw {
                statusCode: 409,
                message: "Ya existe un usuario con ese nombre."
            };
        }

        // Datos personales de la persona: se guardan como registro de Client
        // vinculado, para que toda cuenta tenga sus datos completos.
        const clientCreado = await clientModel.create(persona);

        try {
            const passwordHash =
                await bcrypt.hash(passwordValida, SALT_ROUNDS);

            const creado = await usuarioModel.create({
                username: usuario,
                password: passwordHash,
                rol: "administrador",
                idCli: clientCreado.idCli,
                passwordTemporal: false
            });

            const { password: _, ...perfil } = creado;
            return perfil;
        } catch (err) {
            await clientModel.delete(clientCreado.idCli);
            throw {
                statusCode: 409,
                message: "No se pudo crear la cuenta de administrador. Verificá los datos e intentá nuevamente."
            };
        }
    }

    async updateAdministrador(id, body) {
        const { username, password } = body;

        const usuario = validateUsername(username);
        const passwordValida = validatePassword(password, { required: false });

        const administrador =
            await usuarioModel.findById(id);

        if (
            !administrador ||
            administrador.rol !== "administrador"
        ) {
            throw {
                statusCode: 404,
                message: "Administrador no encontrado."
            };
        }

        const existing =
            await usuarioModel.findByUsername(usuario);

        if (
            existing &&
            existing.idUsuario !== Number(id)
        ) {
            throw {
                statusCode: 409,
                message: "Ya existe un usuario con ese nombre."
            };
        }

        const persona = await this.validarDatosPersona(body, {
            excludeClientId: administrador.idCli
        });

        let passwordHash = null;

        if (passwordValida) {
            passwordHash =
                await bcrypt.hash(passwordValida, SALT_ROUNDS);
        }

        const updated =
            await usuarioModel.updateAdministrador(
                id,
                {
                    username: usuario,
                    password: passwordHash
                }
            );

        // Datos personales: se actualizan los de la Client vinculada y,
        // si la cuenta no tenía, se le crea y se vincula.
        if (administrador.idCli) {
            await clientModel.update(administrador.idCli, persona);
        } else {
            const clientCreado = await clientModel.create(persona);
            await usuarioModel.setIdCli(administrador.idUsuario, clientCreado.idCli);
        }

        const { password: _, ...perfil } = updated;

        return perfil;
    }

    async deleteAdministrador(id) {

        const administrador =
            await usuarioModel.findById(id);

        if (
            !administrador ||
            administrador.rol !== "administrador"
        ) {
            throw {
                statusCode: 404,
                message: "Administrador no encontrado."
            };
        }

        // La cuenta raíz "admin" es el usuario principal del sistema: no se elimina.
        if (administrador.username === "admin") {
            throw {
                statusCode: 409,
                message: "La cuenta principal del sistema no puede ser eliminada."
            };
        }

        const deleted =
            await usuarioModel.delete(id);

        if (!deleted) {
            throw {
                statusCode: 404,
                message: "Administrador no encontrado."
            };
        }

        // Se da de baja también los datos personales de la persona.
        if (administrador.idCli) {
            await clientModel.delete(administrador.idCli);
        }

        return deleted;
    }
}

export default new UsuarioService();
