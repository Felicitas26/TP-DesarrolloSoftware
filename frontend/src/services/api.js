const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function getToken() {
    return localStorage.getItem("sty_token");
}

async function handleResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        const error = new Error(
            (data && (data.error || data.message)) ||
                "Ocurrió un error al comunicarse con el servidor."
        );
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

export async function request(path, { method = "GET", body, isForm = false } = {}) {
    const token = getToken();

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined
    });

    return handleResponse(response);
}

export const api = {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, { method: "POST", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    del: (path, body) => request(path, { method: "DELETE", body }),
    upload: (path, formData, method = "POST") =>
        request(path, { method, body: formData, isForm: true })
};

export function buildAssetUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_URL}${path}`;
}

export { API_URL };
