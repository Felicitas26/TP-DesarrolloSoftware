import contratoService from "../services/contrato.service.js";

class ContratoController {

    async getAll(req, res) {
        try { 
            const contratos = await contratoService.getAll();
            return res.status(200).json(contratos);
        }
        
        catch (error) {
            return res.status(500).json({
            error: error.message
        });

        }

    }

    async getById(req, res) {
        const { id }  = req.params;
        try {
            const contrato = await contratoService.getById(id);
            if (!contrato) {
                return res.status(404).json({ 
                    error: `Contrato con ID ${id} no encontrado.`
                       });
                 }
            return res.status(200).json(contrato);
        }
        catch (error) {
            return res.status(500).json ({
                error: error.message
                });
        }

    }

    async create(req, res) {
        const {
            horaInicioEvento, horaFinEvento, fechaContrato } = req.body;

        try {
        
            if ( !horaInicioEvento || !horaFinEvento) {
                return res.status(400).json ({
                    error: "Todos los campos son obligatorios."
                });
                }
            
            const nuevoContrato = await contratoeService.create(req.body);
            return res.status(201).json(nuevoContrato);
            }
        
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });

    }

    async update(req, res) {
        try {
        const { id } = req.params;
        const contratoUpdated = await contratoService.update(id, req.body);
       
        if (!contratoUpdated) {
            return res.status(404).json({
               error: "No se ha encontrado al cliente."
            });

        }
        return res.status(200).json({
            mensaje: "Contrato actualizado correctamente.",
            contrato: contratoUpdated
    });
    }
        catch (error) {
            return res.status(500).json ({
            error: error.message
            });
    }

    async delete(req, res) {
           try {

        const { id } = req.params;
        const contratoDeleted = await contratoService.delete(id);

        if (!contratoDeleted) {
            return res.status(404).json({
                error: "No se ha encontrado el contrato."
            });
    }

    return res.status(200).json({
        mensaje: "Contrato eliminado correctamente."
    });

} catch (error) {

    return res.status(500).json({
        error: error.message
    });

    }

    }

}

export default new ContratoController();
