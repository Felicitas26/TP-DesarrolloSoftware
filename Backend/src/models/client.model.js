import prisma from "../lib/prisma.js";

class ClientModel {

    async getAll() {
        return await prisma.client.findMany({
            include: { location: true }
        });
    }

    async getById(id) {
        return await prisma.client.findUnique({
            where: { idCli: Number(id) },
            include: { location: true }
        });
    }

    async create(client) {
        const {
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            idLocation
        } = client;

        return await prisma.client.create({
            data: {
                nameCli,
                surnameCli,
                phoneCli,
                dniCli: Number(dniCli),
                emailCli,
                addressCli,
                idLocation: Number(idLocation)
            }
        });
    }

    async update(id, client) {
        const {
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            idLocation
        } = client;

        try {
            return await prisma.client.update({
                where: { idCli: Number(id) },
                data: {
                    nameCli,
                    surnameCli,
                    phoneCli,
                    dniCli: Number(dniCli),
                    emailCli,
                    addressCli,
                    idLocation: Number(idLocation)
                }
            });
        } catch {
            return null;
        }
    }

    async updateMe(idCli, client) {
        const {
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            idLocation
        } = client;

        try {
            return await prisma.client.update({
                where: { idCli: Number(idCli) },
                data: {
                    nameCli,
                    surnameCli,
                    phoneCli,
                    dniCli: Number(dniCli),
                    emailCli,
                    addressCli,
                    idLocation: Number(idLocation)
                }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.client.delete({
                where: { idCli: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new ClientModel();
