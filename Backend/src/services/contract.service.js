import contractModel from "../models/contract.model.js";

class ContractService {

    async getAll() {
        return await contractModel.getAll();
    }

    async getById(id) {
        return await contractModel.getById(id);
    }

    async create(contract) {
        return await contractModel.create(contract);
    }

    async update(id, contract) {
        return await contractModel.update(id, contract);
    }

    async delete(id) {
        return await contractModel.delete(id);
    }
}

export default new ContractService();