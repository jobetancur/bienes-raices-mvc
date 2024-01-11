import express from "express";
import { body } from 'express-validator'; // Cuando se hace desde el router se debe trabajar con body y no con check.
import {
  getMyRealEstates,
  getCreateRealEstate,
  postCreateRealEstate,
  getUploadRealEstateImage,
  postUploadRealEstateImage,
} from "../controllers/realEstateController.js";
import protectedRoute from "../middleware/protectedRoute.js";
import upload from "../middleware/upLoadImage.js";

const router = express.Router();

router.get("/mis-propiedades", protectedRoute, getMyRealEstates);
router.get("/mis-propiedades/crear-propiedad", protectedRoute, getCreateRealEstate);
router.post("/mis-propiedades/crear-propiedad",
    protectedRoute,
    // Validaciones
    body('title').notEmpty().withMessage('El título es obligatorio.'),
    body('description').notEmpty().withMessage('La descripción es obligatoria.'),
    body('description').isLength({ max: 300 }).withMessage('La descripción debe tener como máximo 200 caracteres.'),
    body('category').isNumeric().withMessage('La categoría es obligatoria.'),
    body('price').isNumeric().withMessage('El precio es obligatorio.'),
    body('rooms').isNumeric().withMessage('Selecciona el número de habitaciones.'),
    body('parking').isNumeric().withMessage('Selecciona el número de estacionamientos.'),
    body('wc').isNumeric().withMessage('Selecciona el número de baños.'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa.'),

    postCreateRealEstate
);

router.get('/mis-propiedades/agregar-imagen/:id',  protectedRoute, getUploadRealEstateImage );
router.post('/mis-propiedades/agregar-imagen/:id',  
  protectedRoute, 
  upload.single('image'),
  postUploadRealEstateImage,
);

export default router;
