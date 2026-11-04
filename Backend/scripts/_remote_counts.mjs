// Verificación rápida contra la DB remota (usa la DATABASE_URL del entorno).
import prisma from "../src/lib/prisma.js";

const tables = ["Location", "Lounge", "LoungeType", "CardDetail", "ExtraService", "Usuario", "Client", "Price", "Reservation", "Contract", "Payment", "Notification"];

for (const table of tables) {
    const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS n FROM \`${table}\``);
    console.log(`${table}: ${rows[0].n}`);
}

const activos = await prisma.$queryRawUnsafe("SELECT COUNT(*) AS n FROM `Lounge` WHERE `activo` = true");
console.log(`Lounge activo=true: ${activos[0].n}`);

await prisma.$disconnect();
