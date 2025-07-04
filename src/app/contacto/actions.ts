'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  email: z.string().email({ message: 'El correo electrónico no es válido.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
  gRecaptchaToken: z.string().min(1, { message: 'El token de reCAPTCHA es requerido.'}),
});

export async function sendContactEmail(data: unknown) {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message, gRecaptchaToken } = validatedFields.data;

  // reCAPTCHA validation
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('Missing reCAPTCHA secret key in .env file');
    return { success: false, error: 'La configuración del servidor está incompleta. Contacte al administrador.' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${gRecaptchaToken}`,
    });
    const recaptchaData = await response.json();
    
    // The score is a value between 0.0 and 1.0. 0.5 is a common threshold.
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.warn('reCAPTCHA verification failed:', recaptchaData['error-codes']);
      return { success: false, error: 'Falló la verificación de reCAPTCHA. Pareces ser un bot.' };
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return { success: false, error: 'Hubo un error al verificar el reCAPTCHA. Inténtalo de nuevo.' };
  }
  
  // Email server configuration validation
  if (
    !process.env.EMAIL_SERVER_HOST ||
    !process.env.EMAIL_SERVER_PORT ||
    !process.env.EMAIL_SERVER_USER ||
    !process.env.EMAIL_SERVER_PASSWORD ||
    !process.env.EMAIL_FROM ||
    !process.env.EMAIL_TO
  ) {
    console.error('Missing email server configuration in .env file');
    return { success: false, error: 'La configuración del servidor de correo está incompleta. Contacte al administrador.' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    await transporter.verify();
  } catch(error) {
    console.error('Error verifying email transporter:', error);
    return { success: false, error: 'La configuración del correo es inválida. Contacte al administrador.' };
  }


  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de contacto de ${name}`,
      replyTo: email,
      html: `<p>Has recibido un nuevo mensaje de tu sitio web:</p>
             <p><strong>Nombre:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensaje:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' };
  }
}
