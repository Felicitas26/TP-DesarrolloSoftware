import db from './db.js';
import express from 'express';
import tiposalonRoutes from './src/routes/tiposalon.routes.js';
import clienteRoutes from './src/routes/cliente.routes.js';
import servicioExtraRoutes from "./routes/servicioExtra.routes.js";
import contratoRoutes from "./routes/contrato.routes.js";
import detalleTarjetaRoutes from "./routes/detalleTarjeta.routes.js";

const app = express();

app.use(express.json());
app.get('/clientes', async (req, res) => {
  try {
    const [filas] = await db.query('SELECT * FROM clientes');
    
    res.json({
      mensaje: "¡Clientes cargados con éxito!",
      clientes: filas
    });
  } catch (error) {
    console.error("Error al consultar los clientes:", error);
    res.status(500).json({ error: "Hubo un error al obtener los clientes" });
  }
});

app.use('/api/tiposalones', tiposalonRoutes);
app.use('/api/clientes', clienteRoutes);
app.use("/servicioExtra", servicioExtraRoutes);
app.use("/contrato", contratoRoutes);
app.use("/detalleTarjeta", detalleTarjetaRoutes);


// Mensaje de encendido en la terminal
app.listen(3000, () => {
  console.log('¡Servidor del TP encendido y escuchando en el puerto 3000!');
}); 
