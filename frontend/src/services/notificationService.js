import { api } from "./api";

export const notificationService = {
    getAll: () => api.get("/api/notificacion"),
    contador: () => api.get("/api/notificacion/contador"),
    marcarTodas: () => api.put("/api/notificacion/marcar-todas"),
    eliminar: (id) => api.del(`/api/notificacion/${id}`)
};
