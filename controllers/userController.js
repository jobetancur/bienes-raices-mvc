// Controladores para las rutas de usuario
import { emailRegister } from '../helpers/emails.js';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import {createId} from '../helpers/tokens.js';

// GET para iniciar sesión
const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar sesión'
    });
}

// GET para registrar un nuevo usuario
const signUpForm = (req, res) => {
    res.render('auth/signup', {
        page: 'Crear cuenta'
    });
}

// POST para registrar un nuevo usuario
const newSignUpForm = async (req, res) => {
    // Validar los datos del formulario con express-validator
    await check('name').not().isEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('Ingresa un correo electrónico válido').run(req);
    await check('password').not().isEmpty().withMessage('La contraseña es obligatoria').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    await check('confirm').not().isEmpty().withMessage('Confirma la contraseña').run(req);
    await check('confirm').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let result = validationResult(req);

    // Validar que result sea un array vacío antes de crear el usuario
    if(!result.isEmpty()) {
        return res.render('auth/signup', {
            page: 'Crear cuenta',
            errors: result.array(),
            user: { // Enviar los datos del formulario para que no se borren
                name: req.body.name,
                email: req.body.email,
            }
        });
    }

    // Verificar que el correo electrónico no esté registrado
    const userRegistered = await User.findOne({ where: { email: req.body.email } });

    if(userRegistered) {
        return res.render('auth/signup', {
            page: 'Crear cuenta',
            errors: [{ msg: 'El usuario ya está registrado' }],
        });
    }
    
    // Crear el usuario en la base de datos usando try y catch
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        token: createId(),
    });

    // Enviar el correo electrónico de confirmación de registro
    emailRegister({ 
        name: user.name,
        email: user.email,
        token: user.token,
     });

    // Redireccionar al usuario a la página de confirmación de registro
    res.render('templates/message', {
        page: 'Confirmación de registro',
        msg: 'Su cuenta ha sido creada con éxito, por favor revise su correo para activarla.'
    });
    
}

// GET para confirmar la cuenta
const confirmAccount = async (req, res) => {
    req.params.token;

    // Verificar si el token es válido
    // Si el token es válido, activar la cuenta
    const tokenRegistered = await User.findOne({ where: { token: req.params.token } });
    console.log(tokenRegistered);

    // Confirmar la cuenta
    if(tokenRegistered) {
        tokenRegistered.active = 1;
        tokenRegistered.token = null;
        tokenRegistered.save(); // Guardar los cambios en la base de datos

        return res.render('templates/message', {
            page: 'Cuenta activada',
            msg: 'Su cuenta ha sido activada con éxito.'
        });
    } else {
        return res.render('templates/token-error-msg', {
            page: 'Error',
            msg: 'El token no es válido.'
        });
    }

}

// GET para restablecer la contraseña
const resetPasswordForm = (req, res) => {
    res.render('auth/reset-password', {
        page: 'Recordar contraseña'
    });
}

export {
    loginForm,
    signUpForm,
    resetPasswordForm,
    newSignUpForm,
    confirmAccount,
}