import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: '.env' });

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS ?? '', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3307,
    define: {
        timestamps: true // Crea dos columnas más en la tabla: createdAt y updatedAt.
    },
    pool: { // Configuración para la conexión a la base de datos.
        max: 20, // Máximo de conexiones simultáneas.
        min: 0, // Mínimo de conexiones simultáneas.
        acquire: 30000, // Tiempo máximo, en milisegundos, que se intentará establecer una conexión antes de arrojar un error.
        idle: 10000 // Tiempo máximo, en milisegundos, que una conexión puede estar inactiva antes de ser liberada.
    },
    // operatorsAliases: false // Para evitar el mensaje de advertencia.
});

export default db;