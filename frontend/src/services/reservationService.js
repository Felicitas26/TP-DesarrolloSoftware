import { api } from "./api";

export const reservationService = {
    getAll: () => api.get("/api/reservation"),
    getMine: () => api.get("/api/reservation/mis-reservas"),
    getById: (id) => api.get(`/api/reservation/${id}`),
    create: (data) => api.post("/api/reservation", data),
    update: (id, data) => api.put(`/api/reservation/${id}`, data),
    updateStatus: (id, data) => api.put(`/api/reservation/${id}/status`, data),
    remove: (id, data) => api.del(`/api/reservation/${id}`, data)
};
