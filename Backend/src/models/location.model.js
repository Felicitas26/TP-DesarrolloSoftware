import prisma from "../lib/prisma.js";

class LocationModel {

    async findAll() {
        return await prisma.location.findMany({
            where: { activo: true }
        });
    }

    async findByPk(id) {
        return await prisma.location.findUnique({
            where: { idLocation: Number(id) }
        });
    }

    async create(locationData) {
        const { city, zipCode } = locationData;

        return await prisma.location.create({
            data: { city, zipCode }
        });
    }

    async update(id, locationData) {
        const { city, zipCode } = locationData;

        try {
            return await prisma.location.update({
                where: { idLocation: Number(id) },
                data: { city, zipCode }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.location.update({
                where: { idLocation: Number(id) },
                data: { activo: false }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new LocationModel();
