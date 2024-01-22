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

import express from "express";
import {
  loginForm,
  authenticateUser,
  logoutUser,
  signUpForm,
  newSignUpForm,
  resetPasswordForm,
  confirmAccount,
  resetPassword,
  newPasswordForm,
  createNewPassword,
} from "../controllers/userController.js";

// Se debe importar el módulo de router para poder usarlo.
const router = express.Router();

// Rutas para el Login
router.get("/login", loginForm);
router.post("/login", authenticateUser);

// Rutas para cerrar sesión
router.post("/logout", logoutUser);

// Rutas para el registro de usuarios
router.get("/signup", signUpForm);
router.post("/signup", newSignUpForm);
router.get("/confirm-account/:token", confirmAccount); // Endpoint para confirmar la cuenta de usuario

// Rutas para el reseteo de contraseña
router.get("/reset-password", resetPasswordForm);
router.post("/reset-password", resetPassword);

// Rutas para crear nueva contraseña
router.get('/new-password/:token', newPasswordForm);
router.post('/new-password/:token', createNewPassword);

export default router;
