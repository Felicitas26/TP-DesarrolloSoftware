import prisma from "../lib/prisma.js";

class ContractModel {

    async getAll() {
        return await prisma.contract.findMany();
    }

    async getById(id) {
        return await prisma.contract.findUnique({
            where: { idContract: Number(id) }
        });
    }

    async create(contract) {
        const { eventStartTime, eventEndTime, finalValue, idReservation } = contract;

        return await prisma.contract.create({
            data: {
                eventStartTime,
                eventEndTime,
                dateContract: new Date(),
                finalValue: Number(finalValue),
                idReservation: Number(idReservation)
            }
        });
    }

    async update(id, contract) {
        const { eventStartTime, eventEndTime, finalValue, idReservation } = contract;

        try {
            return await prisma.contract.update({
                where: { idContract: Number(id) },
                data: {
                    eventStartTime,
                    eventEndTime,
                    finalValue: Number(finalValue),
                    idReservation: Number(idReservation)
                }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.contract.delete({
                where: { idContract: Number(id) }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new ContractModel();
