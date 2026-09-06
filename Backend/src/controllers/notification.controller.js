import notificationService from "../services/notification.service.js";

class NotificationController {

    async getByUser(req, res) {
        try {
            const notifications = await notificationService.getByUser(
                req.usuario.idUsuario
            );
            const unread = await notificationService.countUnread(
                req.usuario.idUsuario
            );
            return res.status(200).json({ notifications, unread });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async countUnread(req, res) {
        try {
            const unread = await notificationService.countUnread(
                req.usuario.idUsuario
            );
            return res.status(200).json({ unread });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async markAsRead(req, res) {
        try {
            const result = await notificationService.markAsRead(
                req.params.id,
                req.usuario.idUsuario
            );
            return res.status(200).json({ ok: Boolean(result?.count) });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async markAllAsRead(req, res) {
        try {
            await notificationService.markAllAsRead(req.usuario.idUsuario);
            return res.status(200).json({ ok: true });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new NotificationController();
