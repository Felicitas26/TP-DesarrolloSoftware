import loungeService from "../services/lounge.service.js";

class LoungeController {

  async getAll(req, res) {
    const list = await loungeService.getAll();
    return res.status(200).json(list);
  }

  async getById(req, res) {
    const { id } = req.params;

    const lounge = await loungeService.getById(id);

    if (!lounge) {
      return res.status(404).json({
        error: `Salón con ID ${id} no encontrado.`
      });
    }

    return res.status(200).json(lounge);
  }

  async create(req, res) {
    const { name, loungeAddress, idLocation } = req.body;

    if (!name || !loungeAddress || idLocation == undefined || idLocation === "") {
      return res.status(400).json({
        error: "Todos los campos (name, loungeAddress, idLocation) son obligatorios."
      });
    }

    try {
      const newLounge = await loungeService.create(req.body);
      return res.status(201).json(newLounge);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, loungeAddress, idLocation } = req.body;

    if (!name || !loungeAddress || idLocation == undefined || idLocation === "") {
      return res.status(400).json({
        error: "Todos los campos (name, loungeAddress, idLocation) son obligatorios."
      });
    }

    const UpdatedLounge = await loungeService.update(id, req.body);

    if (!UpdatedLounge) {
      return res.status(404).json({
        error: `No se encontró el salón con ID ${id} para actualizar.`
      });
    }

    return res.status(200).json(UpdatedLounge);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deleted = await loungeService.delete(id);

    if (!deleted) {
      return res.status(404).json({
        error: `No se encontró el salón con ID ${id} para eliminar.`
      });
    }

    return res.status(200).json({
      message: `Salón con ID ${id} eliminado exitosamente.`
    });
  }

}
 
export default new LoungeController();
