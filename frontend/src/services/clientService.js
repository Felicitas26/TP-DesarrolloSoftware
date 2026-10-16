import { api } from "./api";
import { Client } from "../models";

export const clientService = {
    getAll: async () => (await api.get("/api/client")).map(Client.from),
    getById: async (id) => Client.from(await api.get(`/api/client/${id}`)),
    getMe: async () => Client.from(await api.get("/api/client/me")),
    checkEmail: (email) =>
        api.get(`/api/client/check-email?email=${encodeURIComponent(email)}`),
    create: (data) => api.post("/api/client", data),
    update: (id, data) => api.put(`/api/client/${id}`, data),
    updateMe: (data) => api.put("/api/client/me", data),
    remove: (id) => api.del(`/api/client/${id}`)
};
