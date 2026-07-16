import { Router } from 'express';
import salonController from '../controllers/salon.controller.js';

const router = Router();

// Definimos los "caminos" (rutas) de nuestra API de salones
// Asociamos cada verbo HTTP con la acción correspondiente del controlador

router.get('/', salonController.getAll);         // Leer todos los salones
router.get('/:id', salonController.getById);     // Leer un solo salón usando su ID
router.post('/', salonController.create);        // Crear un nuevo salón
router.put('/:id', salonController.update);      // Editar un salón existente usando su ID
router.delete('/:id', salonController.delete);   // Eliminar un salón usando su ID

export default router;
