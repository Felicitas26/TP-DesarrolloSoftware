import salonService from "../services/salon.service.js";

class SalonController {

  async getAll(req, res) {
    const lista = await salonService.getAll();
    return res.status(200).json(lista);
  }

  async getById(req, res) {
    const { id } = req.params;

    const salon = await salonService.getById(id);

    if (!salon) {
      return res.status(404).json({
        error: `Salón con ID ${id} no encontrado.`
      });
    }

    return res.status(200).json(salon);
  }

  async create(req, res) {

    const {
      nombre,
      direccionSalon,
      tipoSalonId
    } = req.body;

    if (!nombre || !direccionSalon || !tipoSalonId) {
      return res.status(400).json({
        error: "Todos los campos (nombre, direccionSalon y tipoSalonId) son obligatorios."
      });
    }

    const nuevoSalon = await salonService.create(req.body);

    return res.status(201).json(nuevoSalon);
  }

  async update(req, res) {

    const { id } = req.params;

    const salonActualizado = await salonService.update(id, req.body);

    if (!salonActualizado) {
      return res.status(404).json({
        error: `No se encontró el salón con ID ${id} para actualizar.`
      });
    }

    return res.status(200).json(salonActualizado);
  }

  async delete(req, res) {

    const { id } = req.params;

    const eliminado = await salonService.delete(id);

    if (!eliminado) {
      return res.status(404).json({
        error: `No se encontró el salón con ID ${id} para eliminar.`
      });
    }

    return res.status(200).json({
      message: `Salón con ID ${id} eliminado exitosamente.`
    });
  }

}

export default new SalonController();
