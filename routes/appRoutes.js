import express from "express";
import { home, categories, errorPage, search, notPublished } from "../controllers/appController.js";

const router = express.Router();

// Página de inicio
router.get("/", home);

// Categorías
router.get("/categorias/:id", categories);

// Buscador
router.post("/busqueda", search);

// Página 404
router.get("/404", errorPage);

// Propiedad no publicada
router.get("/propiedad-no-publicada", notPublished)

export default router;