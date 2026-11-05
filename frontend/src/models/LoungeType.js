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
     * @param {LoungeTypeData} json
     * @returns {LoungeType}
     */
    static from(json) {
        return new LoungeType(json);
    }

    /** @returns {string} */
    get guestRangeLabel() {
        return `${this.minQuantity} - ${this.maxQuantity} invitados`;
    }

    /**
     * @param {number} guests
     * @returns {boolean}
     */
    acceptsGuests(guests) {
        return guests >= this.minQuantity && guests <= this.maxQuantity;
    }
}
