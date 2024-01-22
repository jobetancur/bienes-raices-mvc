// Lo usual es siempre nomprar los archivos de los modelos con la primer letra en mayúscula, por ejemplo: User.js, Post.js, etc. Esto es porque el ORM trabaja con clases y no con objetos. Es decir que, todo lo que crea lo instancia como si fuera una clase. Por ejemplo, si tenemos un modelo llamado User, el ORM lo instanciará como si fuera una clase llamada User. Por eso es que se recomienda nombrar los modelos con la primer letra en mayúscula.

// Este modelo tiene las siguientes características:
// id: es un campo de tipo entero, que es la clave primaria y que se autoincrementa.
// name: es un campo de tipo string, que no puede ser nulo y que no puede estar vacío.
// email: es un campo de tipo string, que no puede ser nulo, que debe ser único y que no puede estar vacío.
// password: es un campo de tipo string, que no puede ser nulo y que no puede estar vacío.
// active: es un campo de tipo entero, que por defecto es cero.
// token: es un campo de tipo string.
// expiration: es un campo de tipo date.

import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(60),
        allowNull: false, // no puede estar vacío
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    active: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    token: DataTypes.STRING,
}, {
    hooks: {
        beforeCreate: async function(user){
            const salt = await bcrypt.genSalt(10); // Generar el salt o hash
            user.password = await bcrypt.hash(user.password, salt); // Encriptar la contraseña
        }
    },
    scopes: { 
        deletePassword: { // Este scope es para que no se devuelva la contraseña en las consultas
            attributes: { exclude: ['password', 'token', 'active', 'createdAt', 'updatedAt'] }
        }
    }
});

// Métodos personalizados
// Método personalizado para comparar las contraseñas
User.prototype.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default User; 