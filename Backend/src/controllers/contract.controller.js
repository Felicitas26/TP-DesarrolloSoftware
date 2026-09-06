import contractService from "../services/contract.service.js";

class ContractController {

    async getAll(req, res) {
        try {
            const contracts = await contractService.getAll();
            return res.status(200).json(contracts);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getByClient(req, res) {
        try {
            const contracts = await contractService.getByClient(req.usuario.idCli);
            return res.status(200).json(contracts);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);

            if (!contract) {
                return res.status(404).json({ error: "Contrato no encontrado." });
            }

            if (
                req.usuario.rol === "cliente" &&
                contract.reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a este contrato." });
            }

            const calc = await contractService.calcValues(contract, contract.reservation);

            return res.status(200).json({ ...contract, calc });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);

            if (!contract) {
                return res.status(404).json({ error: "Contrato no encontrado." });
            }

            if (
                req.usuario.rol === "cliente" &&
                contract.reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a este contrato." });
            }

            const updated = await contractService.update(req.params.id, req.body);

            return res.status(200).json({
                message: "Contrato actualizado correctamente.",
                contract: updated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async enviar(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);

            if (!contract) {
                return res.status(404).json({ error: "Contrato no encontrado." });
            }

            if (
                req.usuario.rol === "cliente" &&
                contract.reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a este contrato." });
            }

            const sent = await contractService.enviar(req.params.id);

            return res.status(200).json({
                message: "Contrato enviado para revisión correctamente.",
                contract: sent
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async review(req, res) {
        try {
            const { decision } = req.body;

            if (!["aprobar", "rechazar"].includes(decision)) {
                return res.status(400).json({ error: "La decisión debe ser 'aprobar' o 'rechazar'." });
            }

            const reviewed = await contractService.review(req.params.id, decision);

            return res.status(200).json({
                message: decision === "aprobar"
                    ? "Revisión aprobada. El contrato quedó listo para la firma."
                    : "Revisión rechazada. El cliente debe corregir el contrato.",
                contract: reviewed
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async firmar(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);

            if (!contract) {
                return res.status(404).json({ error: "Contrato no encontrado." });
            }

            if (
                req.usuario.rol === "cliente" &&
                contract.reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a este contrato." });
            }

            const signed = await contractService.firmar(req.params.id);

            return res.status(200).json({
                message: "¡Contrato aceptado! Firmaste la conformidad del contrato.",
                contract: signed
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async solicitarModificacion(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);

            if (!contract) {
                return res.status(404).json({ error: "Contrato no encontrado." });
            }

            if (
                req.usuario.rol === "cliente" &&
                contract.reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a este contrato." });
            }

            const updated = await contractService.solicitarModificacion(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                message: "Modificación solicitada. Queda pendiente de aprobación por el administrador.",
                contract: updated
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async revisarModificacion(req, res) {
        try {
            const { decision } = req.body;

            if (!["aprobar", "rechazar"].includes(decision)) {
                return res.status(400).json({ error: "La decisión debe ser 'aprobar' o 'rechazar'." });
            }

            const reviewed = await contractService.revisarModificacion(
                req.params.id,
                decision
            );

            return res.status(200).json({
                message: decision === "aprobar"
                    ? "Modificación aprobada y aplicada al contrato."
                    : "Modificación rechazada. El contrato conserva sus datos vigentes.",
                contract: reviewed
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async contestarRechazoModificacion(req, res) {
        try {
            const contract = await contractService.getById(req.params.id);

            if (!contract) {
                return res.status(404).json({ error: "Contrato no encontrado." });
            }

            if (
                req.usuario.rol === "cliente" &&
                contract.reservation.idCli !== req.usuario.idCli
            ) {
                return res.status(403).json({ error: "No tenés acceso a este contrato." });
            }

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
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}

export default new ContractController();