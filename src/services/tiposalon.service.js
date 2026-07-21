let salones = [
  { id: 1, nombre: "Salón Pequeño", direccionSalon: "Av. Pellegrini 3135", cantMinima: 60, cantMaxima: 89 },
  { id: 2, nombre: "Salón Grande", direccionSalon: "Pellegrini 3135", cantMinima: 90, cantMaxima: 130 }
];

class SalonService {
  // 1. Leer todos los salones (GET)
  getAll() {
    return salones;
  }

  // 2. Buscar un salón por su ID único (GET con ID)
  getById(id) {
    return salones.find(s => s.id === parseInt(id));
  }

  // 3. Crear un nuevo salón (POST)
  create(datos) {
    const nuevoSalon = {
      id: proximoId++,
      nombre: datos.nombre,
      direccionSalon: datos.direccionSalon,
      cantMinima: parseInt(datos.cantMinima),
      cantMaxima: parseInt(datos.cantMaxima)
    };
    salones.push(nuevoSalon);
    return nuevoSalon;
  }

  // 4. Modificar un salón existente (PUT)
  update(id, datos) {
    const index = salones.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null; // Si no lo encuentra, devuelve "nada"

    // Reemplazamos los datos viejos por los nuevos que vengan
    salones[index] = {
      ...salones[index],
      nombre: datos.nombre !== undefined ? datos.nombre : salones[index].nombre,
      direccionSalon: datos.direccionSalon !== undefined ? datos.direccionSalon : salones[index].direccionSalon,
      cantMinima: datos.cantMinima !== undefined ? parseInt(datos.cantMinima) : salones[index].cantMinima,
      cantMaxima: datos.cantMaxima !== undefined ? parseInt(datos.cantMaxima) : salones[index].cantMaxima
    };

    return salones[index];
  }

  // 5. Borrar un salón (DELETE)
  delete(id) {
    const index = salones.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;

    salones.splice(index, 1); // Borra el elemento de la lista
    return true;
  }
}
export default new SalonService();
