import db from './db.js';
import mysql from 'mysql2';
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

// Creamos el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Usamos promesas
const promisePool = pool.promise();

// Probamos la conexión al iniciar
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
  } else {
    console.log('✅ ¡Conectado exitosamente a la base de datos MySQL!');
    connection.release();
  }
});

export default promisePool;