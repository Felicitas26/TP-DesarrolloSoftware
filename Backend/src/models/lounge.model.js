import db from "../../db.js";

class LoungeModel {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM lounge"
        );
        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM lounge WHERE idLounge = ?",
            [id]
        );
        return rows[0];
    }

    async create(lounge) {
        const {
            name,
            loungeAddress,
            idLocation
        } = lounge;

        const [result] = await db.execute(
            `INSERT INTO lounge
            (name, loungeAddress, idLocation)
            VALUES (?, ?, ?)`,
            [
                name,
                loungeAddress,
                idLocation
            ]
        );

        return {
            idLounge: result.insertId,
            name,
            loungeAddress,
            idLocation
        };
    }

    async update(id, lounge) {
        const {
            name,
            loungeAddress,
            idLocation
        } = lounge;

        const [result] = await db.execute(
            `UPDATE lounge
            SET name = ?,
                loungeAddress = ?,
                idLocation = ?
            WHERE idLounge = ?`,
            [
                name,
                loungeAddress,
                idLocation,
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
            "DELETE FROM lounge WHERE idLounge = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new LoungeModel();