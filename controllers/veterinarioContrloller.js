
import Veterinario from "../model/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarId.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"


const registrar = async (req, res) => {
    const { email, nombre } = req.body

    //Prevenir si se tienen usuarios duplicados
    const existeUduario = await Veterinario.findOne({ email })
    if (existeUduario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        ////ENVIAR EL EMAIL
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })


        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error);
    }

}

const perfil = (req, res) => {
    const { veterinario } = req
  /* res.json({ _id: veterinario._id,
        nombre: veterinario.nombre,
        email: veterinario.email,
        telefono: veterinario.telefono,
        web: veterinario.web
    })*/
        res.json(veterinario)
}

const confirmar = async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({ token })

    console.log(usuarioConfirmar);
    if (!usuarioConfirmar) {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true

        await usuarioConfirmar.save()

        res.json({ msg: 'Ususario confirmado corredctamente' })
    } catch (error) {
        console.log(error);
    }


}

const autenticar = async (req, res) => {

    const { email, password } = req.body

    //COmprobar si el usuario existe 
    const usuario = await Veterinario.findOne({ email })
    // console.log(usuario);
    if (!usuario) {
        const error = new Error('Usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    //Confirma si el usuario esta confirmado 
    if (!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada')
        return res.status(403).json({ msg: error.message })
    }

    //revisar el password
    if (await usuario.comprobarPassword(password)) {
        //autenticar
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            web: usuario.web,
            telefono: usuario.telefono,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('El password es incorrecto')
        return res.status(403).json({ msg: error.message })
    }
}

const olvidePasword = async (req, res) => {
    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({ email })

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(400).json({ msg: error.message })
    }



    //Enviar email con instrucciones
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //Enviar el email
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error);
    }

}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Veterinario.findOne({ token })

    if (tokenValido) {
        //El token es valido
        res.json({ msg: "Token Valido el usuariosi existe" })
    } else {
        const error = new Error("Token no valido")
        return res.status(400).json({ msg: error.message })
    }
}
const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const veterinario = await Veterinario.findOne({ token })
    if (!veterinario) {
        const error = new Error("Hubo un error")
        return res.status(400).json({ msg: error.message })
    }
    try {
        veterinario.token = null
        veterinario.password = password
        await veterinario.save()
        res.json({ msg: "Password Modificado correctamente" })
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) =>{
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    const {email}= req.body

    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})

        if(existeEmail){
            const error = new Error('Email ya registrado')
            return res.status(400).json({msg: error.message})
        }
    }


    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre
        veterinario.email = req.body.email || veterinario.email
        veterinario.web = req.body.web || veterinario.web
        veterinario.telefono = req.body.telefono || veterinario.telefono

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res)=>{
    //Leer los datos
    const {id}= req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body
    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    //comprobar password

    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({msg: 'Password Actualizado Correctamente'})
    }else{
        const error = new Error('El Password actual es incorrecto')
        return res.status(400).json({msg: error.message})
    }
    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePasword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}

