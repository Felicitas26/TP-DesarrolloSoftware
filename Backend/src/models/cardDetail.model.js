import prisma from "../lib/prisma.js";

class CardDetailModel {

    async getAll() {
        return await prisma.cardDetail.findMany();
    }

    async getById(id) {
        return await prisma.cardDetail.findUnique({
            where: { idCardDetail: Number(id) }
        });
    }

    async create(cardDetail) {
        const { menuStage, detail, budget, imageUrl, starter, mainCourse, dessert } = cardDetail;

        return await prisma.cardDetail.create({
            data: {
                menuStage,
                detail,
                budget: Number(budget),
                imageUrl: imageUrl || null,
                starter: starter || null,
                mainCourse: mainCourse || null,
                dessert: dessert || null
            }
        });
    }

    async update(id, cardDetail) {
        const { menuStage, detail, budget, imageUrl, starter, mainCourse, dessert } = cardDetail;

        try {
            return await prisma.cardDetail.update({
                where: { idCardDetail: Number(id) },
                data: {
                    menuStage,
                    detail,
                    budget: Number(budget),
                    imageUrl: imageUrl || null,
                    starter: starter || null,
                    mainCourse: mainCourse || null,
                    dessert: dessert || null
                }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.cardDetail.delete({
                where: { idCardDetail: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new CardDetailModel();