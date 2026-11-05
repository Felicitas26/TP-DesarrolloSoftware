/**
 * @typedef {Object} CardDetailData
 * @property {number} idCardDetail
 * @property {string} menuStage
 * @property {string} [detail]
 * @property {number|string} [budget]
 * @property {string} [starter]
 * @property {string} [mainCourse]
 * @property {string} [dessert]
 * @property {string} [imageUrl]
 */

export class CardDetail {
    /** @param {Partial<CardDetailData>} [data] */
    constructor(data = {}) {
        Object.assign(this, data);
    }

    /**
     * @param {CardDetailData} json
     * @returns {CardDetail}
     */
    static from(json) {
        return new CardDetail(json);
    }

    /**
     * @returns {Array<{label: string, text: string}>}
     */
    get courses() {
        if (this.starter && this.mainCourse && this.dessert) {
            return [
                { label: "Entrada", text: this.starter },
                { label: "Plato Principal", text: this.mainCourse },
                { label: "Postre", text: this.dessert }
            ];
        }
        return [
            { label: "Entrada", text: "A confirmar con el equipo de STYLO." },
            { label: "Plato Principal", text: "A confirmar con el equipo de STYLO." },
            { label: "Postre", text: "A confirmar con el equipo de STYLO." }
        ];
    }

    /** @returns {string} */
    get formattedBudget() {
        return `$${Number(this.budget || 0).toLocaleString("es-AR")}`;
    }
}
