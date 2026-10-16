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
     * Convierte la respuesta cruda del endpoint en una instancia de Price.
     * @param {PriceData} json
     * @returns {Price}
     */
    static from(json) {
        return new Price(json);
    }

    /**
     * Clave compuesta usada por el endpoint /api/price/:idLoungeType/:date.
     * @param {Partial<PriceData>} price
     * @returns {string}
     */
    static key(price) {
        const date = new Date(price.effectiveDate).toISOString().slice(0, 10);
        return `${price.idLoungeType}/${encodeURIComponent(date)}`;
    }

    /** @returns {string} Clave de esta instancia */
    get key() {
        return Price.key(this);
    }

    /** @returns {string} Valor formateado como moneda ARS */
    get formattedValue() {
        return `$${Number(this.value).toLocaleString("es-AR")}`;
    }
}
