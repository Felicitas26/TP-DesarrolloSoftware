class CardDetailService {

    async getAll() {
        return await cardDetailModel.getAll();
    }

    async getById(id) {
        const cardDetail = await cardDetailModel.getById(id);
        if (!cardDetail) {
            throw { statusCode: 404, message: `Detalle de Tarjeta con ID ${id} no encontrado.` };
        }
        return cardDetail;
    }

    async create(cardDetail) {
        const { MenuStage, detail, budget, idAgreement } = cardDetail;

        if (!MenuStage || !detail || !budget || !idAgreement) {
            throw { statusCode: 400, message: "Todos los campos son obligatorios." };
        }

        if (typeof budget !== "number" || budget <= 0) {
            throw { statusCode: 400, message: "El presupuesto debe ser un número positivo." };
        }

        return await cardDetailModel.create(cardDetail);
    }

    async update(id, cardDetail) {
        const updated = await cardDetailModel.update(id, cardDetail);
        if (!updated) {
            throw { statusCode: 404, message: "No se ha encontrado el detalle de Tarjeta buscado." };
        }
        return updated;
    }

    async delete(id) {
        const deleted = await cardDetailModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: "No se ha encontrado el detalle de Tarjeta." };
        }
        return deleted;
    }

}

export default new CardDetailService();
