import salonService from '../services/salon.service.js';

class SalonController {
  // Trae todos los salones de la lista
  getAll(req, res) {
    const lista = salonService.getAll();
    return res.status(200).json(lista);
  }

  // Trae un salón específico usando el ID que viaja en la URL
  getById(req, res) {
    const { id } = req.params;
    const salon = salonService.getById(id);
    
    if (!salon) {
      // Si no existe, avisa con un error 404 (No encontrado)
      return res.status(404).json({ error: `Salón con ID ${id} no encontrado.` });
    }
    return res.status(200).json(salon);
  }

  // Valida los datos antes de crear un nuevo salón
  create(req, res) {
    const { nombre, direccionSalon, cantMinima, cantMaxima } = req.body;

    // Validación de la cátedra: que no falte ningún dato obligatorio del modelo
    if (!nombre || !direccionSalon || cantMinima === undefined || cantMaxima === undefined) {
      return res.status(400).json({ error: "Todos los campos (nombre, direccionSalon, cantMinima, cantMaxima) son obligatorios." });
    }

    // Validación: que las capacidades de invitados sean números coherentes
    if (isNaN(cantMinima) || isNaN(cantMaxima) || cantMinima >= 0 || cantMaxima >= 0) {
      return res.status(400).json({ error: "Las cantidades de invitados deben ser números positivos." });
    }

    // Validación extra: que el mínimo no supere al máximo
    if (parseInt(cantMinima) > parseInt(cantMaxima)) {
      return res.status(400).json({ error: "La cantidad mínima de invitados no puede ser mayor a la máxima." });
    }

    const nuevoSalon = salonService.create(req.body);
    return res.status(201).json(nuevoSalon); // 201 significa "Creado con éxito"
  }

  // Modifica un salón existente
  update(req, res) {
    const { id } = req.params;
    const salonActualizado = salonService.update(id, req.body);

    if (!salonActualizado) {
      return res.status(404).json({ error: `No se encontró el salón con ID ${id} para actualizar.` });
    }
    return res.status(200).json(salonActualizado);
  }

  // Elimina un salón de la lista
  delete(req, res) {
    const { id } = req.params;
    const eliminado = salonService.delete(id);

    if (!eliminado) {
      return res.status(404).json({ error: `No se encontró el salón con ID ${id} para eliminar.` });
    }
    return res.status(200).json({ message: `Salón con ID ${id} eliminado exitosamente.` });
  }
}

export default new SalonController();