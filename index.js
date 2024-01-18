// Siempre se debe agregar en el package.json el "type": "module" antes de usuarlo, de lo contrario no funcionará y se deberá usar require en lugar de import P.E => const express = require('express');
import dotenv from 'dotenv';
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/apiRoutes.js';
import appRoutes from './routes/appRoutes.js';
import userRoutes from './routes/userRoutes.js'
import realEstatesRoutes from './routes/realEstatesRoutes.js';
import db from './config/db.js';

// Create express instnace
const app = express();

// Habilitar body-parser para leer los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie-parser
app.use(cookieParser());

// Habilitar csurf
app.use(csrf({ cookie: true }));

// Conexión a la base de datos.
try {
  await db.authenticate();
  db.sync(); // Sincroniza los modelos con la base de datos. Si no existen las tablas, las crea.
  console.log('Database connected');
} catch (error) {
  console.log(error);
}

// El método .use busca todas las rutas que inicien o se deriven de la ruta especificada. En este caso, todas las rutas que se deriven de la ruta '/'. Por otro lado, si usamos .get, solo se buscará la ruta especificada, no escanea nada más.
app.use('/', appRoutes);
app.use('/auth', userRoutes);
app.use('/', realEstatesRoutes);
app.use('/api', apiRoutes);

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
const PORT = process.env.BACKEND_PORT || 4000;

// Qué es la protección CSRF?
// CSRF significa Cross-Site Request Forgery.
// Es un tipo de ataque que permite a un atacante enviar peticiones HTTP desde un sitio web vulnerable. P.E: Un atacante puede enviar una petición HTTP desde un sitio web vulnerable para eliminar una cuenta de usuario.
// Para evitar este tipo de ataques, se debe usar un token CSRF. Este token se genera en el servidor y se envía al cliente. Luego, el cliente envía el token al servidor. Si el token es correcto, el servidor procesa la petición. Si el token es incorrecto, el servidor rechaza la petición.
// Para usar el token CSRF, se debe instalar el paquete csurf con npm i csurf.
// Para usar el token CSRF, se debe usar el método .use de csurf. P.E: app.use(csurf());
// Para enviar el token CSRF al cliente, se debe usar el método .locals de res. P.E: res.locals.csrfToken = req.csrfToken();

// ¿Para qué se usa la dependencia cookie-parse y cómo ayuda a mi proyecto?
// Esta dependencia nos permite leer las cookies que se envían desde el cliente. P.E: Si el cliente envía una cookie con el nombre 'token', podemos leerla con req.cookies.token.
// Para usar cookie-parser, se debe instalar con npm i cookie-parse.
// Para usar cookie-parser, se debe usar el método .use. P.E: app.use(cookieParse());



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

