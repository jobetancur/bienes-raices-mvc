import express from "express";
import { apiRealEstates } from "../controllers/apiController.js";

const router = express.Router();

router.get('/propiedades', apiRealEstates);

export default router;