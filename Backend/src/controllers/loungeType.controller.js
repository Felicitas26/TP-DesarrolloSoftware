import loungeTypeService from "../services/loungeType.service.js";

class LoungeTypeController {

    async getAll(req, res) {
        try {
            const list = await loungeTypeService.getAll();
            return res.status(200).json(list);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const loungeType = await loungeTypeService.getById(req.params.id);
            return res.status(200).json(loungeType);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newL = await loungeTypeService.create(req.body);
            return res.status(201).json(newL);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updated = await loungeTypeService.update(req.params.id, req.body);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await loungeTypeService.delete(req.params.id);
            return res.status(200).json({ message: "Tipo de salón eliminado correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

}

export default new LoungeTypeController();
