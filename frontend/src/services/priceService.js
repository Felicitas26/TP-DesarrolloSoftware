import { api } from "./api";
import { Price } from "../models";

export const priceKey = (price) => Price.key(price);

export const priceService = {
    getAll: async () => (await api.get("/api/price")).map(Price.from),
    getActivo: async (idLoungeType, dateEvent) => {
        const data = await api.get(`/api/price/activo/${idLoungeType}/${dateEvent}`);
        return data ? Price.from(data) : null;
    },
    create: (data) => api.post("/api/price", data),
    update: (key, data) => api.put(`/api/price/${key}`, data),
    remove: (key) => api.del(`/api/price/${key}`)
};
