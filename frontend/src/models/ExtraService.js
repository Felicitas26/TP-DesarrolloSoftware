/**
 * @typedef {Object} ExtraServiceData
 * @property {number} idService
 * @property {string} nameService
 * @property {string} [detailService]
 * @property {number|string} cost
 */

export class ExtraService {
    /** @param {Partial<ExtraServiceData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * @param {ExtraServiceData} json
     * @returns {ExtraService}
     */
    static from(json) {
        return new ExtraService(json);
    }

    /** @returns {string} */
    get formattedCost() {
        return `$${Number(this.cost || 0).toLocaleString("es-AR")}`;
    }
}
