/**
 * @typedef {Object} ContractPayment
 * @property {number} idPayment
 * @property {"pendiente"|"seña"|"pagado"} statusPayment
 * @property {number} [amount]
 */

/**
 * @typedef {Object} ContractData
 * @property {number} idContract
 * @property {"generado"|"en_revision"|"aprobado"|"rechazado"|"firmado"|"modificacion_en_curso"} status
 * @property {"pendiente"|"aprobada"|"rechazada"|null} [modificationStatus]
 * @property {number|null} [cantExactaInvit]
 * @property {string|null} [eventStartTime]
 * @property {string|null} [eventEndTime]
 * @property {Object} [reservation]
 * @property {Array<ContractPayment>} [payments]
 * @property {Array<{idService: number}>} [extraServices]
 * @property {Object} [modificationData]
 */

const STATUS_LABEL = {
    generado: "Generado",
    en_revision: "En revisión",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    firmado: "Firmado",
    modificacion_en_curso: "Modificación en curso"
};

const STATUS_DESCRIPTION = {
    generado: "Generado (pendiente de completar)",
    en_revision: "En revisión",
    aprobado: "Aprobado — listo para firma",
    rechazado: "Rechazado (requiere correcciones)",
    firmado: "Firmado",
    modificacion_en_curso: "Modificación aprobada — revisá y confirmá"
};

const PAYMENT_STATUS_LABEL = {
    pendiente: "Pendiente de abono",
    "seña": "Seña abonada",
    pagado: "Saldo abonado"
};

const EDITABLE_STATUSES = ["generado", "rechazado"];

export class Contract {
    /** @param {Partial<ContractData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

 
    static from(json) {
        return new Contract(json);
    }


    get statusLabel() {
        return STATUS_LABEL[this.status] || this.status || "";
    }

    get statusDescription() {
        return STATUS_DESCRIPTION[this.status] || this.status || "";
    }


    get paymentStatus() {
        const payment = this.payments?.[0];
        if (!payment) return "";
        return PAYMENT_STATUS_LABEL[payment.statusPayment] || payment.statusPayment;
    }

    get canBeEdited() {
        return EDITABLE_STATUSES.includes(this.status);
    }

    get hasPendingModification() {
        return this.modificationStatus === "pendiente";
    }

    get payment() {
        return this.payments?.[0] || null;
    }

    get eventDate() {
        return this.reservation?.dateEvent || null;
    }

    get isExpired() {
        if (!this.eventDate) return false;
        const dateOnly = String(this.eventDate).split("T")[0];
        const eventDate = new Date(`${dateOnly}T00:00:00`);
        if (Number.isNaN(eventDate.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate.getTime() < today.getTime();
    }
}
