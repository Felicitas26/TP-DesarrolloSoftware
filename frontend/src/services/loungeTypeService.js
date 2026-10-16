import { api } from "./api";
import { LoungeType } from "../models";

export const loungeTypeService = {
    getAll: async () => (await api.get("/api/loungeType")).map(LoungeType.from),
    getById: async (id) => LoungeType.from(await api.get(`/api/loungeType/${id}`)),
    create: (data) => api.post("/api/loungeType", data),
    update: (id, data) => api.put(`/api/loungeType/${id}`, data),
    remove: (id) => api.del(`/api/loungeType/${id}`)
};
