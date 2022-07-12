import express from "express"
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, elmininarPaciente } from "../controllers/pacienteController.js"
import checkauth from "../middleware/authMiddleware.js"

const router = express.Router()

router
    .route('/')
    .post(checkauth, agregarPaciente)
    .get(checkauth, obtenerPacientes)

router
    .route('/:id')
    .get(checkauth, obtenerPaciente)
    .put(checkauth, actualizarPaciente)
    .delete(checkauth, elmininarPaciente)

export default router