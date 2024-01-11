import multer from 'multer';
import path from 'path';
import { createId } from '../helpers/tokens.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
        // cb(null, './public/uploads/'); Debe ser en la carpeta publica para que se pueda acceder desde el front.
    }, 
    filename: (req, file, cb) => {
        cb(null, createId() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

export default upload;