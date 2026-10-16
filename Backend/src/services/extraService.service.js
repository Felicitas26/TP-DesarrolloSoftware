import extraServiceModel from "../models/extraService.model.js";
import httpError from "../utils/httpError.js";

class ExtraServiceService {

    async getAll() {
        return await extraServiceModel.getAll();
    }

    async getById(id) {
        const extraService = await extraServiceModel.getById(id);

        if (!extraService) {
            throw httpError(404, `Servicio extra con ID ${id} no encontrado.`);
        }

        return extraService;
    }

    validate({ nameService, detailService, cost }) {
        if (!nameService || String(nameService).trim() === "") {
            throw httpError(400, "El nombre del servicio extra es obligatorio.");
        }

        if (!detailService || String(detailService).trim() === "") {
            throw httpError(400, "La descripción del servicio extra es obligatoria.");
        }

        if (cost === undefined || cost === null || cost === "" || isNaN(cost)) {
            throw httpError(400, "El costo del servicio extra debe ser un número.");
        }

        if (Number(cost) < 0) {
            throw httpError(400, "El costo del servicio extra no puede ser negativo.");
        }
    }

    async create(extraService) {
        this.validate(extraService);
        return await extraServiceModel.create(extraService);
    }

    async update(id, extraService) {
        await this.getById(id);
        this.validate(extraService);

        const updated = await extraServiceModel.update(id, extraService);

        if (!updated) {
            throw httpError(404, `Servicio extra con ID ${id} no encontrado.`);
        }

        return updated;
    }

    async delete(id) {
        const deleted = await extraServiceModel.delete(id);

        if (!deleted) {
            throw httpError(404, `Servicio extra con ID ${id} no encontrado.`);
        }

        return deleted;
    }
}

export default new ExtraServiceService();
