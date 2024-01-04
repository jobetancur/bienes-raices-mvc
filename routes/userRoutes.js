// Métodos HTTP:
// GET: Obtener datos
// POST: Enviar datos
// PUT: Actualizar datos => Actualizar todos los datos. P.E: Actualizar todos los datos de un usuario. 
// PATCH: Actualizar datos => Actualiza un dato en específico. P.E: Actualizar el nombre de un usuario.
// DELETE: Eliminar datos

// Status Code:
// 200: OK
// 201: Created
// 400: Bad Request
// 401: Unauthorized
// 403: Forbidden
// 404: Not Found
// 500: Internal Server Error
// 503: Service Unavailable
// 504: Gateway Timeout
// 505: HTTP Version Not Supported
// 507: Insufficient Storage
// 508: Loop Detected

//? Para instalar Tailwind CSS en Node se deben instalar las dependencias usando: npm i -D tailwindcss autoprefixer postcss postcss-cli
//? Después de crear el archivo CSS con la configuración de Tailwind, debemos inicializarlo usando: npx tailwindcss init -p

import express from 'express';
import { loginForm, signUpForm, newSignUpForm, resetPasswordForm, confirmAccount } from '../controllers/userController.js';

// Se debe importar el módulo de router para poder usarlo.
const router = express.Router();

router.get('/login', loginForm);
router.get('/signup', signUpForm);
router.post('/signup', newSignUpForm);

router.get('/reset-password', resetPasswordForm);

// Endpoint para confirmar la cuenta
router.get('/confirm-account/:token', confirmAccount);

export default router;