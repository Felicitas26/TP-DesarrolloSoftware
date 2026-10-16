import { api } from "./api";

export const loungeService = {
    getAll: () => api.get("/api/lounge"),
    getById: (id) => api.get(`/api/lounge/${id}`),
    create: (data) => api.post("/api/lounge", data),
    update: (id, data) => api.put(`/api/lounge/${id}`, data),
    remove: (id) => api.del(`/api/lounge/${id}`)
};
