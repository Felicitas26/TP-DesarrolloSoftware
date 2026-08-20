import db from "../../db.js";

class ClientModel {

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
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            cityCli
        } = client;

        const [result] = await db.execute(
            `INSERT INTO Client
            (nameCli, surnameCli, phoneCli, dniCli, emailCli, addressCli, cityCli)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nameCli,
                surnameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                cityCli
            ]
        );

        return {
            dniCli: result.insertId,
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            cityCli
        };
    }

    async update(id, client) {
        const {
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            cityCli
        } = client;

        const [result] = await db.execute(
            `UPDATE Client
            SET nameCli = ?,
                surnameCli = ?,
                phoneCli = ?,
                dniCli = ?,
                emailCli = ?,
                addressCli = ?,
                cityCli = ?
            WHERE idCli = ?`,
            [
                nameCli,
                surnameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                cityCli,
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

export default new ClientModel();
