import loungeTypeService from "../services/loungeType.service.js";

class LoungeTypeController {

    async getAll(req, res) {

        const list = await loungeTypeService.getAll();

        return res.status(200).json(list);

    }

    async getById(req, res) {

        const { id } = req.params;

        const loungeType = await loungeTypeService.getById(id);

        if (!loungeType) {
            return res.status(404).json({
                error: `Tipo de salón con ID ${id} no encontrado.`
            });
        }

        return res.status(200).json(loungeType);

    }

    async create(req, res) {

        const { nameLounge, minQuantity, maxQuantity } = req.body;

        if (!nameLounge || minQuantity === undefined || maxQuantity === undefined) {
            return res.status(400).json({
                error: "Todos los campos son obligatorios."
            });
        }

        if (
            isNaN(minQuantity) ||
            isNaN(maxQuantity) ||
            Number(minQuantity) <= 0 ||
            Number(maxQuantity) <= 0
        ) {
            return res.status(400).json({
                error: "Las capacidades deben ser números positivos."
            });
        }

        if (Number(minQuantity) > Number(maxQuantity)) {
            return res.status(400).json({
                error: "La capacidad mínima no puede superar la máxima."
            });
        }

        const newL = await loungeTypeService.create(req.body);

        return res.status(201).json(newL);

    }

    async update(req, res) {

        const updated = await loungeTypeService.update(
            req.params.id,
            req.body
        );

        if (!updated) {
            return res.status(404).json({
                error: "Tipo de salón no encontrado."
            });
        }

        return res.status(200).json(updated);

    }

    async delete(req, res) {

        const deleted = await loungeStyleService.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                error: "Tipo de salón no encontrado."
            });
        }

        return res.status(200).json({
            message: "Tipo de salón eliminado correctamente."
        });

    }

}

export default new loungeTypeController();

