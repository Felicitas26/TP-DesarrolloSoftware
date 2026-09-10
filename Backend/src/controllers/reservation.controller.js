import reservationService from "../services/reservation.service.js";
import contractService from "../services/contract.service.js";
import notificationService from "../services/notification.service.js";

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

            if (!reservation) {
                return res.status(404).json({ error: "Reserva no encontrada." });
            }

            if (
                req.usuario.rol === "cliente" &&
                reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a esta reserva." });
            }

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
            const reservation = await reservationService.getById(req.params.id);

            if (!reservation) {
                return res.status(404).json({ error: "Reserva no encontrada." });
            }

            if (req.usuario.rol === "cliente") {
                if (reservation.idCli !== req.usuario.idCli) {
                    return res.status(403).json({ error: "No tenés acceso a esta reserva." });
                }

                if (reservation.status !== "pendiente") {
                    return res.status(400).json({ error: "Solo podés editar una reserva en estado pendiente." });
                }
            }

            const reservationUpdated = await reservationService.update(
                req.params.id,
                req.body
            );

            if (!reservationUpdated) {
                return res.status(404).json({ error: "No se pudo actualizar la reserva." });
            }

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

            let contract = null;

            if (req.body.status === "aceptada" && reservationUpdated) {
                contract = await contractService.generateForReservation(
                    reservationUpdated.idReservation
                );
            }

            return res.status(200).json({
                message: contract
                    ? "Reserva aceptada y contrato generado correctamente."
                    : "Estado de la reserva actualizado correctamente.",
                reservation: reservationUpdated,
                contract
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const reservation = await reservationService.getById(req.params.id);

            if (!reservation) {
                return res.status(404).json({ error: "Reserva no encontrada." });
            }

            if (
                req.usuario.rol === "cliente" &&
                reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a esta reserva." });
            }

            if (req.usuario.rol === "administrador") {
                const motivo = req.body?.motivo?.trim();

                if (!motivo) {
                    return res.status(400).json({
                        error: "Debés indicar el motivo de la eliminación de la reserva para notificar al cliente."
                    });
                }

                await notificationService.notifyClient({
                    idCli: reservation.idCli,
                    mensaje: `El administrador eliminó la reserva #${reservation.idReservation} por la siguiente razón: ${motivo}. Tu evento fue cancelado.`,
                    tipo: "reserva_cancelada",
                    idContract: null
                });
            }

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