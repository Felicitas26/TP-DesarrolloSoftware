import loungeTypeModel from "../models/loungeType.model.js";
import loungeModel from "../models/lounge.model.js";

class LoungeTypeService {

    async getAll() {
        return await loungeTypeModel.getAll();
    }

    async getById(id) {
        const loungeType = await loungeTypeModel.getById(id);
        if (!loungeType) {
            throw { statusCode: 404, message: `Tipo de salón con ID ${id} no encontrado.` };
        }
        return loungeType;
    }

    async create(loungeType) {
        const { minQuantity, maxQuantity, idLounge } = loungeType;

        if (minQuantity === undefined || maxQuantity === undefined || idLounge === undefined || idLounge === "") {
            throw { statusCode: 400, message: "Todos los campos son obligatorios (minQuantity, maxQuantity e idLounge)." };
        }

        if (isNaN(minQuantity) || isNaN(maxQuantity) || Number(minQuantity) <= 0 || Number(maxQuantity) <= 0) {
            throw { statusCode: 400, message: "Las capacidades deben ser números positivos." };
        }

        if (Number(minQuantity) > Number(maxQuantity)) {
            throw { statusCode: 400, message: "La capacidad mínima no puede superar la máxima." };
        }

        const lounge = await loungeModel.getById(idLounge);
        if (!lounge) {
            throw { statusCode: 404, message: `No existe el salón con ID ${idLounge}.` };
        }

        return await loungeTypeModel.create(loungeType);
    }

    async update(id, loungeType) {
        const { minQuantity, maxQuantity, idLounge } = loungeType;

        if (minQuantity === undefined || maxQuantity === undefined || idLounge === undefined || idLounge === "") {
            throw { statusCode: 400, message: "Todos los campos son obligatorios (minQuantity, maxQuantity e idLounge)." };
        }

        if (isNaN(minQuantity) || isNaN(maxQuantity) || Number(minQuantity) <= 0 || Number(maxQuantity) <= 0) {
            throw { statusCode: 400, message: "Las capacidades deben ser números positivos." };
        }

        if (Number(minQuantity) > Number(maxQuantity)) {
            throw { statusCode: 400, message: "La capacidad mínima no puede superar la máxima." };
        }

        const lounge = await loungeModel.getById(idLounge);
        if (!lounge) {
            throw { statusCode: 404, message: `No existe el salón con ID ${idLounge}.` };
        }

        const updated = await loungeTypeModel.update(id, loungeType);
        if (!updated) {
            throw { statusCode: 404, message: "Tipo de salón no encontrado." };
        }
        return updated;
    }

    async delete(id) {
        const deleted = await loungeTypeModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: "Tipo de salón no encontrado." };
        }
        return deleted;
    }
}

export default new LoungeTypeService();
