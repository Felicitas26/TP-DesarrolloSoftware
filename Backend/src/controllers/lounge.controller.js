import loungeService from "../services/lounge.service.js";

class LoungeController {

    async getAll(req, res) {
        try {
            const list = await loungeService.getAll();
            return res.status(200).json(list);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const lounge = await loungeService.getById(req.params.id);
            return res.status(200).json(lounge);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newLounge = await loungeService.create(req.body);
            return res.status(201).json(newLounge);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedLounge = await loungeService.update(req.params.id, req.body);
            return res.status(200).json(updatedLounge);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await loungeService.delete(req.params.id);
            return res.status(200).json({ message: "Salón eliminado exitosamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

}

export default new LoungeController();
