import paymentService from "../services/payment.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";

class PaymentController {

    getAll = asyncHandler(async (req, res) => {
        const payments = await paymentService.getAll();
        return res.status(200).json(payments);
    });

    getById = asyncHandler(async (req, res) => {
        const payment = await paymentService.getById(req.params.id);
        return res.status(200).json(payment);
    });

    create = asyncHandler(async (req, res) => {
        const newPayment = await paymentService.create(req.body);
        return res.status(201).json(newPayment);
    });

    update = asyncHandler(async (req, res) => {
        const paymentUpdated = await paymentService.update(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Pago actualizado correctamente.",
            payment: paymentUpdated
        });
    });

    delete = asyncHandler(async (req, res) => {
        await paymentService.delete(req.params.id);

        return res.status(200).json({
            message: "Pago eliminado correctamente."
        });
    });
}

export default new PaymentController();
