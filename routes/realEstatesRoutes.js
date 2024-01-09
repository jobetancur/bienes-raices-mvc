import express from 'express';
import { getMyRealEstates, getCreateRealEstate } from '../controllers/realEstateController.js';

const router = express.Router();

router.get('/mis-propiedades', getMyRealEstates);
router.get('/mis-propiedades/crear-propiedad', getCreateRealEstate);

export default router;