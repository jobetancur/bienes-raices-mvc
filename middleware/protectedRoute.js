import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Middleware para proteger rutas
const protectedRoute = async (req, res, next) => {
    // Verificar si existe un token
    const { _token } = req.cookies;
    if (!_token) {
        return res.redirect('/auth/login');
    } 

    // Verificar si el token es válido
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);

        // El scope elimina está creado en el modelo User y en este caso elimina información sensible como la contraseña y que no queremos que se retorne en la consulta.
        const user = await User.scope('deletePassword').findByPk(decoded.id);
        
        // Almacenar el usuario en el req para acceder a él desde diferentes partes de la aplicación.
        if (!user) {
            return res.clearCookie('_token').redirect('/auth/login');
        } else {
            req.user = user;
        }
        return next();

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
};

export default protectedRoute;