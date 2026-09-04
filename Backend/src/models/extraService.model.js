import db from "../../db.js";

class ExtraServiceModel {

    async getAll() {
        const [rows] = await db.execute(
            `SELECT *
            FROM extraservice`
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            `SELECT *
            FROM extraservice
            WHERE idService = ?`,
            [id]
        );

        return rows[0];
    }

    async create(extraService) {
        const {
            nameService,
            detailService,
            cost
        } = extraService;

        const [result] = await db.execute(
            `INSERT INTO extraservice
            (nameService, detailService, cost)
            VALUES (?, ?, ?)`,
            [
                nameService,
                detailService,
                cost
            ]
        );

        return {
            idService: result.insertId,
            nameService,
            detailService,
            cost
        };
    }

    async update(id, extraService) {
        const {
            nameService,
            detailService,
            cost
        } = extraService;

        const [result] = await db.execute(
            `UPDATE extraservice
            SET nameService = ?,
                detailService = ?,
                cost = ?
            WHERE idService = ?`,
            [
                nameService,
                detailService,
                cost,
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
            "DELETE FROM extraservice WHERE idService = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new ExtraServiceModel();