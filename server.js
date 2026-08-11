import express from 'express';

import loungeTypeRoutes from './src/routes/loungeType.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import extraServiceRoutes from "./src/routes/extraService.routes.js";
import contractRoutes from "./src/routes/contract.routes.js";
import cardDetailRoutes from "./src/routes/cardDetail.routes.js";

const app = express();

app.use(express.json());

app.use('/api/loungeType', loungeTypeRoutes);
app.use('/api/client', clientRoutes);
app.use("/extraService", extraServiceRoutes);
app.use("/contract", contractRoutes);
app.use("/cardDetail", cardDetailRoutes);

app.listen(3000, () => {
    console.log('¡Servidor del TP encendido y escuchando en el puerto 3000!');
});
