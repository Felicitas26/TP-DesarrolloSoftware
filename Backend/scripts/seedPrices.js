import prisma from "../src/lib/prisma.js";

const PRICES = [
    { nameLoungeType: "Grande", value: 1200000 },
    { nameLoungeType: "Chico", value: 1500000 }
];

const EFFECTIVE_DATE = "2026-01-01";

async function seed() {
    const loungeTypes = await prisma.loungeType.findMany({
        select: { idLoungeType: true, nameLoungeType: true, idLounge: true }
    });

    let inserted = 0;
    const skipped = [];

    for (const price of PRICES) {
        const loungeType = loungeTypes.find(
            (lt) => lt.nameLoungeType === price.nameLoungeType
        );

        if (!loungeType) {
            skipped.push(`Tipo de salón "${price.nameLoungeType}" inexistente`);
            continue;
        }

        const existing = await prisma.price.findUnique({
            where: {
                effectiveDate_idLoungeType: {
                    effectiveDate: new Date(EFFECTIVE_DATE),
                    idLoungeType: loungeType.idLoungeType
                }
            }
        });

        if (existing) {
            skipped.push(`Precio del tipo de salón "${price.nameLoungeType}" ya existe`);
            continue;
        }

        await prisma.price.create({
            data: {
                effectiveDate: new Date(EFFECTIVE_DATE),
                endDate: null,
                value: price.value,
                idLoungeType: loungeType.idLoungeType
            }
        });
        inserted++;
    }

    console.log(
        `Seed de precios finalizado: ${inserted} insertados, ${skipped.length} omitidos.`
    );
    if (skipped.length > 0) {
        skipped.forEach((reason) => console.log(`  - ${reason}`));
    }

    await prisma.$disconnect();
    process.exit(0);
}

seed().catch(async (err) => {
    console.error("Error al sembrar precios:", err.message);
    await prisma.$disconnect();
    process.exit(1);
});