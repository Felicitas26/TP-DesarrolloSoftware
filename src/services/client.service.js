import db from "../../db.js";

class ClientService {

    async getAll() {
        const [rows] = await db.execute(
            "SELECT * FROM Client"
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM Client WHERE idCli = ?",
            [id]
        );

        return rows[0];
    }

    async create(client) {
        const {
            nameCli,
            lastNameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            localityCli
        } = client;

        const [result] = await db.execute(
            `INSERT INTO Client
            (nameCli, lastNameCli, phoneCli, dniCli, emailCli, addressCli, localityCli)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nameCli,
                lastNameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                localityCli
            ]
        );

        return {
            idCli: result.insertId,
            nameCli,
            lastNameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            localityCli
        };
    }

    async update(id, client) {
        const {
            nameCli,
            lastNameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            localityCli
        } = client;

        const [result] = await db.execute(
            `UPDATE Client
            SET nameCli = ?,
                lastNameCli = ?,
                phoneCli = ?,
                dniCli = ?,
                emailCli = ?,
                addressCli = ?,
                localityCli = ?
            WHERE idCli = ?`,
            [
                nameCli,
                lastNameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                localityCli,
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
            "DELETE FROM Client WHERE idCli = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }
}

export default new ClientService();
