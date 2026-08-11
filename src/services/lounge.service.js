import loungeModel from "../models/lounge.model.js";

class LoungeService {

    async getAll() {
        return await loungeModel.getAll();
    }

    async getById(id) {
        return await loungeModel.getById(id);
    }

    async create(lounge) {
        return await loungeModel.create(lounge);
    }

    async update(id, lounge) {
        return await loungeModel.update(id, lounge);
    }

    async delete(id) {
        return await loungeModel.delete(id);
    }
}

export default new LoungeService();


