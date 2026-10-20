import reservationService from "../services/reservation.service.js";
import contractService from "../services/contract.service.js";
import notificationService from "../services/notification.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import httpError from "../utils/httpError.js";

class ReservationController {

    getAll = asyncHandler(async (req, res) => {
        const reservations = await reservationService.getAll();
        return res.status(200).json(reservations);
    });

    getByClient = asyncHandler(async (req, res) => {
        const reservations = await reservationService.getByClient(
            req.usuario.idCli
        );

        return res.status(200).json(reservations);
    });

    getById = asyncHandler(async (req, res) => {
        const reservation = await reservationService.getById(req.params.id);

        if (!reservation) {
            throw httpError(404, "Reserva no encontrada.");
        }

        if (
            req.usuario.rol === "cliente" &&
            reservation.idCli !== req.usuario.idCli
        ) {
            throw httpError(403, "No tenés acceso a esta reserva.");
        }

        return res.status(200).json(reservation);
    });

    create = asyncHandler(async (req, res) => {
        const newReservation = await reservationService.create(
            req.body,
            req.usuario.idCli
        );

        await notificationService.notifyAdmins({
            mensaje: `El cliente solicitó una nueva reserva #${newReservation.idReservation} para el ${new Date(newReservation.dateEvent).toLocaleDateString("es-AR")}.`,
            tipo: "reserva_solicitada",
            idContract: null
        });

        return res.status(201).json(newReservation);
    });

    update = asyncHandler(async (req, res) => {
        const reservation = await reservationService.getById(req.params.id);

        if (!reservation) {
            throw httpError(404, "Reserva no encontrada.");
        }

        if (req.usuario.rol === "cliente") {
            if (reservation.idCli !== req.usuario.idCli) {
                throw httpError(403, "No tenés acceso a esta reserva.");
            }

            if (reservation.status !== "pendiente") {
                throw httpError(400, "Solo podés editar una reserva en estado pendiente.");
            }
        }

        const reservationUpdated = await reservationService.update(
            req.params.id,
            req.body
        );

        if (!reservationUpdated) {
            throw httpError(404, "No se pudo actualizar la reserva.");
        }

        return res.status(200).json({
            message: "Reserva actualizada correctamente.",
            reservation: reservationUpdated
        });
    });

    updateStatus = asyncHandler(async (req, res) => {
        const reservationUpdated = await reservationService.updateStatus(
            req.params.id,
            req.body.status
        );

        let contract = null;

        if (req.body.status === "aceptada" && reservationUpdated) {
            contract = await contractService.generateForReservation(
                reservationUpdated.idReservation
            );

            await notificationService.notifyClient({
                idCli: reservationUpdated.idCli,
                mensaje: contract
                    ? `Tu reserva #${reservationUpdated.idReservation} fue aceptada. Ya podés completar y enviar el contrato #${contract.idContract}.`
                    : `Tu reserva #${reservationUpdated.idReservation} fue aceptada.`,
                tipo: "reserva_aceptada",
                idContract: contract ? contract.idContract : null
            });
        }

        return res.status(200).json({
            message: contract
                ? "Reserva aceptada y contrato generado correctamente."
                : "Estado de la reserva actualizado correctamente.",
            reservation: reservationUpdated,
            contract
        });
    });

    delete = asyncHandler(async (req, res) => {
        const reservation = await reservationService.getById(req.params.id);

        if (!reservation) {
            throw httpError(404, "Reserva no encontrada.");
        }

        if (
            req.usuario.rol === "cliente" &&
            reservation.idCli !== req.usuario.idCli
        ) {
            throw httpError(403, "No tenés acceso a esta reserva.");
        }

        if (req.usuario.rol === "administrador") {
            const motivo = req.body?.motivo?.trim();

            if (!motivo) {
                throw httpError(
                    400,
                    "Debés indicar el motivo de la eliminación de la reserva para notificar al cliente."
                );
            }

            await notificationService.notifyClient({
                idCli: reservation.idCli,
                mensaje: `El administrador eliminó la reserva #${reservation.idReservation} por la siguiente razón: ${motivo}. Tu evento fue cancelado.`,
                tipo: "reserva_cancelada",
                idContract: null
            });
        } else if (req.usuario.rol === "cliente") {
            await notificationService.notifyAdmins({
                mensaje: `El cliente canceló la reserva #${reservation.idReservation} para el ${new Date(reservation.dateEvent).toLocaleDateString("es-AR")}.`,
                tipo: "reserva_cancelada",
                idContract: null
            });
        }

        await reservationService.delete(req.params.id);

        return res.status(200).json({
            message: "Reserva eliminada correctamente."
        });
    });
}

export default new ReservationController();
