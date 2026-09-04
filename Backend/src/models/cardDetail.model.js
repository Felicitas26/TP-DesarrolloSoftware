import db from "../../db.js";

class CardDetailModel {

    async getAll() {

        const [rows] = await db.execute(
            `SELECT *
            FROM cardDetail`
        );

        return rows;
    }

    async getById(id) {

        const [rows] = await db.execute(
            `SELECT *
            FROM cardDetail
            WHERE idCardDetail = ?`,
            [id]
        );

        return rows[0];
    }

    async create(cardDetail) {

        const {
            menuStage,
            detail,
            budget
        } = cardDetail;

        const [result] = await db.execute(
            `INSERT INTO cardDetail
            (
                menuStage,
                detail,
                budget
            )
            VALUES
            (
                ?,
                ?,
                ?
            )`,
            [
                menuStage,
                detail,
                budget
            ]
        );

        return {
            idCardDetail: result.insertId,
            menuStage,
            detail,
            budget
        };
    }

    async update(id, cardDetail) {

        const {
            menuStage,
            detail,
            budget
        } = cardDetail;

        const [result] = await db.execute(
            `UPDATE cardDetail
            SET
                menuStage = ?,
                detail = ?,
                budget = ?
            WHERE idCardDetail = ?`,
            [
                menuStage,
                detail,
                budget,
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
            "DELETE FROM cardDetail WHERE idCardDetail = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new CardDetailModel();