import { api } from "./api";
import { Lounge } from "../models";

export const loungeService = {
    getAll: async () => (await api.get("/api/lounge")).map(Lounge.from),
    getById: async (id) => Lounge.from(await api.get(`/api/lounge/${id}`)),
    create: (data) => api.post("/api/lounge", data),
    update: (id, data) => api.put(`/api/lounge/${id}`, data),
    remove: (id) => api.del(`/api/lounge/${id}`)
};
