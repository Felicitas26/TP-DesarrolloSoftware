import loungeModel from "../models/lounge.model.js";

class LoungeService {

    async getAll() {
        return await loungeModel.getAll();
    }

    async getById(id) {
        const lounge = await loungeModel.getById(id);
        if (!lounge) {
            throw { statusCode: 404, message: `Salón con ID ${id} no encontrado.` };
        }
        return lounge;
    }

    async create(lounge) {
        const { name, loungeAddress, idLocation } = lounge;

        if (!name || !loungeAddress || idLocation == undefined || idLocation === "") {
            throw { statusCode: 400, message: "Todos los campos (name, loungeAddress, idLocation) son obligatorios." };
        }

        return await loungeModel.create(lounge);
    }

    async update(id, lounge) {
        const { name, loungeAddress, idLocation } = lounge;

        if (!name || !loungeAddress || idLocation == undefined || idLocation === "") {
            throw { statusCode: 400, message: "Todos los campos (name, loungeAddress, idLocation) son obligatorios." };
        }

        const updated = await loungeModel.update(id, lounge);
        if (!updated) {
            throw { statusCode: 404, message: `No se encontró el salón con ID ${id} para actualizar.` };
        }
        return updated;
    }

    async delete(id) {
        const deleted = await loungeModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: `No se encontró el salón con ID ${id} para eliminar.` };
        }
        return deleted;
    }
}

export default new LoungeService();


