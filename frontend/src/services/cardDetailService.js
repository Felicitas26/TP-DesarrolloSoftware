import { api } from "./api";
import { CardDetail } from "../models";

export const cardDetailService = {
    getAll: async () => (await api.get("/api/cardDetail")).map(CardDetail.from),
    getById: async (id) => CardDetail.from(await api.get(`/api/cardDetail/${id}`)),
    create: (formData) => api.upload("/api/cardDetail", formData),
    update: (id, formData) => api.upload(`/api/cardDetail/${id}`, formData, "PUT"),
    remove: (id) => api.del(`/api/cardDetail/${id}`)
};
