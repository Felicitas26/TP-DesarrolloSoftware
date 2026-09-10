import prisma from "../src/lib/prisma.js";

const CARD_DETAILS = [
    {
        menuStage: "Stylo Clásico",
        detail: "Ideal para eventos cálidos, familiares y divertidos.",
        budget: 85000.0,
        imageUrl: "/uploads/1789046931098-542569346.jpeg",
        starter: "Picada de fiambres artesanales de la región con selección de quesos duros y blandos, pan de campo y dips caseros.",
        mainCourse: "Pollo relleno de jamón, queso y morrón acompañada de puré rústico o papas españolas.",
        dessert: "Clásico brownie tibio de chocolate amargo coronado con bocha de helado de americana y hilos de frutos rojos."
    },
    {
        menuStage: "Stylo Elegante",
        detail: "Perfecto para bodas de noche o eventos formales.",
        budget: 120000.0,
        imageUrl: "/uploads/1789046958325-822461417.jpeg",
        starter: "Bruschettas de pan de masa madre con salmón ahumado, queso crema alimonado y alcaparras.",
        mainCourse: "Sorrentinos caseros de calabaza y mozzarella con una sutil salsa de crema al verdeo y crocante de almendras tostadas.",
        dessert: "Copa helada de autor con capas de helado de maracuyá, crumble crujiente de almendras y reducción de frutos tropicales."
    },
    {
        menuStage: "Stylo Fest",
        detail: "Pensado especialmente para Fiestas de 15 o celebraciones jóvenes.",
        budget: 95000.0,
        imageUrl: "/uploads/1789046976782-978557305.jpeg",
        starter: "Cazuelitas de rabas crocantes con rodajas de limón y emulsión de alioli suave.",
        mainCourse: "Milanesa napolitana individual de ternera acompañada de una torre de papas fritas rústicas doradas al horno.",
        dessert: "Bombón suizo bañado en chocolate semiamargo con corazón de dulce de leche granizado y lluvia de nueces."
    }
];

async function seed() {
    let inserted = 0;
    let updated = 0;

    for (const card of CARD_DETAILS) {
        const existing = await prisma.cardDetail.findFirst({
            where: { menuStage: card.menuStage }
        });

        const data = {
            detail: card.detail,
            budget: card.budget,
            imageUrl: card.imageUrl,
            starter: card.starter,
            mainCourse: card.mainCourse,
            dessert: card.dessert
        };

        if (existing) {
            await prisma.cardDetail.update({
                where: { idCardDetail: existing.idCardDetail },
                data
            });
            updated++;
        } else {
            await prisma.cardDetail.create({
                data: {
                    menuStage: card.menuStage,
                    ...data
                }
            });
            inserted++;
        }
    }

    console.log(
        `Seed de menús finalizado: ${inserted} insertados, ${updated} actualizados.`
    );

    await prisma.$disconnect();
    process.exit(0);
}

seed().catch(async (err) => {
    console.error("Error al sembrar menús:", err.message);
    await prisma.$disconnect();
    process.exit(1);
});