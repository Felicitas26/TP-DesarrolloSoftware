import { api } from "./api";
import { Reservation } from "../models";

const hydrate = (data) =>
    Array.isArray(data) ? data.map(Reservation.from) : Reservation.from(data);

export const reservationService = {
    getAll: async () => hydrate(await api.get("/api/reservation")),
    getMine: async () => hydrate(await api.get("/api/reservation/mis-reservas")),
    getById: async (id) => hydrate(await api.get(`/api/reservation/${id}`)),
    create: (data) => api.post("/api/reservation", data),
    update: (id, data) => api.put(`/api/reservation/${id}`, data),
    updateStatus: (id, data) => api.put(`/api/reservation/${id}/status`, data),
    remove: (id, data) => api.del(`/api/reservation/${id}`, data)
};
