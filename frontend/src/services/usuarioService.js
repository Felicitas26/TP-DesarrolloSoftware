import { api } from "./api";

export const usuarioService = {
    getAdministradores: async () => api.get("/api/usuario/administradores"),
    createAdministrador: (data) => api.post("/api/usuario/administradores", data),
    updateAdministrador: (id, data) => api.put(`/api/usuario/administradores/${id}`, data),
    removeAdministrador: (id) => api.del(`/api/usuario/administradores/${id}`),
    getDesactivados: async () => api.get("/api/usuario/desactivados"),
    reactivar: (id) => api.put(`/api/usuario/reactivar/${id}`)
};
