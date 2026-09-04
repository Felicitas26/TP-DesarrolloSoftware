import cardDetailModel from "../models/cardDetail.model.js";

class CardDetailService {

    async getAll() {
        return await cardDetailModel.getAll();
    }

    async getById(id) {
        return await cardDetailModel.getById(id);
    }

    async create(cardDetail) {
        return await cardDetailModel.create(cardDetail);
    }

    async update(id, cardDetail) {
        return await cardDetailModel.update(id, cardDetail);
    }

    async delete(id) {
        return await cardDetailModel.delete(id);
    }
}

export default new CardDetailService();