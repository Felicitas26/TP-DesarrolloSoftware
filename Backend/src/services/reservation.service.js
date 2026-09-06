import reservationModel from "../models/reservation.model.js";

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

        return await reservationModel.create(reservation, idCli);
    }

    async update(id, reservation) {
        return await reservationModel.update(id, reservation);
    }

    async updateStatus(id, status) {
        return await reservationModel.updateStatus(id, status);
    }

    async delete(id) {
        return await reservationModel.delete(id);
    }
}

export default new ReservationService();