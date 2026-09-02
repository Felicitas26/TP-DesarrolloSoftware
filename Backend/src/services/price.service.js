import priceModel from "../models/price.model.js";
import loungeTypeModel from "../models/loungeType.model.js";

class PriceService {

    async getAll() {
        return await priceModel.getAll();
    }

    async getById(idLoungeType, effectiveDate) {
        const price = await priceModel.getById(idLoungeType, effectiveDate);
        if (!price) {
            throw { statusCode: 404, message: "Precio no encontrado para el loungetype y fecha indicados." };
        }
        return price;
    }

    async create(price) {
        const { effectiveDate, value, idLoungeType } = price;

        if (!effectiveDate || value === undefined || idLoungeType === undefined || idLoungeType === "") {
            throw { statusCode: 400, message: "Todos los campos son obligatorios (effectiveDate, value e idLoungeType)." };
        }

        if (isNaN(value) || Number(value) < 0) {
            throw { statusCode: 400, message: "El valor debe ser un número mayor o igual a cero." };
        }

        const loungeType = await loungeTypeModel.getById(idLoungeType);
        if (!loungeType) {
            throw { statusCode: 404, message: `No existe el tipo de salón con ID ${idLoungeType}.` };
        }

        const existing = await priceModel.getById(idLoungeType, effectiveDate);
        if (existing) {
            throw { statusCode: 400, message: `Ya existe un precio para el tipo de salón ${idLoungeType} en la fecha ${effectiveDate}.` };
        }

        return await priceModel.create(price);
    }

    async update(idLoungeType, effectiveDate, price) {
        const { value } = price;

        if (isNaN(value) || Number(value) < 0) {
            throw { statusCode: 400, message: "El valor debe ser un número mayor o igual a cero." };
        }

        const updated = await priceModel.update(idLoungeType, effectiveDate, price);
        if (!updated) {
            throw { statusCode: 404, message: "Precio no encontrado para el loungetype y fecha indicados." };
        }
        return updated;
    }

    async delete(idLoungeType, effectiveDate) {
        const deleted = await priceModel.delete(idLoungeType, effectiveDate);
        if (!deleted) {
            throw { statusCode: 404, message: "Precio no encontrado para el loungetype y fecha indicados." };
        }
        return deleted;
    }
}

export default new PriceService();
