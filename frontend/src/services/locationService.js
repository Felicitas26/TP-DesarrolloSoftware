import { api } from "./api";

export const locationService = {
    getAll: () => api.get("/api/locations")
};
