import prisma from "../lib/prisma.js";

class ExtraServiceModel {

    async getAll() {
        return await prisma.extraService.findMany();
    }

    async getById(id) {
        return await prisma.extraService.findUnique({
            where: { idService: Number(id) }
        });
    }

    async create(extraService) {
        const { nameService, detailService, cost } = extraService;

        return await prisma.extraService.create({
            data: {
                nameService,
                detailService,
                cost: Number(cost)
            }
        });
    }

    async update(id, extraService) {
        const { nameService, detailService, cost } = extraService;

        try {
            return await prisma.extraService.update({
                where: { idService: Number(id) },
                data: {
                    nameService,
                    detailService,
                    cost: Number(cost)
                }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.extraService.delete({
                where: { idService: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new ExtraServiceModel();
