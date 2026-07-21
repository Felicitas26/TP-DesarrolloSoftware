import tipoSalonService from "../services/tipoSalon.service.js";

class TipoSalonController {

    async getAll(req, res) {

        const lista = await tipoSalonService.getAll();

        return res.status(200).json(lista);

    }

    async getById(req, res) {

        const { id } = req.params;

        const tipoSalon = await tipoSalonService.getById(id);

        if (!tipoSalon) {
            return res.status(404).json({
                error: `Tipo de salón con ID ${id} no encontrado.`
            });
        }

        return res.status(200).json(tipoSalon);

    }

    async create(req, res) {

        const { nombreSalon, cantMinima, cantMaxima } = req.body;

        if (!nombreSalon || cantMinima === undefined || cantMaxima === undefined) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios."
            });
        }

        if (
            isNaN(cantMinima) ||
            isNaN(cantMaxima) ||
            Number(cantMinima) <= 0 ||
            Number(cantMaxima) <= 0
        ) {
            return res.status(400).json({
                error: "Las capacidades deben ser números positivos."
            });
        }

        if (Number(cantMinima) > Number(cantMaxima)) {
            return res.status(400).json({
                error: "La capacidad mínima no puede superar la máxima."
            });
        }

        const nuevo = await tipoSalonService.create(req.body);

        return res.status(201).json(nuevo);

    }

    async update(req, res) {

        const actualizado = await tipoSalonService.update(
            req.params.id,
            req.body
        );

        if (!actualizado) {
            return res.status(404).json({
                error: "Tipo de salón no encontrado."
            });
        }

        return res.status(200).json(actualizado);

    }

    async delete(req, res) {

        const eliminado = await tipoSalonService.delete(req.params.id);

        if (!eliminado) {
            return res.status(404).json({
                error: "Tipo de salón no encontrado."
            });
        }

        return res.status(200).json({
            mensaje: "Tipo de salón eliminado correctamente."
        });

    }

}

export default new TipoSalonController();

