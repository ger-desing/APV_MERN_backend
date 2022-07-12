
import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) =>{
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
          subject: 'Reestablece tu Password',
          text: 'Reestablece tu Password',
          html: `<p>Hola: ${nombre}, has solicitado reestableces tu password.</p>
                <p>Sigue el siguiente enlace para reestablecer tu password:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restableces Password</a></p>


                <p>Si tu no creaste esta, puedes ignorar el mensaje</p>
          `
      })

      console.log('MENSAJE enviado: %s', info.messageId);
}

export default emailOlvidePassword