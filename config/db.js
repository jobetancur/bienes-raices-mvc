import Sequelize from "sequelize";

const db = new Sequelize('bienesraices_node_mvc', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: true // Crea dos columnas más en la tabla: createdAt y updatedAt.
    },
    pool: { // Configuración para la conexión a la base de datos.
        max: 5, // Máximo de conexiones simultáneas.
        min: 0, // Mínimo de conexiones simultáneas.
        acquire: 30000, // Tiempo máximo, en milisegundos, que se intentará establecer una conexión antes de arrojar un error.
        idle: 10000 // Tiempo máximo, en milisegundos, que una conexión puede estar inactiva antes de ser liberada.
    },
    operatorsAliases: false // Para evitar el mensaje de advertencia.
});

export default db;