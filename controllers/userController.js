// Controladores para las rutas de usuario
const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar sesión'
    });
}
const signUpForm = (req, res) => {
    res.render('auth/signup', {
        page: 'Crear cuenta'
    });
}
const resetPasswordForm = (req, res) => {
    res.render('auth/reset-password', {
        page: 'Recordar contraseña'
    });
}

export {
    loginForm,
    signUpForm,
    resetPasswordForm,
}