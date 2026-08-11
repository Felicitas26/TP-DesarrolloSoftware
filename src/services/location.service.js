import db from "../../db.js";

class LocationService {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM Location"
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM Location WHERE idLocation = ?",
            [id]
        );

        return rows[0];
    }

    async create(location) {
        const {
            locality,
            zipCode
        } = location;

        const [result] = await db.execute(
            `INSERT INTO Location
            (locality, zipCode)
            VALUES (?, ?)`,
            [
                locality,
                zipCode
            ]
        );

        return {
            idLocation: result.insertId,
            locality,
            zipCode
        };
    }

    async update(id, location) {
        const {
            locality,
            zipCode
        } = location;

        const [result] = await db.execute(
            `UPDATE Location
            SET locality = ?,
                zipCode = ?
            WHERE idLocation = ?`,
            [
                locality,
                zipCode,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(id);
    }

    async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM Location WHERE idLocation = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new LocationService();

