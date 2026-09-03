import db from "../../db.js";

class LoungeTypeModel {

    async getAll() {
        const [rows] = await db.execute(
            `SELECT lt.idLoungeType,
                    lt.nameLoungeType,
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
                    lt.nameLoungeType,
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
            nameLoungeType,
            minQuantity,
            maxQuantity,
            idLounge
        } = loungeType;

        const [result] = await db.execute(
            `INSERT INTO loungeType
            (nameLoungeType, minQuantity, maxQuantity, idLounge)
            VALUES (?, ?, ?, ?)`,
            [
                nameLoungeType,
                minQuantity,
                maxQuantity,
                idLounge
            ]
        );

        return this.getById(result.insertId);
    }

    async update(id, loungeType) {
        const {
            nameLoungeType,
            minQuantity,
            maxQuantity,
            idLounge
        } = loungeType;

        const [result] = await db.execute(
            `UPDATE loungeType
            SET nameLoungeType = ?,
                minQuantity = ?,
                maxQuantity = ?,
                idLounge = ?
            WHERE idLoungeType = ?`,
            [
                nameLoungeType,
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

    async existsByName(nameLoungeType, idLounge, excludeId = null) {
        if (excludeId === null) {
            const [rows] = await db.execute(
                "SELECT idLoungeType FROM loungeType WHERE nameLoungeType = ? AND idLounge = ? LIMIT 1",
                [nameLoungeType, idLounge]
            );
            return rows.length > 0;
        }
        const [rows] = await db.execute(
            "SELECT idLoungeType FROM loungeType WHERE nameLoungeType = ? AND idLounge = ? AND idLoungeType <> ? LIMIT 1",
            [nameLoungeType, idLounge, excludeId]
        );
        return rows.length > 0;
    }
}

export default new LoungeTypeModel();
