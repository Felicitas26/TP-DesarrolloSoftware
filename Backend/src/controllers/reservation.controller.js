import reservationService from "../services/reservation.service.js";

class ReservationController {

    async getAll(req, res) {
        try {
            const reservations = await reservationService.getAll();
            return res.status(200).json(reservations);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getByClient(req, res) {
        try {
            const reservations = await reservationService.getByClient(
                req.usuario.idCli
            );

            return res.status(200).json(reservations);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const reservation = await reservationService.getById(req.params.id);
            return res.status(200).json(reservation);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newReservation = await reservationService.create(
                req.body,
                req.usuario.idCli
            );

            return res.status(201).json(newReservation);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const reservationUpdated = await reservationService.update(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                message: "Reserva actualizada correctamente.",
                reservation: reservationUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const reservationUpdated = await reservationService.updateStatus(
                req.params.id,
                req.body.status
            );

            return res.status(200).json({
                message: "Estado de la reserva actualizado correctamente.",
                reservation: reservationUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await reservationService.delete(req.params.id);

            return res.status(200).json({
                message: "Reserva eliminada correctamente."
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new ReservationController();