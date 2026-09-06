import notificationModel from "../models/notification.model.js";
import usuarioModel from "../models/usuario.model.js";
import prisma from "../lib/prisma.js";

class NotificationService {

    async getByUser(idUsuario) {
        return await notificationModel.getByUser(idUsuario);
    }

    async countUnread(idUsuario) {
        return await notificationModel.countUnread(idUsuario);
    }

    async create({ idUsuario, mensaje, tipo, idContract }) {
        if (!idUsuario) return null;
        return await notificationModel.create({
            idUsuario: Number(idUsuario),
            mensaje,
            tipo,
            idContract: idContract ? Number(idContract) : null
        });
    }

    async notifyAdmins({ mensaje, tipo, idContract }) {
        const admins = await prisma.usuario.findMany({
            where: { rol: "administrador" },
            select: { idUsuario: true }
        });

        for (const admin of admins) {
            await this.create({
                idUsuario: admin.idUsuario,
                mensaje,
                tipo,
                idContract
            });
        }
    }

    async notifyClient({ idCli, mensaje, tipo, idContract }) {
        if (!idCli) return;
        const usuario = await usuarioModel.findByCli(idCli);

        if (!usuario) return;

        await this.create({
            idUsuario: usuario.idUsuario,
            mensaje,
            tipo,
            idContract
        });
    }

    async markAsRead(idNotificacion, idUsuario) {
        return await notificationModel.markAsRead(idNotificacion, idUsuario);
    }

    async markAllAsRead(idUsuario) {
        return await notificationModel.markAllAsRead(idUsuario);
    }
}

export default new NotificationService();
