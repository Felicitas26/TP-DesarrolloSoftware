import locationModel from "../models/location.model.js";

class LocationService {

    async getAll() {
        return await locationModel.findAll(); 
    }

    async getById(id) {
        const location = await locationModel.findByPk(id);
        if (!location) {
            throw { statusCode: 404, message: `Ubicación con ID ${id} no encontrada.` };
        }
        return location;
    }

    async create(locationData) {
        const { city, zipCode } = locationData;

        if (!city || !zipCode) {
            throw { statusCode: 400, message: "Todos los campos (ciudad y código postal) son obligatorios." };
        }

        return await locationModel.create(locationData);
    }

    async update(id, locationData) {
        const { city, zipCode } = locationData;

        if (!city || !zipCode) {
            throw { statusCode: 400, message: "Todos los campos (ciudad y código postal) son obligatorios." };
        }

        const location = await locationModel.findByPk(id);
        if (!location) {
            throw { statusCode: 404, message: `No se encontró la ubicación con ID ${id} para actualizar.` };
        }

        const [result] = await locationModel.db.execute(
            "UPDATE location SET city = ?, zipCode = ? WHERE idLocation = ?",
            [city, zipCode, id]
        );

        return await locationModel.findByPk(id);
    }

    async delete(id) {
        const location = await locationModel.findByPk(id);
        if (!location) {
            throw { statusCode: 404, message: `No se encontró la ubicación con ID ${id} para eliminar.` };
        }

        await locationModel.db.execute(
            "DELETE FROM location WHERE idLocation = ?",
            [id]
        );
        return true;
    }
}

export default new LocationService();