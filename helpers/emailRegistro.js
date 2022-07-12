import nodemailer from 'nodemailer'

const emailRegistro = async (datos) =>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log(datos);

      ///Enviar el Email
      const {email, nombre, token}=datos

      const info =await transporter.sendMail({
          from: 'APV - Administrador de Pacientes de Veterinaria',
          to: email,
          subject: 'Comprueba tu cuenta en APV',
          text: 'Comprueba tu cuenta en APV',
          html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
                <p>Tu cuenbta ya esta lista, solo debes de comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>


                <p>Si tu no creaste esta, puedes ignorar el mensaje</p>
          `
      })

      console.log('MENSAJE enviado: %s', info.messageId);
}

export default emailRegistro