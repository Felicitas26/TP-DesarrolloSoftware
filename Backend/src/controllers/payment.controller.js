import paymentService from "../services/payment.service.js";

class PaymentController {

    async getAll(req, res) {
        try {
            const payments = await paymentService.getAll();
            return res.status(200).json(payments);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const payment = await paymentService.getById(req.params.id);
            return res.status(200).json(payment);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async create(req, res) {
        try {
            const newPayment = await paymentService.create(req.body);
            return res.status(201).json(newPayment);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const paymentUpdated = await paymentService.update(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                message: "Pago actualizado correctamente.",
                payment: paymentUpdated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            await paymentService.delete(req.params.id);

            return res.status(200).json({
                message: "Pago eliminado correctamente."
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message
            });
        }
    }
}

export default new PaymentController();
