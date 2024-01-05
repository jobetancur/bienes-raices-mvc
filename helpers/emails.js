import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const emailRegister = async (data) => {

    // Primero se inicia sesión en el servicio de correo electrónico
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    // Enviar el email
    await transport.sendMail({
        from: 'Bienes Raíces',
        to: email,
        subject: 'Confirma tu cuenta: Bienes Raíces',
        html: `
            <p>Hola ${name},</p>
            <p>Gracias por registrarte en Bienes Raíces.</p>
            <p>Confirma tu cuenta haciendo click en el siguiente enlace:</p>
            <a href="${process.env.BACKEND_URL}:${process.env.BACKEND_PORT ?? 4000}/auth/confirm-account/${token}">Confirmar Cuenta</a>
        `
    });
}

const emailRecoverPassword = async (data) => {

    // Primero se inicia sesión en el servicio de correo electrónico
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    // Enviar el email
    await transport.sendMail({
        from: 'Bienes Raíces',
        to: email,
        subject: 'Recuperar contraseña: Bienes Raíces',
        html: `
            <p>Hola ${name},</p>
            <p>Aquí tienes las instrucciones para recuperar tu contraseña.</p>
            <p>Crea un nuevo password haciendo click en el siguiente enlace:</p>
            <a href="${process.env.BACKEND_URL}:${process.env.BACKEND_PORT ?? 4000}/auth/new-password/${token}">Recordar contraseña</a>
        `
    });
}

export {
    emailRegister,
    emailRecoverPassword,
}