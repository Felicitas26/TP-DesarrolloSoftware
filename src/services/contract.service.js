import db from "../../db.js";

class ContractService {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM Contract"
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM Contract WHERE idContract = ?",
            [id]
        );

        return rows[0];
    }

    async create(contract) {
        const {
            eventStartTime,
            eventEndTime,
            dateContract,
            finalValue
        } = contract;

        const [result] = await db.execute(
            `INSERT INTO Contract
            (eventStartTime, eventEndTime, dateContract, finalValue)
            VALUES (?, ?, ?, ?)`,
            [
                eventStartTime,
                eventEndTime,
                dateContract,
                finalValue
            ]
        );

        return {
            idContract: result.insertId,
            eventStartTime,
            eventEndTime,
            dateContract,
            finalValue
        };
    }

    async update(id, contract) {
        const {
            eventStartTime,
            eventEndTime,
            dateContract,
            finalValue
        } = contract;

        const [result] = await db.execute(
            `UPDATE Contract
            SET eventStartTime = ?,
                eventEndTime = ?,
                dateContract = ?,
                finalValue = ?
            WHERE idContract = ?`,
            [
                eventStartTime,
                eventEndTime,
                dateContract,
                finalValue,
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
            "DELETE FROM Contract WHERE idContract = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new ContractService();

