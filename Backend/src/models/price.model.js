import db from "../../db.js";

class PriceModel {

    async getAll() {
        const [rows] = await db.execute(
            `SELECT p.effectiveDate,
                    p.endDate,
                    p.value,
                    p.idLoungeType,
                    lt.minQuantity,
                    lt.maxQuantity
             FROM price p
             INNER JOIN loungeType lt ON lt.idLoungeType = p.idLoungeType`
        );
        return rows;
    }

    async getById(idLoungeType, effectiveDate) {
        const [rows] = await db.execute(
            `SELECT p.effectiveDate,
                    p.endDate,
                    p.value,
                    p.idLoungeType,
                    lt.minQuantity,
                    lt.maxQuantity
             FROM price p
             INNER JOIN loungeType lt ON lt.idLoungeType = p.idLoungeType
             WHERE p.idLoungeType = ? AND p.effectiveDate = ?`,
            [idLoungeType, effectiveDate]
        );
        return rows[0];
    }

    async create(price) {
        const {
            effectiveDate,
            endDate,
            value,
            idLoungeType
        } = price;

        await db.execute(
            `INSERT INTO price
            (effectiveDate, endDate, value, idLoungeType)
            VALUES (?, ?, ?, ?)`,
            [
                effectiveDate,
                endDate || null,
                value,
                idLoungeType
            ]
        );

        return this.getById(idLoungeType, effectiveDate);
    }

    async update(idLoungeType, effectiveDate, price) {
        const {
            endDate,
            value
        } = price;

        const [result] = await db.execute(
            `UPDATE price
            SET endDate = ?,
                value = ?
            WHERE idLoungeType = ? AND effectiveDate = ?`,
            [
                endDate || null,
                value,
                idLoungeType,
                effectiveDate
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(idLoungeType, effectiveDate);
    }

    async delete(idLoungeType, effectiveDate) {
        const [result] = await db.execute(
            "DELETE FROM price WHERE idLoungeType = ? AND effectiveDate = ?",
            [idLoungeType, effectiveDate]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new PriceModel();
