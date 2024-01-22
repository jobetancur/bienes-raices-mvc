// Controladores para las rutas de usuario
import { emailRegister, emailRecoverPassword } from '../helpers/emails.js';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import {createId, createToken} from '../helpers/tokens.js';
import bcrypt from 'bcrypt';

// GET para iniciar sesión
const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar sesión',
        csrfToken: req.csrfToken(),
    });
}

// POST para iniciar sesión
const authenticateUser = async (req, res) => {
    // Validar los datos del formulario con express-validator
    await check('email').isEmail().withMessage('Ingresa un correo electrónico válido').run(req);
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let result = validationResult(req);
    
    // Validar que result sea un array vacío antes de crear el usuario
    if(!result.isEmpty()) {
        return res.render('auth/login', {
            page: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        });
    } 

    // Verificar si el usuario existe

    // 1. Verificar si el correo electrónico está registrado
    const userRegistered = await User.findOne({ where: { email: req.body.email } });

    if(!userRegistered) {
        return res.render('auth/login', {
            page: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El usuario no existe' }],
        });
    } 

    // 2. Verificar si el usuario está activo
    if(userRegistered.active === 0) {
        return res.render('auth/login', {
            page: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El usuario no está activo' }],
        });
    }

    // 3. Verificar si el password es correcto
    if(!userRegistered.comparePassword(req.body.password)) {
        return res.render('auth/login', {
            page: 'Iniciar sesión',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'El password es incorrecto' }],
        });
    }

    // Autenticar el usuario usando JSON Web Tokens
    const token = createToken({
        id: userRegistered.id,
        name: userRegistered.name,
        email: userRegistered.email,
    });

    // Crear la cookie
    // 1. Crear la cookie
    return res.cookie('_token', token, {
        expires: new Date(Date.now() + 8 * 3600000), // 8 horas
        httpOnly: true, // La cookie solo se puede usar en el servidor
        secure: false, // La cookie solo se puede usar en HTTPS
        sameSite: false,
    }).redirect('/'); // 2. Redireccionar al usuario a la página de inicio

}    

// POST para cerrar sesión
const logoutUser = (req, res) => {
    // Eliminar la cookie
    return res.clearCookie('_token').status(200).redirect('/auth/login');
}

// GET para registrar un nuevo usuario
const signUpForm = (req, res) => {

    console.log(req.csrfToken()); // Imprimir el token CSRF en la consola

    res.render('auth/signup', {
        page: 'Crear cuenta',
        csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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
    // console.log(tokenRegistered);

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
        page: 'Recordar contraseña',
        csrfToken: req.csrfToken(),
    });
}

const resetPassword = async (req, res) => {
    // Validar los datos del formulario con express-validator
    await check('email').isEmail().withMessage('Ingresa un correo electrónico válido').run(req);

    let result = validationResult(req);

    // Validar que result sea un array vacío antes de crear el usuario
    if(!result.isEmpty()) {
        return res.render('auth/reset-password', {
            page: 'Recordar contraseña',
            csrfToken: req.csrfToken(),
            errors: result.array(),
        });
    }

    // Verificar que el correo electrónico esté registrado
    const userRegistered = await User.findOne({ where: { email: req.body.email } });

    if(!userRegistered) {
        return res.render('auth/reset-password', {
            page: 'Recordar contraseña',
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Parece que el correo no existe' }],
        });
    }

    // Enviar el correo electrónico de restablecimiento de contraseña

    // 1. Generar el token
    userRegistered.token = createId();

    // 2. Guardar el token en la base de datos
    await userRegistered.save();

    // 3. Enviar el correo electrónico
    emailRecoverPassword({ 
        name: userRegistered.name,
        email: userRegistered.email,
        token: userRegistered.token,
     });

    // 4. Mostrar mensaje de confirmación de envío de correo electrónico
    res.render('templates/message', {
        page: 'Correo electrónico enviado',
        msg: 'Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña.'
    });
}

// GET para crear nuevo password desde el enlace recibido en el email
const newPasswordForm = async (req, res) => {
    // Verificar si el token es válido
    // Si el token es válido, mostrar el formulario para crear el nuevo password
    const tokenRegistered = await User.findOne({ where: { token: req.params.token } });

    // Confirmar la cuenta
    if(tokenRegistered) {
        return res.render('auth/new-password', {
            page: 'Crear nueva contraseña',
            csrfToken: req.csrfToken(),
            token: req.params.token,
        });
    } else {
        return res.render('templates/token-error-msg', {
            page: 'Error',
            msg: 'Link de recuperación incorrecto, prueba nuevamente.'
        });
    }
}

// POST para crear el nuevo password que corresponda al usuario del token capturado
const createNewPassword = async (req, res) => {
    // Validar los datos del formulario con express-validator
    await check('password').not().isEmpty().withMessage('La contraseña es obligatoria').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
    await check('confirm').not().isEmpty().withMessage('Confirma la contraseña').run(req);
    await check('confirm').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let result = validationResult(req);

    // Validar que result sea un array vacío antes de crear el usuario
    if(!result.isEmpty()) {
        return res.render(`auth/new-password`, {
            page: 'Nuevo password',
            csrfToken: req.csrfToken(),
            token: req.params.token,
            errors: result.array(),
        });
    }

    // Verificar si el token es válido
    // Si el token es válido, mostrar el formulario para crear el nuevo password
    const tokenRegistered = await User.findOne({ where: { token: req.params.token } });
    // console.log(tokenRegistered);

    // Confirmar la cuenta
    if(tokenRegistered) {
        // Actualizar el password
        // Hashear el nuevo password
        const salt = await bcrypt.genSalt(10); // Generar el salt o hash
        tokenRegistered.password = await bcrypt.hash(req.body.password, salt); // Encriptar la contraseña
        tokenRegistered.token = null; // Eliminar el token para que no se pueda usar más
        await tokenRegistered.save(); // Guardar los cambios en la base de datos

        return res.render('templates/message', {
            page: 'Password actualizado',
            msg: 'Su password ha sido actualizado con éxito.'
        });
    } else {
        return res.render('templates/token-error-msg', {
            page: 'Error',
            msg: 'El token no es válido.'
        });
    }
}

export {
    loginForm,
    authenticateUser,
    logoutUser,
    signUpForm,
    resetPasswordForm,
    newSignUpForm,
    confirmAccount,
    resetPassword,
    newPasswordForm,
    createNewPassword,
}