import db from "../../db.js";

class ContractModel {

    async getAll() {
        const [rows] = await db.execute(
            `SELECT *
            FROM contract`
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            `SELECT *
            FROM contract
            WHERE idContract = ?`,
            [id]
        );

        return rows[0];
    }

    async create(contract) {
        const {
            eventStartTime,
            eventEndTime,
            finalValue,
            idReservation
        } = contract;

        const [result] = await db.execute(
            `INSERT INTO contract
            (eventStartTime, eventEndTime, dateContract, finalValue, idReservation)
            VALUES (?, ?, CURDATE(), ?, ?)`,
            [
                eventStartTime,
                eventEndTime,
                finalValue,
                idReservation
            ]
        );

        return {
            idContract: result.insertId,
            eventStartTime,
            eventEndTime,
            dateContract: new Date().toISOString().split("T")[0],
            finalValue,
            idReservation
        };
    }

    async update(id, contract) {
        const {
            eventStartTime,
            eventEndTime,
            finalValue,
            idReservation
        } = contract;

        const [result] = await db.execute(
            `UPDATE contract
            SET eventStartTime = ?,
                eventEndTime = ?,
                finalValue = ?,
                idReservation = ?
            WHERE idContract = ?`,
            [
                eventStartTime,
                eventEndTime,
                finalValue,
                idReservation,
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
            "DELETE FROM contract WHERE idContract = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new ContractModel();