import db from './db.js';
import express from 'express';
import salonRoutes from './src/routes/salon.routes.js';

const app = express();

// Middleware obligatorio para que el servidor entienda cuando le enviamos datos en formato JSON
app.use(express.json());
// Ruta para traer los clientes de la base de datos
app.get('/clientes', async (req, res) => {
  try {
    // Hacemos la consulta a la tabla usando promesas
    const [filas] = await db.query('SELECT * FROM clientes');
    
    // Devolvemos los datos que encontramos
    res.json({
      mensaje: "¡Clientes cargados con éxito!",
      clientes: filas
    });
  } catch (error) {
    console.error("Error al consultar los clientes:", error);
    res.status(500).json({ error: "Hubo un error al obtener los clientes" });
  }
});

// Conectamos las rutas de salones. Ahora todas las URL van a empezar con /api/salones
app.use('/api/salones', salonRoutes);

// Mensaje de encendido en la terminal
app.listen(3000, () => {
  console.log('¡Servidor del TP encendido y escuchando en el puerto 3000!');
}); 
