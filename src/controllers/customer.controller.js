import customerService from "../services/customer.service.js";

class CustomerController {

    async getAll(req, res) {
        try { 
            const customer = await customerService.getAll();
            return res.status(200).json(customers);
            }
        catch (error) {
            return res.status(500).json ({
                error: error.message
                });
        }
    }

    async getById(req, res) {
       const { id }  = req.params;
        try {
            const customer = await customerService.getById(id);
            if (!customer) {
                return res.status(404).json({ 
                    error: `Cliente con ID ${id} no encontrado.`
                       });
                 }
            return res.status(200).json(customer);
        }
        catch (error) {
            return res.status(500).json ({
                error: error.message
                });
        }
    }
    
    async create(req, res) {
        const {
            nameCus, lastNameCus, phoneCus, dniCus, emailCus, adressCus, localityCus } = req.body;

        try {
        
            if ( !nameCus || !lastNameCus || !phoneCus || !dniCus || !emailCus || !adressCus || !localityCus) {
                return res.status(400).json ({
                    error: "Todos los campos son obligatorios."
                });
                }
           
            if (!/^\d+$/.test(dniCus)) {
               return res.status(400).json({
                    error: "El DNI solo puede contener números."
                });
            }
           
            if (!/^\d+$/.test(phoneCus)) {
               return res.status(400).json({
                   error: "El teléfono solo puede contener números."
                });
            }
            
            const newCustomer = await customerService.create(req.body);
            return res.status(201).json(newCustomer);
            }
        
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });

    }
}
    async update(req, res) {

        try {
            const { id } = req.params;
            const customerUpdated = await customerService.update(id, req.body);
           
            if (!customerUpdated) {
                return res.status(404).json({
                   error: "No se ha encontrado al cliente."
                });
            }
            return res.status(200).json({
                mensaje: "Cliente actualizado correctamente.",
                customer: customerUpdated
        });
        }
            catch (error) {
                return res.status(500).json ({
                error: error.message
                });
    }
}
    async delete(req, res) {
        try {

            const { id } = req.params;
            const customerDeleted = await customerService.delete(id);
    
            if (!customerDeleted) {
                return res.status(404).json({
                    error: "No se ha encontrado al cliente."
                });
        }

        return res.status(200).json({
            mensaje: "Cliente eliminado correctamente."
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }

    }

}

export default new CustomerController();
