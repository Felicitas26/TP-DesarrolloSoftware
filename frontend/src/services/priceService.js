import { api } from "./api";

export function priceKey(price) {
    const date = new Date(price.effectiveDate).toISOString().slice(0, 10);
    return `${price.idLoungeType}/${encodeURIComponent(date)}`;
}

export const priceService = {
    getAll: () => api.get("/api/price"),
    getActivo: (idLoungeType, dateEvent) =>
        api.get(`/api/price/activo/${idLoungeType}/${dateEvent}`),
    create: (data) => api.post("/api/price", data),
    update: (key, data) => api.put(`/api/price/${key}`, data),
    remove: (key) => api.del(`/api/price/${key}`)
};
