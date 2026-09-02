import db from "../db.js";
import bcrypt from "bcryptjs";

const ADMINS = [
    {
        username: "admin",
        password: "admin123",
        rol: "administrador"
    }
];

const SALT_ROUNDS = 10;

async function seed() {
    for (const admin of ADMINS) {
        const [existing] = await db.execute(
            "SELECT idUsuario FROM usuario WHERE username = ?",
            [admin.username]
        );

        if (existing.length > 0) {
            console.log(`El administrador "${admin.username}" ya existe. Se omite.`);
            continue;
        }

        const hashed = await bcrypt.hash(admin.password, SALT_ROUNDS);

        await db.execute(
            `INSERT INTO usuario (username, password, rol, idCli, passwordTemporal)
             VALUES (?, ?, ?, NULL, 0)`,
            [admin.username, hashed, admin.rol]
        );

        console.log(`Administrador "${admin.username}" creado correctamente.`);
    }

    console.log("Seed de usuarios finalizado.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Error al sembrar usuarios:", err.message);
    process.exit(1);
});
