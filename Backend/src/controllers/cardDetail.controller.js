import cardDetailService from "../services/cardDetail.service.js";

class CardDetailController {

    async getAll(req, res) {
        try {
            const cardDetail = await cardDetailService.getAll();
            return res.status(200).json(cardDetail);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const cardDetail = await cardDetailService.getById(req.params.id);
            return res.status(200).json(cardDetail);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newcardDetail = await cardDetailService.create(req.body);
            return res.status(201).json(newcardDetail);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const cardDetailUpdated = await cardDetailService.update(req.params.id, req.body);
            return res.status(200).json({
                message: "Detalle de Tarjeta actualizado correctamente.",
                datailC: cardDetailUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await cardDetailService.delete(req.params.id);
            return res.status(200).json({ message: "Detalle de Tarjeta eliminado correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

}

export default new CardDetailController();
