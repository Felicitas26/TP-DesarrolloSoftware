import locationService from "../services/location.service.js";

class LocationController {

    async getAll(req, res) {

        const list = await locationService.getAll();

        return res.status(200).json(list);

    }

    async getById(req, res) {

        const { id } = req.params;

        const location = await locationService.getById(id);

        if (!location) {
            return res.status(404).json({
                error: `Ubicación con ID ${id} no encontrada.`
            });
        }

        return res.status(200).json(location);

    }

    async create(req, res) {

        const { location, zipCode } = req.body;

        if (!location || !zipCode) {
            return res.status(400).json({
                error: "Todos los campos (localidad y codigoPostal) son obligatorios."
            });
        }

        const newLocation = await locationService.create(req.body);

        return res.status(201).json(newLocation);

    }

    async update(req, res) {

        const { id } = req.params;

        const UpdatedLocation = await locationService.update(id, req.body);

        if (!UpdatedLocation) {
            return res.status(404).json({
                error: `No se encontró la ubicación con ID ${id} para actualizar.`
            });
        }

        return res.status(200).json(UpdatedLocation);

    }

    async delete(req, res) {

        const { id } = req.params;

        const deleted = await locationService.delete(id);

        if (!deleted) {
            return res.status(404).json({
                error: `No se encontró la ubicación con ID ${id} para eliminar.`
            });
        }

        return res.status(200).json({
            message: `Ubicación con ID ${id} eliminada exitosamente.`
        });

    }

}

export default new LocationController();
