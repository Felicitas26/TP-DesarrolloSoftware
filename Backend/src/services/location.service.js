import locationModel from "../models/location.model.js";

class LocationService {

    async getAll() {
        return await locationModel.getAll();
    }

    async getById(id) {
        return await locationModel.getById(id);
    }

    async create(location) {
        return await locationModel.create(location);
    }

    async update(id, location) {
        return await locationModel.update(id, location);
    }

    async delete(id) {
        return await locationModel.delete(id);
    }
}

export default new LocationService();
