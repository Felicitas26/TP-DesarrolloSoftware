import reservationModel from "../models/reservation.model.js";
import loungeModel from "../models/lounge.model.js";
import loungeTypeModel from "../models/loungeType.model.js";

class ReservationService {

    async getAll() {
        return await reservationModel.getAll();
    }

    async getByClient(idCli) {
        return await reservationModel.getByClient(idCli);
    }

    async getById(id) {
        return await reservationModel.getById(id);
    }

    async create(reservation, idCli) {
        const lounge = await loungeModel.getById(reservation.idLounge);
        if (!lounge || !lounge.activo) {
            const error = new Error("El salón seleccionado fue dado de baja y ya no acepta reservas.");
            error.statusCode = 409;
            throw error;
        }

        const loungeType = await loungeTypeModel.getById(reservation.idLoungeType);
        if (!loungeType || !loungeType.activo) {
            const error = new Error("El tipo de salón seleccionado fue dado de baja y ya no acepta reservas.");
            error.statusCode = 409;
            throw error;
        }

        if (Number(loungeType.idLounge) !== Number(lounge.idLounge)) {
            const error = new Error("La capacidad elegida no pertenece al salón seleccionado.");
            error.statusCode = 400;
            throw error;
        }

        const available = await reservationModel.isAvailable(
            Number(reservation.idLounge),
            Number(reservation.idLoungeType),
            reservation.dateEvent
        );

        if (!available) {
            const error = new Error("El salón no se encuentra disponible para la fecha seleccionada.");
            error.statusCode = 409;
            throw error;
        }

        return await reservationModel.create(
            {
                ...reservation,
                cantInvit: loungeType.minQuantity,
                maxCantInvit: loungeType.maxQuantity
            },
            idCli
        );
    }

    async update(id, reservation) {
        const current = await reservationModel.getById(id);

        if (!current) return null;

        const changingLounge =
            reservation.idLounge !== undefined &&
            String(reservation.idLounge) !== String(current.idLounge);

        const changingType =
            reservation.idLoungeType !== undefined &&
            String(reservation.idLoungeType) !== String(current.idLoungeType);

        const data = { ...reservation };

        if (changingLounge || changingType) {
            const idLounge = reservation.idLounge ?? current.idLounge;
            const idLoungeType = reservation.idLoungeType ?? current.idLoungeType;

            const lounge = await loungeModel.getById(idLounge);
            if (!lounge || !lounge.activo) {
                const error = new Error("El salón seleccionado fue dado de baja y ya no acepta reservas.");
                error.statusCode = 409;
                throw error;
            }

            const loungeType = await loungeTypeModel.getById(idLoungeType);
            if (!loungeType || !loungeType.activo) {
                const error = new Error("El tipo de salón seleccionado fue dado de baja y ya no acepta reservas.");
                error.statusCode = 409;
                throw error;
            }

            if (Number(loungeType.idLounge) !== Number(lounge.idLounge)) {
                const error = new Error("La capacidad elegida no pertenece al salón seleccionado.");
                error.statusCode = 400;
                throw error;
            }

            data.idLounge = Number(idLounge);
            data.idLoungeType = Number(idLoungeType);
            data.cantInvit = loungeType.minQuantity;
            data.maxCantInvit = loungeType.maxQuantity;
        }

        return await reservationModel.update(id, data);
    }

    async updateStatus(id, status) {
        return await reservationModel.updateStatus(id, status);
    }

    async delete(id) {
        return await reservationModel.delete(id);
    }
}

export default new ReservationService();