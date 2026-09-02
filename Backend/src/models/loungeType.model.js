import db from "../../db.js";

class LoungeTypeModel {

    async getAll() {
        const [rows] = await db.execute(
            `SELECT lt.idLoungeType,
                    lt.minQuantity,
                    lt.maxQuantity,
                    lt.idLounge,
                    l.name AS loungeName
             FROM loungeType lt
             INNER JOIN lounge l ON l.idLounge = lt.idLounge`
        );
        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            `SELECT lt.idLoungeType,
                    lt.minQuantity,
                    lt.maxQuantity,
                    lt.idLounge,
                    l.name AS loungeName
             FROM loungeType lt
             INNER JOIN lounge l ON l.idLounge = lt.idLounge
             WHERE lt.idLoungeType = ?`,
            [id]
        );
        return rows[0];
    }

    async create(loungeType) {
        const {
            minQuantity,
            maxQuantity,
            idLounge
        } = loungeType;

        const [result] = await db.execute(
            `INSERT INTO loungeType
            (minQuantity, maxQuantity, idLounge)
            VALUES (?, ?, ?)`,
            [
                minQuantity,
                maxQuantity,
                idLounge
            ]
        );

        return this.getById(result.insertId);
    }

    async update(id, loungeType) {
        const {
            minQuantity,
            maxQuantity,
            idLounge
        } = loungeType;

        const [result] = await db.execute(
            `UPDATE loungeType
            SET minQuantity = ?,
                maxQuantity = ?,
                idLounge = ?
            WHERE idLoungeType = ?`,
            [
                minQuantity,
                maxQuantity,
                idLounge,
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
            "DELETE FROM loungeType WHERE idLoungeType = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new LoungeTypeModel();
