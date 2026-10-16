import cardDetailModel from "../models/cardDetail.model.js";
import httpError from "../utils/httpError.js";

class CardDetailService {

    async getAll() {
        return await cardDetailModel.getAll();
    }

    async getById(id) {
        const cardDetail = await cardDetailModel.getById(id);

        if (!cardDetail) {
            throw httpError(404, `Detalle de menú con ID ${id} no encontrado.`);
        }

        return cardDetail;
    }

    validate({ menuStage, detail, budget }) {
        if (!menuStage || String(menuStage).trim() === "") {
            throw httpError(400, "El nombre de la tarjeta de menú es obligatorio.");
        }

        if (!detail || String(detail).trim() === "") {
            throw httpError(400, "La descripción de la tarjeta de menú es obligatoria.");
        }

        if (budget === undefined || budget === null || budget === "" || isNaN(budget)) {
            throw httpError(400, "El presupuesto debe ser un número.");
        }

        if (Number(budget) < 0) {
            throw httpError(400, "El presupuesto no puede ser negativo.");
        }
    }

    async create(cardDetail) {
        this.validate(cardDetail);
        return await cardDetailModel.create(cardDetail);
    }

    async update(id, cardDetail) {
        await this.getById(id);
        this.validate(cardDetail);

        const updated = await cardDetailModel.update(id, cardDetail);

        if (!updated) {
            throw httpError(404, `Detalle de menú con ID ${id} no encontrado.`);
        }

        return updated;
    }

    async delete(id) {
        const deleted = await cardDetailModel.delete(id);

        if (!deleted) {
            throw httpError(404, `Detalle de menú con ID ${id} no encontrado.`);
        }

        return deleted;
    }
}

export default new CardDetailService();
