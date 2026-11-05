/**
 * @typedef {Object} PriceData
 * @property {number} idLoungeType
 * @property {string} effectiveDate
 * @property {string|null} [endDate]
 * @property {number|string} value
 */

export class Price {
    /** @param {Partial<PriceData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * @param {PriceData} json
     * @returns {Price}
     */
    static from(json) {
        return new Price(json);
    }

    /**
     * @param {Partial<PriceData>} price
     * @returns {string}
     */
    static key(price) {
        const date = new Date(price.effectiveDate).toISOString().slice(0, 10);
        return `${price.idLoungeType}/${encodeURIComponent(date)}`;
    }

    /** @returns {string} */
    get key() {
        return Price.key(this);
    }

    /** @returns {string} */
    get formattedValue() {
        return `$${Number(this.value).toLocaleString("es-AR")}`;
    }
}
