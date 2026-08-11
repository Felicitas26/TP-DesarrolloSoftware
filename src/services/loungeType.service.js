import db from "../../db.js";

class LoungeTypeService {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM LoungeType"
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM LoungeType WHERE idLoungeType = ?",
            [id]
        );

        return rows[0];
    }

    async create(loungeType) {
        const {
            minQuantity,
            maxQuantity
        } = loungeType;

        const [result] = await db.execute(
            `INSERT INTO LoungeType
            (minQuantity, maxQuantity)
            VALUES (?, ?)`,
            [
                minQuantity,
                maxQuantity
            ]
        );

        return {
            idLoungeType: result.insertId,
            minQuantity,
            maxQuantity
        };
    }

    async update(id, loungeType) {
        const {
            minQuantity,
            maxQuantity
        } = loungeType;

        const [result] = await db.execute(
            `UPDATE LoungeType
            SET minQuantity = ?,
                maxQuantity = ?
            WHERE idLoungeType = ?`,
            [
                minQuantity,
                maxQuantity,
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
            "DELETE FROM LoungeType WHERE idLoungeType = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new LoungeTypeService();
