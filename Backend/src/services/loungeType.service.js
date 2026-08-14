import loungeTypeModel from "../../Backend/src/models/loungeType.model.js";

class LoungeTypeService {

    async getAll() {
        return await loungeTypeModel.getAll();
    }

    async getById(id) {
        return await loungeTypeModel.getById(id);
    }

    async create(loungeType) {
        return await loungeTypeModel.create(loungeType);
    }

    async update(id, loungeType) {
        return await loungeTypeModel.update(id, loungeType);
    }

    async delete(id) {
        return await loungeTypeModel.delete(id);
    }
}

export default new LoungeTypeService();
