import express from 'express';
import salonRoutes from './src/routes/salon.routes.js';

const app = express();

// Middleware obligatorio para que el servidor entienda cuando le enviamos datos en formato JSON
app.use(express.json());

// Conectamos las rutas de salones. Ahora todas las URL van a empezar con /api/salones
app.use('/api/salones', salonRoutes);

// Mensaje de encendido en la terminal
app.listen(3000, () => {
  console.log('¡Servidor del TP encendido y escuchando en el puerto 3000!');
}); 