import paymentModel from "../models/payment.model.js";

class PaymentService {

    async getAll() {
        return await paymentModel.getAll();
    }

    async getById(id) {
        const payment = await paymentModel.getById(id);

        if (!payment) {
            const error = new Error("Pago no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        return payment;
    }

    async create(payment) {
        return await paymentModel.create(payment);
    }

    async update(id, payment) {
        await this.getById(id);

        const updated = await paymentModel.update(id, payment);

        if (!updated) {
            const error = new Error("No se pudo actualizar el pago.");
            error.statusCode = 400;
            throw error;
        }

        return updated;
    }

    async delete(id) {
        const deleted = await paymentModel.delete(id);

        if (!deleted) {
            const error = new Error("No se pudo eliminar el pago.");
            error.statusCode = 400;
            throw error;
        }

        return true;
    }
}

export default new PaymentService();