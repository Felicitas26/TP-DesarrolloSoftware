import paymentModel from "../models/payment.model.js";
import contractModel from "../models/contract.model.js";

const ALLOWED_STATUS = ["pendiente", "seña", "pagado"];

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
        const value = Number(payment.value);

        if (!value || value <= 0) {
            const error = new Error(
                "El valor del pago debe ser un número mayor a 0."
            );
            error.statusCode = 400;
            throw error;
        }

        if (!payment.idContract) {
            const error = new Error("Indicá el contrato asociado al pago.");
            error.statusCode = 400;
            throw error;
        }

        const contract = await contractModel.getById(payment.idContract);

        if (!contract) {
            const error = new Error("El contrato indicado no existe.");
            error.statusCode = 404;
            throw error;
        }

        return await paymentModel.create({
            value,
            statusPayment: payment.statusPayment || "pendiente",
            datePayment: payment.datePayment || new Date(),
            idContract: payment.idContract
        });
    }

    async update(id, payment) {
        await this.getById(id);

        if (payment.statusPayment && !ALLOWED_STATUS.includes(payment.statusPayment)) {
            const error = new Error("Estado de pago inválido.");
            error.statusCode = 400;
            throw error;
        }

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