export const SESSION_KEYS = {
    token: "sty_token",
    rol: "sty_rol",
    idUsuario: "sty_idUsuario",
    idCli: "sty_idCli"
};

export const ROLES = {
    administrador: "administrador",
    cliente: "cliente"
};

export function getToken() {
    return localStorage.getItem(SESSION_KEYS.token);
}

export function getRol() {
    return localStorage.getItem(SESSION_KEYS.rol) || "";
}

export function getIdUsuario() {
    return localStorage.getItem(SESSION_KEYS.idUsuario) || "";
}

export function getIdCli() {
    return localStorage.getItem(SESSION_KEYS.idCli) || "";
}

export function isAuthenticated() {
    return Boolean(getToken());
}

export function hasRole(roles = []) {
    if (roles.length === 0) return true;
    return roles.includes(getRol());
}

export function saveSession(data = {}) {
    if (data.token) localStorage.setItem(SESSION_KEYS.token, data.token);
    localStorage.setItem(SESSION_KEYS.rol, data.rol || "");
    localStorage.setItem(SESSION_KEYS.idUsuario, data.idUsuario || "");
    localStorage.setItem(SESSION_KEYS.idCli, data.idCli || "");
}

export function clearSession() {
    Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function homeForRol(rol = getRol()) {
    if (rol === ROLES.administrador) return "/admin-home";
    if (rol === ROLES.cliente) return "/client-home";
    return "/login";
}
