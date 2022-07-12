import express from "express";
import { perfil, registrar, confirmar, autenticar,olvidePasword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioContrloller.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router()

///Parte del area publica
router.post('/', registrar)
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePasword)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)


//Area privada
router.get('/perfil',checkAuth, perfil)
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)
export default router