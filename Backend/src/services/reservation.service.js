import reservationModel from "../models/reservation.model.js";
import loungeModel from "../models/lounge.model.js";
import loungeTypeModel from "../models/loungeType.model.js";
import notificationService from "./notification.service.js";

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
        if (!reservation || !reservation.dateEvent || !reservation.idLounge || !reservation.idLoungeType) {
            const error = new Error("Faltan datos obligatorios para crear la reserva (fecha, salón o tipo).");
            error.statusCode = 400;
            throw error;
        }

        if (isNaN(new Date(reservation.dateEvent).getTime())) {
            const error = new Error("La fecha del evento no es válida.");
            error.statusCode = 400;
            throw error;
        }

        reservation = {
            ...reservation,
            status: reservation.status || "pendiente"
        };

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

    // ============================== BAJA / REACTIVACIÓN

    async getPedidosReactivacion() {
        return await reservationModel.getPedidosReactivacion();
    }

    async pedirReactivacion(id) {
        const reservation = await reservationModel.getById(id);

        if (!reservation) {
            const error = new Error("Reserva no encontrada.");
            error.statusCode = 404;
            throw error;
        }

        if (reservation.status !== "cancelada") {
            const error = new Error("Esta reserva no está dada de baja.");
            error.statusCode = 409;
            throw error;
        }

        if (reservation.pedirReactivacion) {
            const error = new Error("Ya enviaste el pedido de reactivación de esta reserva. Esperá la respuesta del administrador.");
            error.statusCode = 409;
            throw error;
        }

        const updated = await reservationModel.setPedirReactivacion(id, true);

        if (!updated) {
            const error = new Error("No se pudo enviar el pedido de reactivación.");
            error.statusCode = 500;
            throw error;
        }

        await notificationService.notifyAdmins({
            mensaje: `El cliente pidió reactivar la reserva #${reservation.idReservation} (evento del ${new Date(reservation.dateEvent).toLocaleDateString("es-AR")}). Revisá la solicitud en Gestión de Reservas.`,
            tipo: "reactivacion_reserva_pedida",
            idContract: null
        });

        return updated;
    }

    async aprobarReactivacion(id) {
        const reservation = await reservationModel.getById(id);

        if (!reservation) {
            const error = new Error("Reserva no encontrada.");
            error.statusCode = 404;
            throw error;
        }

        if (reservation.status !== "cancelada") {
            const error = new Error("Esta reserva no está dada de baja.");
            error.statusCode = 409;
            throw error;
        }

        if (!reservation.pedirReactivacion) {
            const error = new Error("Esta reserva no tiene un pedido de reactivación pendiente.");
            error.statusCode = 409;
            throw error;
        }

        const updated = await reservationModel.aprobarReactivacion(id);

        if (!updated) {
            const error = new Error("No se pudo aprobar la reactivación.");
            error.statusCode = 500;
            throw error;
        }

        await notificationService.notifyClient({
            idCli: reservation.idCli,
            mensaje: `Tu pedido de reactivación de la reserva #${reservation.idReservation} fue aprobado. La reserva volvió a estar pendiente y el administrador va a continuar con el proceso habitual de tu reserva.`,
            tipo: "reactivacion_reserva_aceptada",
            idContract: null
        });

        return updated;
    }

    async rechazarReactivacion(id) {
        const reservation = await reservationModel.getById(id);

        if (!reservation) {
            const error = new Error("Reserva no encontrada.");
            error.statusCode = 404;
            throw error;
        }

        if (!reservation.pedirReactivacion) {
            const error = new Error("Esta reserva no tiene un pedido de reactivación pendiente.");
            error.statusCode = 409;
            throw error;
        }

        const updated = await reservationModel.rechazarReactivacion(id);

        if (!updated) {
            const error = new Error("No se pudo rechazar el pedido de reactivación.");
            error.statusCode = 500;
            throw error;
        }

        await notificationService.notifyClient({
            idCli: reservation.idCli,
            mensaje: `Tu pedido de reactivación de la reserva #${reservation.idReservation} fue rechazado por el administrador. La reserva continúa dada de baja.`,
            tipo: "reactivacion_reserva_rechazada",
            idContract: null
        });

        return updated;
    }
}

export default new ReservationService();