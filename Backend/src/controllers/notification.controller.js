import notificationService from "../services/notification.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class NotificationController {

    getByUser = asyncHandler(async (req, res) => {
        const notifications = await notificationService.getByUser(
            req.usuario.idUsuario
        );
        const unread = await notificationService.countUnread(
            req.usuario.idUsuario
        );
        return res.status(200).json({ notifications, unread });
    });

    countUnread = asyncHandler(async (req, res) => {
        const unread = await notificationService.countUnread(
            req.usuario.idUsuario
        );
        return res.status(200).json({ unread });
    });

    markAsRead = asyncHandler(async (req, res) => {
        const result = await notificationService.markAsRead(
            req.params.id,
            req.usuario.idUsuario
        );
        return res.status(200).json({ ok: Boolean(result?.count) });
    });

    markAllAsRead = asyncHandler(async (req, res) => {
        await notificationService.markAllAsRead(req.usuario.idUsuario);
        return res.status(200).json({ ok: true });
    });

    remove = asyncHandler(async (req, res) => {
        const result = await notificationService.remove(
            req.params.id,
            req.usuario.idUsuario
        );
        return res.status(200).json({ ok: Boolean(result?.count) });
    });
}

export default new NotificationController();
