import db from "../../db.js";

class PriceService {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM Price"
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM Price WHERE idPrice = ?",
            [id]
        );

        return rows[0];
    }

    async create(price) {
        const {
            effectiveDate,
            endDate,
            value
        } = price;

        const [result] = await db.execute(
            `INSERT INTO Price
            (effectiveDate, endDate, value)
            VALUES (?, ?, ?)`,
            [
                effectiveDate,
                endDate,
                value
            ]
        );

        return {
            idPrice: result.insertId,
            effectiveDate,
            endDate,
            value
        };
    }

    async update(id, price) {
        const {
            effectiveDate,
            endDate,
            value
        } = price;

        const [result] = await db.execute(
            `UPDATE Price
            SET effectiveDate = ?,
                endDate = ?,
                value = ?
            WHERE idPrice = ?`,
            [
                effectiveDate,
                endDate,
                value,
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
            "DELETE FROM Price WHERE idPrice = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new PriceService();
