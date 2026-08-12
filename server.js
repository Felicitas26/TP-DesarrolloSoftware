import express from 'express';

import clientRoutes from './src/routes/client.routes.js';

const app = express();

app.use(express.json());

app.use('/api/client', clientRoutes);

app.listen(3000, () => {
    console.log('¡Servidor del TP encendido y escuchando en el puerto 3000!');
});
