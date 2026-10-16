import contractService from "../services/contract.service.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import httpError from "../utils/httpError.js";

class ContractController {

    // Carga el contrato y valida que el cliente sea su dueño.
    async loadContract(req) {
        const contract = await contractService.getById(req.params.id);

        if (!contract) {
            throw httpError(404, "Contrato no encontrado.");
        }

        if (
            req.usuario.rol === "cliente" &&
            contract.reservation.idCli !== req.usuario.idCli
        ) {
            throw httpError(403, "No tenés acceso a este contrato.");
        }

        return contract;
    }

    getAll = asyncHandler(async (req, res) => {
        const contracts = await contractService.getAll();
        return res.status(200).json(contracts);
    });

    getByClient = asyncHandler(async (req, res) => {
        const contracts = await contractService.getByClient(req.usuario.idCli);
        return res.status(200).json(contracts);
    });

    getById = asyncHandler(async (req, res) => {
        const contract = await this.loadContract(req);

        const calc = await contractService.calcValues(contract, contract.reservation);

        return res.status(200).json({ ...contract, calc });
    });

    update = asyncHandler(async (req, res) => {
        await this.loadContract(req);

        const updated = await contractService.update(req.params.id, req.body);

        return res.status(200).json({
            message: "Contrato actualizado correctamente.",
            contract: updated
        });
    });

    create = asyncHandler(async (req, res) => {
        const { idReservation } = req.body;

        if (!idReservation) {
            throw httpError(400, "Indicá la reserva para generar el contrato.");
        }

        const contract = await contractService.generateForReservation(idReservation);

        if (!contract) {
            throw httpError(404, "La reserva indicada no existe.");
        }

        const full = await contractService.getById(contract.idContract);
        const calc = await contractService.calcValues(full, full.reservation);

        return res.status(201).json({
            message: "Contrato generado correctamente.",
            contract: { ...full, calc }
        });
    });

    updateAdmin = asyncHandler(async (req, res) => {
        const contract = await contractService.getById(req.params.id);

        if (!contract) {
            throw httpError(404, "Contrato no encontrado.");
        }

        const updated = await contractService.update(req.params.id, req.body, { admin: true });

        return res.status(200).json({
            message: "Contrato actualizado correctamente.",
            contract: updated
        });
    });

    delete = asyncHandler(async (req, res) => {
        const contract = await contractService.getById(req.params.id);

        if (!contract) {
            throw httpError(404, "Contrato no encontrado.");
        }

        const motivo = req.body?.motivo?.trim();

        if (!motivo) {
            throw httpError(
                400,
                "Debés indicar el motivo de la eliminación del contrato para notificar al cliente."
            );
        }

        await contractService.cancelar(req.params.id, motivo);

        return res.status(200).json({
            message: "Contrato eliminado y evento dado de baja correctamente."
        });
    });

    enviar = asyncHandler(async (req, res) => {
        await this.loadContract(req);

        const sent = await contractService.enviar(req.params.id);

        return res.status(200).json({
            message: "Contrato enviado para revisión correctamente.",
            contract: sent
        });
    });

    review = asyncHandler(async (req, res) => {
        const { decision } = req.body;

        if (!["aprobar", "rechazar"].includes(decision)) {
            throw httpError(400, "La decisión debe ser 'aprobar' o 'rechazar'.");
        }

        const reviewed = await contractService.review(req.params.id, decision);

        return res.status(200).json({
            message: decision === "aprobar"
                ? "Revisión aprobada. El contrato quedó listo para la firma."
                : "Revisión rechazada. El cliente debe corregir el contrato.",
            contract: reviewed
        });
    });

    firmar = asyncHandler(async (req, res) => {
        await this.loadContract(req);

        const signed = await contractService.firmar(req.params.id);

        return res.status(200).json({
            message: "¡Contrato aceptado! Firmaste la conformidad del contrato.",
            contract: signed
        });
    });

    solicitarModificacion = asyncHandler(async (req, res) => {
        await this.loadContract(req);

        const updated = await contractService.solicitarModificacion(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            message: "Modificación solicitada. Queda pendiente de aprobación por el administrador.",
            contract: updated
        });
    });

    revisarModificacion = asyncHandler(async (req, res) => {
        const { decision, motivo } = req.body;

        if (!["aprobar", "rechazar"].includes(decision)) {
            throw httpError(400, "La decisión debe ser 'aprobar' o 'rechazar'.");
        }

        const reviewed = await contractService.revisarModificacion(
            req.params.id,
            decision,
            motivo
        );

        return res.status(200).json({
            message: decision === "aprobar"
                ? "Modificación aprobada y aplicada al contrato."
                : "Modificación rechazada. El contrato conserva sus datos vigentes.",
            contract: reviewed
        });
    });

    contestarRechazoModificacion = asyncHandler(async (req, res) => {
        await this.loadContract(req);

        const { decision } = req.body;

        const result = await contractService.contestarRechazoModificacion(
            req.params.id,
            decision
        );

        return res.status(200).json({
            message: decision === "continuar"
                ? "Perfecto. Continuás con el contrato como estaba."
                : "El evento fue cancelado y el contrato dado de baja.",
            contract: result.contract || null
        });
    });
}

export default new ContractController();
