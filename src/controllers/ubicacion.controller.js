import ubicacionService from "../services/ubicacion.service.js";

class UbicacionController {

    async getAll(req, res) {

        const lista = await ubicacionService.getAll();

        return res.status(200).json(lista);

    }

    async getById(req, res) {

        const { id } = req.params;

        const ubicacion = await ubicacionService.getById(id);

        if (!ubicacion) {
            return res.status(404).json({
                error: `Ubicación con ID ${id} no encontrada.`
            });
        }

        return res.status(200).json(ubicacion);

    }

    async create(req, res) {

        const { localidad, codigoPostal } = req.body;

        if (!localidad || !codigoPostal) {
            return res.status(400).json({
                error: "Todos los campos (localidad y codigoPostal) son obligatorios."
            });
        }

        const nuevaUbicacion = await ubicacionService.create(req.body);

        return res.status(201).json(nuevaUbicacion);

    }

    async update(req, res) {

        const { id } = req.params;

        const ubicacionActualizada = await ubicacionService.update(id, req.body);

        if (!ubicacionActualizada) {
            return res.status(404).json({
                error: `No se encontró la ubicación con ID ${id} para actualizar.`
            });
        }

        return res.status(200).json(ubicacionActualizada);

    }

    async delete(req, res) {

        const { id } = req.params;

        const eliminado = await ubicacionService.delete(id);

        if (!eliminado) {
            return res.status(404).json({
                error: `No se encontró la ubicación con ID ${id} para eliminar.`
            });
        }

        return res.status(200).json({
            message: `Ubicación con ID ${id} eliminada exitosamente.`
        });

    }

}

export default new UbicacionController();
