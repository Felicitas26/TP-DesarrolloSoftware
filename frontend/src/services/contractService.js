import { api } from "./api";

export const contractService = {
    getAll: () => api.get("/api/contract"),
    getMine: () => api.get("/api/contract/mis-contratos"),
    getById: (id) => api.get(`/api/contract/${id}`),
    revision: (id, data) => api.put(`/api/contract/${id}/revision`, data),
    update: (id, data) => api.put(`/api/contract/${id}`, data),
    updateEdit: (id, data) => api.put(`/api/contract/${id}/edit`, data),
    remove: (id, data) => api.del(`/api/contract/${id}`, data),
    enviar: (id) => api.post(`/api/contract/${id}/enviar`),
    aceptar: (id) => api.post(`/api/contract/${id}/aceptar`),
    solicitarModificacion: (id, data) =>
        api.put(`/api/contract/${id}/modificacion`, data),
    revisarModificacion: (id, data) =>
        api.put(`/api/contract/${id}/modificacion/revision`, data),
    resolverModificacion: (id, data) =>
        api.post(`/api/contract/${id}/modificacion/rechazo`, data)
};
