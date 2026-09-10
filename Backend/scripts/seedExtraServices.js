import prisma from "../src/lib/prisma.js";

const EXTRA_SERVICES = [
    {
        nameService: "DJ",
        detailService: "Servicio de música y animación durante el evento",
        cost: 50000.0
    },
    {
        nameService: "Fotografía",
        detailService: "Servicio de fotografía profesional durante el evento",
        cost: 40000.0
    },
    {
        nameService: "Decoración",
        detailService: "Decoración temática del salón",
        cost: 35000.0
    },
    {
        nameService: "Catering",
        detailService: "Servicio adicional de comida y bebidas",
        cost: 60000.0
    },
    {
        nameService: "Sonido e iluminación",
        detailService: "Equipamiento profesional de sonido e iluminación",
        cost: 45000.0
    },
    {
        nameService: "Pantalla y proyector",
        detailService: "Pantalla y proyector para presentaciones o videos",
        cost: 30000.0
    }
];

async function seed() {
    let inserted = 0;
    let skipped = 0;

    for (const svc of EXTRA_SERVICES) {
        const existing = await prisma.extraService.findFirst({
            where: { nameService: svc.nameService }
        });

        if (existing) {
            skipped++;
            continue;
        }

        await prisma.extraService.create({
            data: {
                nameService: svc.nameService,
                detailService: svc.detailService,
                cost: svc.cost
            }
        });
        inserted++;
    }

    console.log(
        `Seed de servicios extra finalizado: ${inserted} insertados, ${skipped} omitidos (ya existían).`
    );

    await prisma.$disconnect();
    process.exit(0);
}

seed().catch(async (err) => {
    console.error("Error al sembrar servicios extra:", err.message);
    await prisma.$disconnect();
    process.exit(1);
});