import clientModel from "../models/client.model.js";

class ClientService {

    async getAll() {
        return await clientModel.getAll();
    }

    async getById(id) {
        return await clientModel.getById(id);
    }

    async create(client) {
        return await clientModel.create(client);
    }

    async update(id, client) {
        return await clientModel.update(id, client);
    }

    async delete(id) {
        return await clientModel.delete(id);
    }
}

export default new ClientService();

