import prisma from "../lib/prisma.js";

class LoungeTypeModel {

    async getAll() {
        return await prisma.loungeType.findMany({
            where: { activo: true },
            include: { lounge: { select: { name: true } } }
        });
    }

    async getById(id) {
        return await prisma.loungeType.findUnique({
            where: { idLoungeType: Number(id) },
            include: { lounge: { select: { name: true } } }
        });
    }

    async create(loungeType) {
        const { nameLoungeType, minQuantity, maxQuantity, idLounge } = loungeType;

        const created = await prisma.loungeType.create({
            data: {
                nameLoungeType,
                minQuantity: Number(minQuantity),
                maxQuantity: Number(maxQuantity),
                idLounge: Number(idLounge)
            }
        });

        return this.getById(created.idLoungeType);
    }

    async update(id, loungeType) {
        const { nameLoungeType, minQuantity, maxQuantity, idLounge } = loungeType;

        try {
            await prisma.loungeType.update({
                where: { idLoungeType: Number(id) },
                data: {
                    nameLoungeType,
                    minQuantity: Number(minQuantity),
                    maxQuantity: Number(maxQuantity),
                    idLounge: Number(idLounge),
                    activo: true
                }
            });

            return this.getById(id);
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.loungeType.update({
                where: { idLoungeType: Number(id) },
                data: { activo: false }
            });
            return true;
        } catch {
            return null;
        }
    }

    async existsByName(nameLoungeType, idLounge, excludeId = null) {
        const found =
            await this.findByName(nameLoungeType, idLounge, excludeId);
        return found !== null;
    }

    async findByName(nameLoungeType, idLounge, excludeId = null) {
        const where = {
            nameLoungeType,
            idLounge: Number(idLounge)
        };

        if (excludeId !== null) {
            where.idLoungeType = { not: Number(excludeId) };
        }

        return await prisma.loungeType.findFirst({ where });
    }
}

export default new LoungeTypeModel();
