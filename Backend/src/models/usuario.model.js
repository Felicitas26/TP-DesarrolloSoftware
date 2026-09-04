import db from "../../db.js";

class UsuarioModel {

    async findById(id) {
        const [rows] = await db.execute(
            `SELECT u.idUsuario,
                    u.username,
                    u.password,
                    u.rol,
                    u.idCli,
                    u.passwordTemporal,
                    c.nameCli,
                    c.surnameCli,
                    c.dniCli,
                    c.emailCli,
                    c.phoneCli,
                    c.addressCli
             FROM usuario u
             LEFT JOIN client c ON c.idCli = u.idCli
             WHERE u.idUsuario = ?`,
            [id]
        );

        return rows[0];
    }

    async findByUsername(username) {
        const [rows] = await db.execute(
            "SELECT * FROM usuario WHERE username = ?",
            [username]
        );

        return rows[0];
    }

    async findByDni(dni) {
        const [rows] = await db.execute(
            "SELECT * FROM client WHERE dniCli = ?",
            [dni]
        );

        return rows[0];
    }

    async findByCli(idCli) {
        const [rows] = await db.execute(
            "SELECT * FROM usuario WHERE idCli = ?",
            [idCli]
        );

        return rows[0];
    }

    async create({ username, password, rol, idCli, passwordTemporal }) {
        const [result] = await db.execute(
            `INSERT INTO usuario
            (username, password, rol, idCli, passwordTemporal)
            VALUES (?, ?, ?, ?, ?)`,
            [
                username,
                password,
                rol,
                idCli ?? null,
                passwordTemporal === undefined ? 1 : passwordTemporal
            ]
        );

        return this.findById(result.insertId);
    }

    async updatePassword(id, passwordHash) {
        await db.execute(
            `UPDATE usuario
             SET password = ?, passwordTemporal = 0
             WHERE idUsuario = ?`,
            [passwordHash, id]
        );

        return this.findById(id);
    }

    async delete(id) {
        const [result] = await db.execute(
            "DELETE FROM usuario WHERE idUsuario = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        return true;
    }

    // ADMINISTRADORES

    async getAllAdministradores() {
        const [rows] = await db.execute(
            `SELECT idUsuario,
                    username,
                    rol,
                    passwordTemporal
             FROM usuario
             WHERE rol = 'administrador'`
        );

        return rows;
    }

    async updateAdministrador(id, { username, password }) {

        if (password) {
            const [result] = await db.execute(
                `UPDATE usuario
                 SET username = ?,
                     password = ?
                 WHERE idUsuario = ?
                 AND rol = 'administrador'`,
                [username, password, id]
            );

            if (result.affectedRows === 0) {
                return null;
            }
        } else {
            const [result] = await db.execute(
                `UPDATE usuario
                 SET username = ?
                 WHERE idUsuario = ?
                 AND rol = 'administrador'`,
                [username, id]
            );

            if (result.affectedRows === 0) {
                return null;
            }
        }

        return this.findById(id);
    }
}

export default new UsuarioModel();