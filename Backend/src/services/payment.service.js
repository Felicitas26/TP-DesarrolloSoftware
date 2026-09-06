import db from "../config/db.js";

class PaymentService {

    async getAll() {
        const [payments] = await db.query(
            "SELECT * FROM payment"
        );

        return payments;
    }

    async getById(id) {
        const [payments] = await db.query(
            "SELECT * FROM payment WHERE idPayment = ?",
            [id]
        );

        if (payments.length === 0) {
            const error = new Error("Pago no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        return payments[0];
    }

    async create(data) {
        const {
            value,
            statusPayment,
            datePayment,
            idContract
        } = data;

        const [result] = await db.query(
            `INSERT INTO payment
            (value, statusPayment, datePayment, idContract)
            VALUES (?, ?, ?, ?)`,
            [
                value,
                statusPayment,
                datePayment,
                idContract
            ]
        );

        return await this.getById(result.insertId);
    }

    async update(id, data) {
        await this.getById(id);

        const {
            value,
            statusPayment,
            datePayment,
            idContract
        } = data;

        await db.query(
            `UPDATE payment
            SET value = ?,
                statusPayment = ?,
                datePayment = ?,
                idContract = ?
            WHERE idPayment = ?`,
            [
                value,
                statusPayment,
                datePayment,
                idContract,
                id
            ]
        );

        return await this.getById(id);
    }

    async delete(id) {
        await this.getById(id);

        await db.query(
            "DELETE FROM payment WHERE idPayment = ?",
            [id]
        );

        return true;
    }
}

export default new PaymentService();
