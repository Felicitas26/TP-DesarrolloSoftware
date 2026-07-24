let salones = [
  { id: 1, nombre: "Salón Pequeño", direccionSalon: "Av. Pellegrini 3135", cantMinima: 60, cantMaxima: 89 },
  { id: 2, nombre: "Salón Grande", direccionSalon: "Pellegrini 3135", cantMinima: 90, cantMaxima: 130 }
];

class SalonService {
  getAll() {
    return salones;
  }

  getById(id) {
    return salones.find(s => s.id === parseInt(id));
  }

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

  update(id, datos) {
    const index = salones.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null; 

    salones[index] = {
      ...salones[index],
      nombre: datos.nombre !== undefined ? datos.nombre : salones[index].nombre,
      direccionSalon: datos.direccionSalon !== undefined ? datos.direccionSalon : salones[index].direccionSalon,
      cantMinima: datos.cantMinima !== undefined ? parseInt(datos.cantMinima) : salones[index].cantMinima,
      cantMaxima: datos.cantMaxima !== undefined ? parseInt(datos.cantMaxima) : salones[index].cantMaxima
    };

    return salones[index];
  }

  delete(id) {
    const index = salones.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;

    salones.splice(index, 1); 
    return true;
  }
}
export default new SalonService();
