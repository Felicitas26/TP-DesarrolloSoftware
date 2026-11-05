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
     * @param {LoungeData} json
     * @returns {Lounge}
     */
    static from(json) {
        return new Lounge(json);
    }

    /** @returns {string}  */
    get cityLabel() {
        return this.cityName || "No asignada";
    }
}
