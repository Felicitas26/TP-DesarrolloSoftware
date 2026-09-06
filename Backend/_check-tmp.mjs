import prisma from "./src/lib/prisma.js";

const lt = await prisma.loungeType.findMany({
    select: {
        idLoungeType: true,
        nameLoungeType: true,
        minQuantity: true,
        maxQuantity: true,
        idLounge: true,
        lounge: { select: { name: true } }
    }
});
console.log("LOUNGE_TYPES", JSON.stringify(lt, null, 2));

const prices = await prisma.price.findMany();
console.log("PRICES", JSON.stringify(prices, null, 2));

await prisma.$disconnect();