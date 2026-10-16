import { api } from "./api";

export const clientService = {
    getAll: () => api.get("/api/client"),
    getById: (id) => api.get(`/api/client/${id}`),
    getMe: () => api.get("/api/client/me"),
    checkEmail: (email) =>
        api.get(`/api/client/check-email?email=${encodeURIComponent(email)}`),
    create: (data) => api.post("/api/client", data),
    update: (id, data) => api.put(`/api/client/${id}`, data),
    updateMe: (data) => api.put("/api/client/me", data),
    remove: (id) => api.del(`/api/client/${id}`)
};
