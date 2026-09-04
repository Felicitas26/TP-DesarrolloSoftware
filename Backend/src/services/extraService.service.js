import extraServiceModel from "../models/extraService.model.js";

class ExtraServiceService {

    async getAll() {
        return await extraServiceModel.getAll();
    }

    async getById(id) {
        return await extraServiceModel.getById(id);
    }

    async create(extraService) {
        return await extraServiceModel.create(extraService);
    }

    async update(id, extraService) {
        return await extraServiceModel.update(id, extraService);
    }

    async delete(id) {
        return await extraServiceModel.delete(id);
    }
}

export default new ExtraServiceService();