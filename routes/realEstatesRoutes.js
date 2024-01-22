import express from "express";
import { body } from 'express-validator'; // Cuando se hace desde el router se debe trabajar con body y no con check.
import {
  getMyRealEstates,
  getCreateRealEstate,
  postCreateRealEstate,
  getUploadRealEstateImage,
  postUploadRealEstateImage,
  changeStateRealEstate,
  editRealEstate,
  postEditRealEstate,
  deleteRealEstate,
  getRealEstateById,
  sendMessage,
  getMessages,
} from "../controllers/realEstateController.js";
import protectedRoute from "../middleware/protectedRoute.js";
import identifyUser from "../middleware/identifyUser.js";
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

// Ruta para cambiar el estado de la propiedad
router.put('/mis-propiedades/:id', protectedRoute, changeStateRealEstate);

// Hacemos el get con el id de la propiedad para mostrar solo esa información.
router.get('/mis-propiedades/editar/:id', protectedRoute, editRealEstate)

// POST para guardar los cambios editados en la propiedad.
router.post('/mis-propiedades/editar/:id', 
  protectedRoute,
  // Validaciones
  body('title').notEmpty().withMessage('El título es obligatorio.'),
  body('description').notEmpty().withMessage('La descripción es obligatoria.'),
  body('description').isLength({ max: 300 }).withMessage('La descripción debe tener como máximo 300 caracteres.'),
  body('category').isNumeric().withMessage('La categoría es obligatoria.'),
  body('price').isNumeric().withMessage('El precio es obligatorio.'),
  body('rooms').isNumeric().withMessage('Selecciona el número de habitaciones.'),
  body('parking').isNumeric().withMessage('Selecciona el número de estacionamientos.'),
  body('wc').isNumeric().withMessage('Selecciona el número de baños.'),
  body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa.'),

  postEditRealEstate
);

// Ruta para eliminar una propiedad
router.post('/mis-propiedades/eliminar/:id', protectedRoute, deleteRealEstate);

// Área pública
// GET para listar todas las propiedades
router.get('/propiedad/:id', identifyUser, getRealEstateById);

// Almacenar los mensajes enviados
router.post('/propiedad/:id',
  // Validación de identificación de usuario
  identifyUser,

  // Validaciones de los campos del formulario
  body('message').isLength({ min: 30 }).withMessage('El mensaje es muy corto o el campo está vacío (mínimo 20 caracteres).'),
  body('message').isLength({ max: 300 }).withMessage('El mensaje debe tener como máximo 300 caracteres.'),

  // Envío del mensaje
  sendMessage
);

router.get('/mensajes/:id', protectedRoute, getMessages);

export default router;
