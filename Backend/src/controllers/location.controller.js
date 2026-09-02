import locationService from "../services/location.service.js";

class LocationController {

    async getAll(req, res) {
        try {
            const list = await locationService.getAll();
            return res.status(200).json(list);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const location = await locationService.getById(req.params.id);
            return res.status(200).json(location);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newLocation = await locationService.create(req.body);
            return res.status(201).json(newLocation);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedLocation = await locationService.update(req.params.id, req.body);
            return res.status(200).json(updatedLocation);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await locationService.delete(req.params.id);
            return res.status(200).json({ message: "Ubicación eliminada exitosamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

}

export default new LocationController();
