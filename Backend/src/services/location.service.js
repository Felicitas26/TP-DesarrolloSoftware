import locationModel from "../models/location.model.js";

class LocationService {

    async getAll() {
        return await locationModel.findAll();
    }

    async getById(id) {
        const location = await locationModel.findByPk(id);
        if (!location) {
            throw { statusCode: 404, message: `Ubicacion con ID ${id} no encontrada.` };
        }
        return location;
    }

    async create(locationData) {
        const { city, zipCode } = locationData;

        if (!city || !zipCode) {
            throw { statusCode: 400, message: "Todos los campos (ciudad y codigo postal) son obligatorios." };
        }

        return await locationModel.create(locationData);
    }

    async update(id, locationData) {
        const { city, zipCode } = locationData;

        if (!city || !zipCode) {
            throw { statusCode: 400, message: "Todos los campos (ciudad y codigo postal) son obligatorios." };
        }

        const location = await locationModel.findByPk(id);
        if (!location) {
            throw { statusCode: 404, message: `No se encontro la ubicacion con ID ${id} para actualizar.` };
        }

        return await locationModel.update(id, locationData);
    }

    async delete(id) {
        const location = await locationModel.findByPk(id);
        if (!location) {
            throw { statusCode: 404, message: `No se encontro la ubicacion con ID ${id} para eliminar.` };
        }

        return await locationModel.delete(id);
    }
}

export default new LocationService();
