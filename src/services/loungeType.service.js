let lounges = [
  { id: 1, name: "Salón Pequeño", loungeAddress: "Av. Pellegrini 3135", minQuantity: 60, maxQuantity: 89 },
  { id: 2, name: "Salón Grande", loungeAddress: "Pellegrini 3135", minQuantity: 90, maxQuantity: 130 }
];

class LoungeService {
  getAll() {
    return lounges;
  }

  getById(id) {
    return lounges.find(s => s.id === parseInt(id));
  }

  create(data) {
    const newLounge = {
      id: nextId++,
      nombre: data.nombre,
      direccionSalon: data.direccionSalon,
      cantMinima: parseInt(data.cantMinima),
      cantMaxima: parseInt(data.cantMaxima)
    };
    lounges.push(newLounge);
    return newLounge;
  }

  update(id, data) {
    const index = lounges.findIndex(s => s.id === parseInt(id));
    if (index === -1) return null; 

    lounges[index] = {
      ...lounges[index],
      name: data.name !== undefined ? data.name : lounges[index].name,
      loungeAddress: data.loungeAddress !== undefined ? data.loungeAddress : lounges[index].loungeAddress,
      minQuantity: data.minQuantity !== undefined ? parseInt(data.minQuantity) : lounges[index].minQuantity,
      maxQuantity: data.maxQuantity !== undefined ? parseInt(data.maxQuantity) : lounges[index].maxQuantity
    };

    return lounges[index];
  }

  delete(id) {
    const index = lounges.findIndex(s => s.id === parseInt(id));
    if (index === -1) return false;

    lounges.splice(index, 1); 
    return true;
  }
}
export default new LoungeService();
