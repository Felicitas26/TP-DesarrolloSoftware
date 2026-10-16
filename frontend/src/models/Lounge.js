/**
 * @typedef {Object} LoungeData
 * @property {number} idLounge
 * @property {string} name
 * @property {string} [loungeAddress]
 * @property {number} [idLocation]
 * @property {string} [cityName]
 */

export class Lounge {
    /** @param {Partial<LoungeData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * Convierte la respuesta cruda del endpoint en una instancia de Lounge.
     * @param {LoungeData} json
     * @returns {Lounge}
     */
    static from(json) {
        return new Lounge(json);
    }

    /** @returns {string} Ciudad o "No asignada" */
    get cityLabel() {
        return this.cityName || "No asignada";
    }
}
