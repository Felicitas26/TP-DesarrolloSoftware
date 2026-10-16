import { api } from "./api";
import { ExtraService } from "../models";

export const extraServiceService = {
    getAll: async () => (await api.get("/api/extraService")).map(ExtraService.from),
    create: (data) => api.post("/api/extraService", data),
    update: (id, data) => api.put(`/api/extraService/${id}`, data),
    remove: (id) => api.del(`/api/extraService/${id}`)
};
