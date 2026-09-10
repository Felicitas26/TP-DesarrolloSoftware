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
        const data = {};

        if (payment.value !== undefined) data.value = Number(payment.value);
        if (payment.statusPayment !== undefined) data.statusPayment = payment.statusPayment;
        if (payment.datePayment !== undefined) data.datePayment = new Date(payment.datePayment);
        if (payment.idContract !== undefined) data.idContract = Number(payment.idContract);

        try {
            return await prisma.payment.update({
                where: { idPayment: Number(id) },
                data
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
