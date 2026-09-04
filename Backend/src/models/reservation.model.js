import prisma from "../lib/prisma.js";

class ReservationModel {

    async getAll() {
        return await prisma.reservation.findMany({
            include: {
                client: {
                    select: {
                        nameCli: true,
                        surnameCli: true,
                        dniCli: true,
                        phoneCli: true,
                        emailCli: true,
                        addressCli: true,
                        location: {
                            select: {
                                city: true,
                                zipCode: true
                            }
                        }
                    }
                },
                lounge: {
                    select: { name: true }
                },
                loungeType: {
                    select: { nameLoungeType: true }
                },
                cardDetail: true
            }
        });
    }

    async getByClient(idCli) {
        const reservations = await prisma.reservation.findMany({
            where: { idCli: Number(idCli) },
            orderBy: { dateEvent: "asc" },
            include: {
                cardDetail: true,
                lounge: {
                    select: { name: true, loungeAddress: true }
                },
                loungeType: {
                    select: {
                        nameLoungeType: true,
                        minQuantity: true,
                        maxQuantity: true
                    }
                },
                extraServices: {
                    include: {
                        extraService: {
                            select: {
                                idService: true,
                                nameService: true,
                                detailService: true,
                                cost: true
                            }
                        }
                    }
                }
            }
        });

        return reservations.map(r => ({
            ...r,
            extraServices: r.extraServices.map(es => es.extraService)
        }));
    }

    async getById(id) {
        return await prisma.reservation.findUnique({
            where: { idReservation: Number(id) },
            include: {
                client: {
                    select: {
                        nameCli: true,
                        surnameCli: true,
                        dniCli: true
                    }
                },
                lounge: {
                    select: { name: true }
                },
                loungeType: {
                    select: { nameLoungeType: true }
                },
                cardDetail: true
            }
        });
    }

    async create(reservation, idCli) {
        const {
            dateEvent,
            status,
            eventType,
            cantInvit,
            idLounge,
            idLoungeType,
            idCardDetail,
            idServices
        } = reservation;

        const created = await prisma.reservation.create({
            data: {
                dateReservation: new Date(),
                dateEvent: new Date(dateEvent),
                status,
                eventType: eventType || null,
                cantInvit: Number(cantInvit),
                idCli: Number(idCli),
                idLounge: Number(idLounge),
                idLoungeType: Number(idLoungeType),
                idCardDetail: idCardDetail ? Number(idCardDetail) : null,
                ...(idServices && idServices.length > 0
                    ? {
                        extraServices: {
                            create: idServices.map(idService => ({
                                idService: Number(idService)
                            }))
                        }
                    }
                    : {})
            }
        });

        return {
            ...created,
            idServices: idServices || []
        };
    }

    async update(id, reservation) {
        const {
            dateEvent,
            status,
            eventType,
            cantInvit,
            idCli,
            idLounge,
            idLoungeType,
            idCardDetail
        } = reservation;

        try {
            return await prisma.reservation.update({
                where: { idReservation: Number(id) },
                data: {
                    dateEvent: new Date(dateEvent),
                    status,
                    eventType: eventType || null,
                    cantInvit: Number(cantInvit),
                    idCli: Number(idCli),
                    idLounge: Number(idLounge),
                    idLoungeType: Number(idLoungeType),
                    idCardDetail: idCardDetail ? Number(idCardDetail) : null
                }
            });
        } catch {
            return null;
        }
    }

    async updateStatus(id, status) {
        try {
            return await prisma.reservation.update({
                where: { idReservation: Number(id) },
                data: { status }
            });
        } catch {
            return null;
        }
    }

    async delete(id) {
        try {
            await prisma.reservation.update({
                where: { idReservation: Number(id) },
                data: { status: "cancelada" }
            });
            return true;
        } catch {
            return null;
        }
    }
}

export default new ReservationModel();
