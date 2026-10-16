/**
 * @typedef {Object} LoungeTypeData
 * @property {number} idLoungeType
 * @property {string} nameLoungeType
 * @property {number} minQuantity
 * @property {number} maxQuantity
 * @property {number} idLounge
 * @property {string} [loungeName]
 */

export class LoungeType {
    /** @param {Partial<LoungeTypeData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * Convierte la respuesta cruda del endpoint en una instancia de LoungeType.
     * @param {LoungeTypeData} json
     * @returns {LoungeType}
     */
    static from(json) {
        return new LoungeType(json);
    }

    /** @returns {string} Rango de invitados, ej: "50 - 100 invitados" */
    get guestRangeLabel() {
        return `${this.minQuantity} - ${this.maxQuantity} invitados`;
    }

    /**
     * Indica si una cantidad de invitados entra en el rango del tipo de salón.
     * @param {number} guests
     * @returns {boolean}
     */
    acceptsGuests(guests) {
        return guests >= this.minQuantity && guests <= this.maxQuantity;
    }
}
