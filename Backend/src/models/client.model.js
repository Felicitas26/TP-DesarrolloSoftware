import db from "../../db.js";

class ClientModel {

    async getAll() {
        const [rows] = await db.execute(
            `SELECT c.*, l.city, l.zipCode
            FROM Client c
            LEFT JOIN location l ON c.idLocation = l.idLocation`
        );

        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute(
            `SELECT c.*, l.city, l.zipCode
            FROM Client c
            LEFT JOIN location l ON c.idLocation = l.idLocation
            WHERE c.idCli = ?`,
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
            idLocation
        } = client;

        const [result] = await db.execute(
            `INSERT INTO Client
            (nameCli, surnameCli, phoneCli, dniCli, emailCli, addressCli, idLocation)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                nameCli,
                surnameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                idLocation
            ]
        );

        return {
            idCli: result.insertId,
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            idLocation
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
            idLocation
        } = client;

        const [result] = await db.execute(
            `UPDATE Client
            SET nameCli = ?,
                surnameCli = ?,
                phoneCli = ?,
                dniCli = ?,
                emailCli = ?,
                addressCli = ?,
                idLocation = ?
            WHERE idCli = ?`,
            [
                nameCli,
                surnameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                idLocation,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(id);
    }

    async updateMe(idCli, client) {
        const {
            nameCli,
            surnameCli,
            phoneCli,
            dniCli,
            emailCli,
            addressCli,
            idLocation
        } = client;

        const [result] = await db.execute(
            `UPDATE Client
            SET nameCli = ?,
                surnameCli = ?,
                phoneCli = ?,
                dniCli = ?,
                emailCli = ?,
                addressCli = ?,
                idLocation = ?
            WHERE idCli = ?`,
            [
                nameCli,
                surnameCli,
                phoneCli,
                dniCli,
                emailCli,
                addressCli,
                idLocation,
                idCli
            ]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return this.getById(idCli);
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
