import prisma from "../lib/prisma.js";

class PaymentModel {

    async getAll() {
        return await prisma.payment.findMany({
            include: { contract: true }
        });
    }

    async getById(id) {
        return await prisma.payment.findUnique({
            where: { idPayment: Number(id) },
            include: { contract: true }
        });
    }

    async create(payment) {
        const {
            value,
            statusPayment,
            datePayment,
            idContract
        } = payment;

        return await prisma.payment.create({
            data: {
                value: Number(value),
                statusPayment,
                datePayment: new Date(datePayment),
                idContract: Number(idContract)
            }
        });
    }

    async update(id, payment) {
        const {
            value,
            statusPayment,
            datePayment,
            idContract
        } = payment;

        try {
            return await prisma.payment.update({
                where: { idPayment: Number(id) },
                data: {
                    value: Number(value),
                    statusPayment,
                    datePayment: new Date(datePayment),
                    idContract: Number(idContract)
                }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.payment.delete({
                where: { idPayment: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new PaymentModel();
