import db from './db.js';
import express from 'express';
import loungeTypeRoutes from './src/routes/loungeType.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import extraServiceRoutes from "./routes/extraService.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import cardDetailRoutes from "./routes/cardDetail.routes.js";

const app = express();

app.use(express.json());
app.get('/client', async (req, res) => {
  try {
    const [filas] = await db.query('SELECT * FROM client');
    
    res.json({
      mensaje: "¡Clientes cargados con éxito!",
      clientes: filas
    });
  } catch (error) {
    console.error("Error al consultar los clientes:", error);
    res.status(500).json({ error: "Hubo un error al obtener los clientes" });
  }
});

app.use('/api/loungeType', loungeTypeRoutes);
app.use('/api/client', clientRoutes);
app.use("/extraService", extraServiceRoutes);
app.use("/contract", contractRoutes);
app.use("/cardDetail", cardDetailRoutes);


app.listen(3000, () => {
  console.log('¡Servidor del TP encendido y escuchando en el puerto 3000!');
}); 
