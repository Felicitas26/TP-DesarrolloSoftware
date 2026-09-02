import contractModel from "../models/contract.model.js";

class ContractService {

    async getAll() {
        return await contractModel.getAll();
    }

    async getById(id) {
        const contract = await contractModel.getById(id);
        if (!contract) {
            throw { statusCode: 404, message: `Contrato con ID ${id} no encontrado.` };
        }
        return contract;
    }

    async create(contract) {
        const { eventStartTime, eventEndTime } = contract;

        if (!eventStartTime || !eventEndTime) {
            throw { statusCode: 400, message: "Todos los campos son obligatorios." };
        }

        return await contractModel.create(contract);
    }

    async update(id, contract) {
        const updated = await contractModel.update(id, contract);
        if (!updated) {
            throw { statusCode: 404, message: "No se ha encontrado el contrato." };
        }
        return updated;
    }

    async delete(id) {
        const deleted = await contractModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: "No se ha encontrado el contrato." };
        }
        return deleted;
    }
}

export default new ContractService();
