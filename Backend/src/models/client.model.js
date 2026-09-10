import prisma from "../lib/prisma.js";

class ClientModel {

    async getAll() {
        const clients = await prisma.client.findMany({
            include: { location: true }
        });
        return clients.map(c => ({
            ...c,
            city: c.location?.city || "",
            zipCode: c.location?.zipCode || ""
        }));
    }

    async getById(id) {
        const client = await prisma.client.findUnique({
            where: { idCli: Number(id) },
            include: { location: true }
        });
        if (!client) return null;
        return {
            ...client,
            city: client.location?.city || "",
            zipCode: client.location?.zipCode || ""
        };
    }

    async findByEmail(email) {
        return await prisma.client.findFirst({
            where: { emailCli: email }
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
