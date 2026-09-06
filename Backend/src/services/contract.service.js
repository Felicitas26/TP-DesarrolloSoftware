import contractModel, { timeToDate } from "../models/contract.model.js";
import reservationModel from "../models/reservation.model.js";
import priceModel from "../models/price.model.js";
import prisma from "../lib/prisma.js";

const EDITABLE_STATUSES = ["generado", "rechazado"];

class ContractService {

    async getAll() {
        return await contractModel.getAll();
    }

    async getByClient(idCli) {
        return await contractModel.getByClient(idCli);
    }

    async getById(id) {
        return await contractModel.getById(id);
    }

    async generateForReservation(idReservation) {
        const existing = await contractModel.getByReservation(idReservation);

        if (existing) return existing;

        const reservation = await reservationModel.getById(idReservation);

        if (!reservation) return null;

        const calc = await this.calcValues(null, reservation);

        const extraIds = (reservation.extraServices || []).map(
            (service) => service.idService
        );

        return await contractModel.createFromReservation(
            reservation.idReservation,
            calc.total,
            extraIds
        );
    }

    async calcValues(contract, reservation) {
        const price = await priceModel.getActive(
            reservation.idLoungeType,
            reservation.dateEvent
        );
        const priceSalon = price ? Number(price.value) : 0;

        const budget = reservation.cardDetail
            ? Number(reservation.cardDetail.budget)
            : 0;

        const extras = Array.isArray(reservation.extraServices)
            ? [...reservation.extraServices]
            : Array.isArray(contract?.extraServices)
                ? [...contract.extraServices]
                : [];

        const totalExtras = extras.reduce(
            (acc, service) => acc + (Number(service.cost) || 0),
            0
        );

        const cantExacta = contract?.cantExactaInvit || null;
        const menuValue = cantExacta ? budget * cantExacta : 0;

        const total = Math.round(
            (priceSalon + menuValue + totalExtras) * 100
        ) / 100;

        return {
            priceSalon,
            menuValue,
            totalExtras,
            total,
            hasPrice: Boolean(price),
            menuBudget: budget
        };
    }

    async update(id, data) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (!EDITABLE_STATUSES.includes(contract.status)) {
            const error = new Error(
                "Este contrato no admite modificaciones en su estado actual."
            );
            error.statusCode = 400;
            throw error;
        }

        const reservation = contract.reservation;

        const dateEvent = data.dateEvent || reservation.dateEvent;
        const eventType = data.eventType || reservation.eventType;
        const idCardDetail = data.idCardDetail || reservation.idCardDetail;
        const idServices =
            data.idServices !== undefined
                ? data.idServices
                : (reservation && reservation.extraServices
                    ? reservation.extraServices.map((s) => s.idService)
                    : []);

        const cantExactaReal =
            data.cantExactaInvit === undefined ||
            data.cantExactaInvit === null ||
            data.cantExactaInvit === ""
                ? null
                : Number(data.cantExactaInvit);

        if (
            cantExactaReal !== null &&
            (cantExactaReal < reservation.cantInvit ||
                cantExactaReal > reservation.maxCantInvit)
        ) {
            const error = new Error(
                `La cantidad exacta de invitados debe estar entre ${reservation.cantInvit} y ${reservation.maxCantInvit} (cantidades prestablecidas en tu reserva).`
            );
            error.statusCode = 400;
            throw error;
        }

        const conflicts = await prisma.reservation.count({
            where: {
                idLounge: reservation.idLounge,
                idLoungeType: reservation.idLoungeType,
                dateEvent: new Date(dateEvent),
                status: { not: "cancelada" },
                idReservation: { not: reservation.idReservation }
            }
        });

        if (conflicts > 0) {
            const error = new Error(
                "El salón no se encuentra disponible para la nueva fecha seleccionada."
            );
            error.statusCode = 409;
            throw error;
        }

        const updatedReservation = await reservationModel.update(
            reservation.idReservation,
            {
                dateEvent,
                status: reservation.status,
                eventType,
                cantInvit: reservation.cantInvit,
                maxCantInvit: reservation.maxCantInvit,
                idCli: reservation.idCli,
                idLounge: reservation.idLounge,
                idLoungeType: reservation.idLoungeType,
                idCardDetail,
                idServices
            }
        );

        if (!updatedReservation) {
            const error = new Error("No se pudieron actualizar los datos de la reserva.");
            error.statusCode = 500;
            throw error;
        }

        await contractModel.updateExtraServices(id, idServices);

        const freshReservation = await reservationModel.getById(
            reservation.idReservation
        );
        const calc = await this.calcValues(
            { ...contract, cantExactaInvit: cantExactaReal },
            freshReservation
        );

        await contractModel.updateData(id, {
            eventStartTime: data.eventStartTime,
            eventEndTime: data.eventEndTime,
            cantExactaInvit: cantExactaReal,
            finalValue: calc.total
        });

        const updatedContract = await contractModel.getById(id);

        return {
            ...updatedContract,
            calc
        };
    }

    async enviar(id) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (!EDITABLE_STATUSES.includes(contract.status)) {
            const error = new Error(
                "El contrato no está en condiciones de ser enviado en su estado actual."
            );
            error.statusCode = 400;
            throw error;
        }

        const cantExactaReal = contract.cantExactaInvit;
        const reservation = contract.reservation;
        const min = reservation.cantInvit;
        const max = reservation.maxCantInvit;

        if (!cantExactaReal || cantExactaReal < min || cantExactaReal > max) {
            const error = new Error(
                `Ingresá la cantidad exacta de invitados (entre ${min} y ${max}, según las cantidades prestablecidas en tu reserva).`
            );
            error.statusCode = 400;
            throw error;
        }

        if (
            !timeToDate(contract.eventStartTime) ||
            !timeToDate(contract.eventEndTime)
        ) {
            const error = new Error(
                "Indicá la hora de inicio y fin del evento."
            );
            error.statusCode = 400;
            throw error;
        }

        await contractModel.updateStatus(id, "en_revision");

        return await contractModel.getById(id);
    }

    async review(id, decision) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (contract.status !== "en_revision") {
            const error = new Error(
                "Este contrato no tiene revisiones pendientes de revisar."
            );
            error.statusCode = 400;
            throw error;
        }

        const newStatus = decision === "aprobar" ? "aprobado" : "rechazado";

        await contractModel.updateStatus(id, newStatus);

        return await contractModel.getById(id);
    }

    async firmar(id) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (contract.status !== "aprobado") {
            const error = new Error(
                "El contrato solo puede aceptarse cuando la última revisión fue aprobada."
            );
            error.statusCode = 400;
            throw error;
        }

        await contractModel.updateStatus(id, "firmado");

        return await contractModel.getById(id);
    }

    async solicitarModificacion(id, data) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (contract.status !== "firmado") {
            const error = new Error(
                "Solo podés solicitar modificaciones sobre contratos firmados."
            );
            error.statusCode = 400;
            throw error;
        }

        if (contract.modificationStatus === "pendiente") {
            const error = new Error(
                "Ya existe una solicitud de modificación pendiente de aprobación."
            );
            error.statusCode = 400;
            throw error;
        }

        const reservation = contract.reservation;

        const dateEvent = data.dateEvent || reservation.dateEvent;
        const eventType = data.eventType || reservation.eventType;
        const idCardDetail =
            data.idCardDetail === undefined || data.idCardDetail === ""
                ? reservation.idCardDetail
                : data.idCardDetail
                    ? Number(data.idCardDetail)
                    : null;
        const idServices = Array.isArray(data.idServices)
            ? data.idServices
            : contract.extraServices.map((s) => s.idService);

        const cantExactaReal =
            data.cantExactaInvit === undefined ||
            data.cantExactaInvit === null ||
            data.cantExactaInvit === ""
                ? contract.cantExactaInvit
                : Number(data.cantExactaInvit);

        const eventStartTime =
            data.eventStartTime === undefined || data.eventStartTime === ""
                ? contract.eventStartTime
                : data.eventStartTime;
        const eventEndTime =
            data.eventEndTime === undefined || data.eventEndTime === ""
                ? contract.eventEndTime
                : data.eventEndTime;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventDate = new Date(
            `${String(dateEvent).split("T")[0]}T00:00:00`
        );
        const daysUntil = Math.round(
            (eventDate.getTime() - today.getTime()) / 86400000
        );

        if (daysUntil < 14) {
            const error = new Error(
                "Las modificaciones se aceptan hasta 2 semanas (14 días) antes del evento. Ya no hay tiempo para solicitar cambios."
            );
            error.statusCode = 400;
            throw error;
        }

        if (
            cantExactaReal !== null &&
            cantExactaReal !== undefined &&
            (cantExactaReal < reservation.cantInvit ||
                cantExactaReal > reservation.maxCantInvit)
        ) {
            const error = new Error(
                `La cantidad exacta de invitados debe estar entre ${reservation.cantInvit} y ${reservation.maxCantInvit}.`
            );
            error.statusCode = 400;
            throw error;
        }

        const conflicts = await prisma.reservation.count({
            where: {
                idLounge: reservation.idLounge,
                idLoungeType: reservation.idLoungeType,
                dateEvent: new Date(dateEvent),
                status: { not: "cancelada" },
                idReservation: { not: reservation.idReservation }
            }
        });

        if (conflicts > 0) {
            const error = new Error(
                "El salón no se encuentra disponible para la nueva fecha seleccionada."
            );
            error.statusCode = 409;
            throw error;
        }

        const updated = await contractModel.updateModification(id, {
            modificationStatus: "pendiente",
            modificationData: {
                dateEvent: String(dateEvent).split("T")[0],
                eventType,
                idCardDetail: idCardDetail ?? null,
                idServices,
                cantExactaInvit: cantExactaReal,
                eventStartTime,
                eventEndTime
            },
            modificationComment: data.comment || null,
            modificationRequestedAt: new Date()
        });

        if (!updated) {
            const error = new Error(
                "No se pudo registrar la solicitud de modificación."
            );
            error.statusCode = 500;
            throw error;
        }

        return await contractModel.getById(id);
    }

    async revisarModificacion(id, decision) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        if (contract.modificationStatus !== "pendiente") {
            const error = new Error(
                "No hay solicitudes de modificación pendientes para este contrato."
            );
            error.statusCode = 400;
            throw error;
        }

        if (decision === "rechazar") {
            const rechazado = await contractModel.updateModification(id, {
                modificationStatus: "rechazada"
            });

            if (!rechazado) {
                const error = new Error(
                    "No se pudo registrar el rechazo de la modificación."
                );
                error.statusCode = 500;
                throw error;
            }

            return await contractModel.getById(id);
        }

        const data = contract.modificationData || {};
        const reservation = contract.reservation;

        const dateEvent = data.dateEvent || reservation.dateEvent;
        const eventType = data.eventType || reservation.eventType;
        const idCardDetail = data.idCardDetail || reservation.idCardDetail;
        const idServices = Array.isArray(data.idServices)
            ? data.idServices
            : contract.extraServices.map((s) => s.idService);
        const cantExactaReal =
            data.cantExactaInvit === undefined || data.cantExactaInvit === null
                ? contract.cantExactaInvit
                : Number(data.cantExactaInvit);

        const updatedReservation = await reservationModel.update(
            reservation.idReservation,
            {
                dateEvent,
                status: reservation.status,
                eventType,
                cantInvit: reservation.cantInvit,
                maxCantInvit: reservation.maxCantInvit,
                idCli: reservation.idCli,
                idLounge: reservation.idLounge,
                idLoungeType: reservation.idLoungeType,
                idCardDetail: idCardDetail ?? null,
                idServices
            }
        );

        if (!updatedReservation) {
            const error = new Error(
                "No se pudieron aplicar los datos de la modificación."
            );
            error.statusCode = 500;
            throw error;
        }

        await contractModel.updateExtraServices(id, idServices);

        const freshReservation = await reservationModel.getById(
            reservation.idReservation
        );
        const calc = await this.calcValues(
            { ...contract, cantExactaInvit: cantExactaReal },
            freshReservation
        );

        await contractModel.updateData(id, {
            eventStartTime: data.eventStartTime,
            eventEndTime: data.eventEndTime,
            cantExactaInvit: cantExactaReal,
            finalValue: calc.total
        });

        const aprobado = await contractModel.updateModification(id, {
            modificationStatus: "aprobada"
        });

        if (!aprobado) {
            const error = new Error(
                "No se pudo confirmar la aprobación de la modificación."
            );
            error.statusCode = 500;
            throw error;
        }

        const updatedContract = await contractModel.getById(id);

        return {
            ...updatedContract,
            calc
        };
    }

    async cancelar(id) {
        const contract = await contractModel.getById(id);

        if (!contract) {
            const error = new Error("Contrato no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        await contractModel.remove(id);

        await reservationModel.delete(contract.idReservation);

        return true;
    }
}

export default new ContractService();