import categories from './categories.js';
import prices from './prices.js';
import users from './users.js';
import db from '../config/db.js';
import { Categories, Prices, User } from '../models/index.js';

const importData = async () => {
    try {
        //1. Autenticar la conexión a la base de datos.
        await db.authenticate();
        console.log('Conexión establecida correctamente.');
        //2. Generar las columnas
        await db.sync()

        //3. Insertar los datos en la tabla.
        // Promise.all() ejecuta todas las promesas al mismo tiempo. 
        await Promise.all([ 
            Categories.bulkCreate(categories),
            Prices.bulkCreate(prices),
            User.bulkCreate(users),
        ])
        console.log('Datos insertados correctamente.');

        process.exit(0); // Forma de salir de la app sin error.

    } catch (error) {
        console.log(error);
        process.exit(1); // Forma de salir de la app con error. 0 es sin error.
    }
};

// Limpiar los datos de la base de datos.
const deleteData = async () => {
    try{
        // await Promise.all([
        //     // truncate: true elimina todos los registros de la tabla. y reinicia el autoincremental.
        //     Categories.destroy({ where: {}, truncate: true }), 
        //     Prices.destroy({ where: {}, truncate: true }),
        // ]);

        // La línea 41 hace lo mismo que la línea 34 a la 38. La diferencia es que es más corto, pero también más peligroso.
        await db.sync({ force: true }); // Elimina todas las tablas y las vuelve a crear.
        console.log('Datos eliminados correctamente.');
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

if(process.argv[2] === '-i') { // node seed/seeder.js -i
    importData();
}

if(process.argv[2] === '-e') { // node seed/seeder.js -e
    deleteData();
}