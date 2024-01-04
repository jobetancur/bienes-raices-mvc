// Siempre se debe agregar en el package.json el "type": "module" antes de usuarlo, de lo contrario no funcionará y se deberá usar require en lugar de import P.E => const express = require('express');
import express from 'express';
import userRoutes from './routes/userRoutes.js'
import db from './config/db.js';

// Create express instnace
const app = express();

// Conexión a la base de datos.
try {
  await db.authenticate();
  console.log('Database connected');
} catch (error) {
  console.log(error);
}

// El método .use busca todas las rutas que inicien o se deriven de la ruta especificada. En este caso, todas las rutas que se deriven de la ruta '/'. Por otro lado, si usamos .get, solo se buscará la ruta especificada, no escanea nada más.
app.use('/auth', userRoutes);

// Habilitar PUG => Template Engine. Se debe instalar el paquete pug con npm i pug.
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta pública
app.use(express.static('public'));

// ^^^ ¿Qué es un Template Engine?
// Es una herramienta que nos permite renderizar HTML de forma dinámica. P.E: Pug, EJS, Handlebars, etc.
// Una ventaja es que la información se protege de inyecciones de código malicioso ya que se renderiza directamente desde el servidor. P.E: Si se usa un input para ingresar un nombre, se puede ingresar código malicioso en el input y se puede ejecutar en el navegador. Si se usa un template engine, el código malicioso no se ejecutará en el navegador. Para el caso de React o Vue, se deben tomar medidas de seguridad para evitar inyecciones de código malicioso.
// Obviamente, el template engine no se compara al dinamismo de React o Vue. Además, el template engine consume más recursos del servidor que React o Vue al tener que cargar el HTML directamente desde allí.

// ¿Qué es MVC?
// Es un patrón de arquitectura de software que separa la lógica de negocio de la interfaz de usuario. Esto permite que el código sea más fácil de mantener y de escalar. Además, permite que el código sea más reutilizable.
// MVC significa Model, View, Controller.
// Model: Se encarga de la lógica de negocio. P.E: Consultar datos de la base de datos.
// View: Se encarga de la interfaz de usuario. P.E: HTML, CSS, Javascript.
// Controller: Se encarga de conectar el modelo con la vista. P.E: Recibir datos del modelo y enviarlos a la vista.

// El Router en MVC se encarga de manejar las rutas. P.E: /login, /register, /profile, etc.

// ¿Qué es un ORM?
// Es una herramienta que nos permite interactuar con la base de datos usando objetos. P.E: Sequelize, Mongoose, etc.
// ORM significa Object Relational Mapping.
// Ventajas de un ORM: Comenzar a crear aplicaciones que utilicen bases de datos, sin necesidad de escribir código SQL y tampoco saber sobre modelado de bases de datos. Además, el ORM se encarga de crear las tablas en la base de datos, de crear las relaciones entre las tablas, etc. También, el ORM nos permite crear consultas de forma más sencilla y rápida. P.E: En lugar de escribir una consulta SQL, podemos usar un método de Sequelize para crear la consulta.





// Create PORT
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

