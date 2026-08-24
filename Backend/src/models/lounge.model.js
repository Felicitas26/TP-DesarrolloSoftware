import db from "../../db.js";

class LoungeModel {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM Lounge"
        );
        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM Lounge WHERE idLounge = ?",
            [id]
        );
        return rows[0];
    }

    async create(lounge) {
        const {
            name,
            loungeAddress,
            idtypeLounge
        } = lounge;

        const [result] = await db.execute(
            `INSERT INTO Lounge
            (name, loungeAddress, idtypeLounge)
            VALUES (?, ?, ?)`,
            [
                name,
                loungeAddress,
                idtypeLounge
            ]
        );

        return {
            idLounge: result.insertId,
            name,
            loungeAddress,
            idtypeLounge
        };
    }

    async update(id, lounge) {
        const {
            name,
            loungeAddress,
            idtypeLounge
        } = lounge;

        const [result] = await db.execute(
            `UPDATE Lounge
            SET name = ?,
                loungeAddress = ?,
                idtypeLounge = ?
            WHERE idLounge = ?`,
            [
                name,
                loungeAddress,
                idtypeLounge,
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
            "DELETE FROM Lounge WHERE idLounge = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new LoungeModel();
