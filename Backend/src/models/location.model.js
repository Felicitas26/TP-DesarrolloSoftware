import db from "../../db.js";

class LocationModel {

    async findAll() {
        const [rows] = await db.execute(
            "SELECT * FROM location"
        );
        return rows;
    }

    async findByPk(id) {
        const [rows] = await db.execute(
            "SELECT * FROM location WHERE idLocation = ?",
            [id]
        );
        return rows[0];
    }

    async create(locationData) {
        const { city, zipCode } = locationData;
        const [result] = await db.execute(
            "INSERT INTO location (city, zipCode) VALUES (?, ?)",
            [city, zipCode]
        );
        return { idLocation: result.insertId, city, zipCode };
    }
}

export default new LocationModel();