import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const identifyUser = async (req, res, next) => {
    const { _token } = req.cookies;

    if (!_token) {
        req.user = null;
        return next();
    }

    try {

        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const user = await User.scope('deletePassword').findByPk(decoded.id);

        if(user){
          req.user = user;
        }

        return next();

    } catch (error) {
        console.log(error);
        res.status(401).send({ error: 'Please authenticate.' });
        return res.clearCookie('_token').redirect('/auth/login');
    }
};

export default identifyUser;

