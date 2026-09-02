import priceService from "../services/price.service.js";

class PriceController {

    async getAll(req, res) {
        try {
            const list = await priceService.getAll();
            return res.status(200).json(list);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { idLoungeType, effectiveDate } = req.params;
            const price = await priceService.getById(idLoungeType, effectiveDate);
            return res.status(200).json(price);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newPrice = await priceService.create(req.body);
            return res.status(201).json(newPrice);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { idLoungeType, effectiveDate } = req.params;
            const updated = await priceService.update(idLoungeType, effectiveDate, req.body);
            return res.status(200).json(updated);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { idLoungeType, effectiveDate } = req.params;
            await priceService.delete(idLoungeType, effectiveDate);
            return res.status(200).json({ message: "Precio eliminado correctamente." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

}

export default new PriceController();
