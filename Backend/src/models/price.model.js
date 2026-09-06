import prisma from "../lib/prisma.js";

class PriceModel {

    async getAll() {
        return await prisma.price.findMany({
            include: {
                loungeType: {
                    select: {
                        minQuantity: true,
                        maxQuantity: true
                    }
                }
            }
        });
    }

    async getById(idLoungeType, effectiveDate) {
        return await prisma.price.findUnique({
            where: {
                effectiveDate_idLoungeType: {
                    effectiveDate: new Date(effectiveDate),
                    idLoungeType: Number(idLoungeType)
                }
            },
            include: {
                loungeType: {
                    select: {
                        minQuantity: true,
                        maxQuantity: true
                    }
                }
            }
        });
    }

    async getActive(idLoungeType, dateEvent) {
        const prices = await prisma.price.findMany({
            where: {
                idLoungeType: Number(idLoungeType),
                effectiveDate: { lte: new Date(dateEvent) },
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date(dateEvent) } }
                ]
            },
            orderBy: { effectiveDate: "desc" },
            take: 1
        });

        return prices[0] || null;
    }

    async create(price) {
        const { effectiveDate, endDate, value, idLoungeType } = price;

        await prisma.price.create({
            data: {
                effectiveDate: new Date(effectiveDate),
                endDate: endDate ? new Date(endDate) : null,
                value: Number(value),
                idLoungeType: Number(idLoungeType)
            }
        });

        return this.getById(idLoungeType, effectiveDate);
    }

    async update(idLoungeType, effectiveDate, price) {
        const { endDate, value } = price;

        try {
            await prisma.price.update({
                where: {
                    effectiveDate_idLoungeType: {
                        effectiveDate: new Date(effectiveDate),
                        idLoungeType: Number(idLoungeType)
                    }
                },
                data: {
                    endDate: endDate ? new Date(endDate) : null,
                    value: Number(value)
                }
            });

            return this.getById(idLoungeType, effectiveDate);
        } catch {
            return null;
        }
    }

    async delete(idLoungeType, effectiveDate) {
        try {
            await prisma.price.delete({
                where: {
                    effectiveDate_idLoungeType: {
                        effectiveDate: new Date(effectiveDate),
                        idLoungeType: Number(idLoungeType)
                    }
                }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new PriceModel();
