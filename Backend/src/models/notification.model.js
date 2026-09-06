import prisma from "../lib/prisma.js";

class NotificationModel {

    async getByUser(idUsuario) {
        return await prisma.notification.findMany({
            where: { idUsuario: Number(idUsuario) },
            orderBy: { fecha: "desc" },
            take: 50,
            include: {
                contract: {
                    select: {
                        idContract: true,
                        status: true
                    }
                }
            }
        });
    }

    async countUnread(idUsuario) {
        return await prisma.notification.count({
            where: { idUsuario: Number(idUsuario), leida: false }
        });
    }

    async create({ idUsuario, mensaje, tipo, idContract }) {
        return await prisma.notification.create({
            data: {
                idUsuario,
                mensaje,
                tipo,
                idContract: idContract ?? null
            }
        });
    }

    async markAsRead(idNotificacion, idUsuario) {
        try {
            return await prisma.notification.updateMany({
                where: { idNotificacion: Number(idNotificacion), idUsuario: Number(idUsuario) },
                data: { leida: true }
            });
        } catch {
            return null;
        }
    }

    async markAllAsRead(idUsuario) {
        return await prisma.notification.updateMany({
            where: { idUsuario: Number(idUsuario), leida: false },
            data: { leida: true }
        });
    }
}

export default new NotificationModel();
