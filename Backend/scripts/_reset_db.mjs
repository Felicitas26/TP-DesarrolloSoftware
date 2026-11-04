// Reset de datos: vacía las 14 tablas (mantiene el esquema) y deja los ids desde 1.
// Uso: node scripts/_reset_db.mjs
import prisma from "../src/lib/prisma.js";

const tables = [
    "Notification",
    "ReservationExtraService",
    "ContractExtraService",
    "Payment",
    "Contract",
    "Reservation",
    "Price",
    "LoungeType",
    "Lounge",
    "Client",
    "Usuario",
    "Location",
    "CardDetail",
    "ExtraService"
];

await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0");
for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\``);
    console.log(`truncada: ${table}`);
}
await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1");

await prisma.$disconnect();
console.log("OK - base de datos vacía");
