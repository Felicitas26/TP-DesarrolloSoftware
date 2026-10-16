import { api } from "./api";

export const cardDetailService = {
    getAll: () => api.get("/api/cardDetail"),
    getById: (id) => api.get(`/api/cardDetail/${id}`),
    create: (formData) => api.upload("/api/cardDetail", formData),
    update: (id, formData) => api.upload(`/api/cardDetail/${id}`, formData, "PUT"),
    remove: (id) => api.del(`/api/cardDetail/${id}`)
};
