class ExtraServiceService {

    async getAll() {
        return await extraServiceModel.getAll();
    }

    async getById(id) {
        const extraService = await extraServiceModel.getById(id);
        if (!extraService) {
            throw { statusCode: 404, message: `Servicio Extra con ID ${id} no encontrado.` };
        }
        return extraService;
    }

    async create(extraService) {
        const { nameService, detailService, cost } = extraService;

        if (!nameService || !detailService || !cost) {
            throw { statusCode: 400, message: "Todos los campos son obligatorios." };
        }

        if (typeof cost !== "number" || cost < 0) {
            throw { statusCode: 400, message: "El costo solo puede contener números." };
        }

        return await extraServiceModel.create(extraService);
    }

    async update(id, extraService) {
        const updated = await extraServiceModel.update(id, extraService);
        if (!updated) {
            throw { statusCode: 404, message: "No se ha encontrado el Servicio Extra buscado." };
        }
        return updated;
    }

    async delete(id) {
        const deleted = await extraServiceModel.delete(id);
        if (!deleted) {
            throw { statusCode: 404, message: "No se ha encontrado el Servicio Extra." };
        }
        return deleted;
    }

}

export default new ExtraServiceService();
