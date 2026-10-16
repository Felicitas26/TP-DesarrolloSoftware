/**
 * @typedef {Object} ReservationData
 * @property {number} idReservation
 * @property {string} dateEvent
 * @property {string} [eventType]
 * @property {"pendiente"|"aceptada"|"confirmada"|"cancelada"} status
 * @property {number} cantInvit
 * @property {number} [maxCantInvit]
 * @property {number} idCli
 * @property {number} idLounge
 * @property {number} idLoungeType
 * @property {number} [idCardDetail]
 * @property {Array<{idService: number}>} [extraServices]
 */

const STATUS_LABEL = {
    pendiente: "Pendiente",
    aceptada: "Aceptada",
    confirmada: "Confirmada",
    cancelada: "Cancelada"
};

export class Reservation {
    /** @param {Partial<ReservationData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * Convierte la respuesta cruda del endpoint en una instancia de Reservation.
     * @param {ReservationData} json
     * @returns {Reservation}
     */
    static from(json) {
        return new Reservation(json);
    }

    /** @returns {string} */
    get statusLabel() {
        return STATUS_LABEL[this.status] || this.status || "";
    }

    /** @returns {string} Fecha formateada como dd/mm/yyyy */
    get formattedDate() {
        if (!this.dateEvent) return "";
        const dateOnly = String(this.dateEvent).split("T")[0];
        const [year, month, day] = dateOnly.split("-");
        if (!year || !month || !day) return dateOnly;
        return `${day}/${month}/${year}`;
    }

    /** @returns {boolean} */
    get isPending() {
        return this.status === "pendiente";
    }
}
