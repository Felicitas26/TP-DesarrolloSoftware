import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

class UsuarioModel {

    async findById(id) {
        return await prisma.usuario.findUnique({
            where: { idUsuario: Number(id) },
            include: {
                client: {
                    select: {
                        nameCli: true,
                        surnameCli: true,
                        dniCli: true,
                        emailCli: true,
                        phoneCli: true,
                        addressCli: true
                    }
                }
            }
        });
    }

    async findByUsername(username) {
        return await prisma.usuario.findUnique({
            where: { username }
        });
    }

    async findByDni(dni) {
        return await prisma.client.findFirst({
            where: { dniCli: Number(dni) }
        });
    }

    async findByCli(idCli) {
        return await prisma.usuario.findFirst({
            where: { idCli: Number(idCli) }
        });
    }

    async create({ username, password, rol, idCli, passwordTemporal }) {
        const created = await prisma.usuario.create({
            data: {
                username,
                password,
                rol,
                idCli: idCli ?? null,
                passwordTemporal: passwordTemporal === undefined ? true : passwordTemporal
            }
        });

        return this.findById(created.idUsuario);
    }

    async updatePassword(id, passwordHash) {
        await prisma.usuario.update({
            where: { idUsuario: Number(id) },
            data: {
                password: passwordHash,
                passwordTemporal: false
            }
        });

        return this.findById(id);
    }

    async delete(id) {
        try {
            await prisma.usuario.delete({
                where: { idUsuario: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }

    async getAllAdministradores() {
        return await prisma.usuario.findMany({
            where: { rol: "administrador" },
            select: {
                idUsuario: true,
                username: true,
                rol: true,
                passwordTemporal: true
            }
        });
    }

    async updateAdministrador(id, { username, password }) {
        const data = { username };

        if (password) {
            data.password = password;
        }

        try {
            await prisma.usuario.update({
                where: {
                    idUsuario: Number(id),
                    rol: "administrador"
                },
                data
            });

            return this.findById(id);
        } catch {
            return null;
        }
    }
}

export default new UsuarioModel();
