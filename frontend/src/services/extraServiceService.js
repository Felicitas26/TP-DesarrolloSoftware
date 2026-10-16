import { api } from "./api";

export const extraServiceService = {
    getAll: () => api.get("/api/extraService"),
    create: (data) => api.post("/api/extraService", data),
    update: (id, data) => api.put(`/api/extraService/${id}`, data),
    remove: (id) => api.del(`/api/extraService/${id}`)
};
