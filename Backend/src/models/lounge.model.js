import prisma from "../lib/prisma.js";

class LoungeModel {

    async getAll() {
        return await prisma.lounge.findMany({
            where: { activo: true }
        });
    }

    async getById(id) {
        return await prisma.lounge.findUnique({
            where: { idLounge: Number(id) }
        });
    }

    async create(lounge) {
        const { name, loungeAddress, idLocation } = lounge;

        return await prisma.lounge.create({
            data: {
                name,
                loungeAddress,
                idLocation: Number(idLocation)
            }
        });
    }

    async update(id, lounge) {
        const { name, loungeAddress, idLocation } = lounge;

        try {
            return await prisma.lounge.update({
                where: { idLounge: Number(id) },
                data: {
                    name,
                    loungeAddress,
                    idLocation: Number(idLocation)
                }
            });
        } catch {
            return null;
        }
    }

    async countReservations(id) {
        return await prisma.reservation.count({
            where: { idLounge: Number(id) }
        });
    }

    async delete(id) {
        try {
            await prisma.lounge.update({
                where: { idLounge: Number(id) },
                data: { activo: false }
            });
            return true;
        } catch (error) {
            if (error.code === "P2025") return null;
            throw error;
        }
    }
}

export default new LoungeModel();
