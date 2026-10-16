import { api } from "./api";

export const authService = {
    login: (credenciales) => api.post("/api/auth/login", credenciales),
    resetPassword: (data) => api.post("/api/auth/reset-password", data),
    changePassword: (data) => api.put("/api/usuario/cambiar-password", data)
};
