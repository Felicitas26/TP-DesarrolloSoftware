import locationModel from "../models/location.model.js";

class LocationService {

    async getAll() {
        return await locationModel.findAll(); 
    }

    async getById(id) {
        return await locationModel.findByPk(id);
    }

    async create(locationData) {
        return await locationModel.create(locationData);
    }

    async update(id, locationData) {
        // Verificamos si existe primero
        const location = await locationModel.findByPk(id);
        if (!location) {
            return null;
        }
        
        // Si usas el modelo basado en db.execute que armamos antes, implementamos el update acá o en el modelo
        const { city, zipCode } = locationData;
        const [result] = await locationModel.db.execute( 
            "UPDATE location SET city = ?, zipCode = ? WHERE idLocation = ?",
            [city, zipCode, id]
        );

        return await locationModel.findByPk(id);
    }

    async delete(id) {
        const location = await locationModel.findByPk(id);
        if (!location) {
            return null;
        }
        
        await locationModel.db.execute(
            "DELETE FROM location WHERE idLocation = ?",
            [id]
        );
        return true;
    }
}

export default new LocationService();