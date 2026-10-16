import { api } from "./api";

export const paymentService = {
    update: (id, data) => api.put(`/api/payment/${id}`, data)
};
