import { api } from "./api";

export const loungeTypeService = {
    getAll: () => api.get("/api/loungeType"),
    getById: (id) => api.get(`/api/loungeType/${id}`),
    create: (data) => api.post("/api/loungeType", data),
    update: (id, data) => api.put(`/api/loungeType/${id}`, data),
    remove: (id) => api.del(`/api/loungeType/${id}`)
};
