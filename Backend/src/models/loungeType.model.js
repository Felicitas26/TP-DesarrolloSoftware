import prisma from "../lib/prisma.js";

class LoungeTypeModel {

    async getAll() {
        return await prisma.loungeType.findMany({
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
                    idLounge: Number(idLounge)
                }
            });

            return this.getById(id);
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.loungeType.delete({
                where: { idLoungeType: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }

    async existsByName(nameLoungeType, idLounge, excludeId = null) {
        const where = {
            nameLoungeType,
            idLounge: Number(idLounge)
        };

        if (excludeId !== null) {
            where.idLoungeType = { not: Number(excludeId) };
        }

        const found = await prisma.loungeType.findFirst({ where });
        return found !== null;
    }
}

export default new LoungeTypeModel();
