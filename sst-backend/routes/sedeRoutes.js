const express = require("express");
const sedeController = require("../controllers/sedeController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");
// solo admins gestionan sedes

const router = express.Router();

router.get("/",           authMiddleware,               sedeController.listarSedes);
router.post("/",          authMiddleware, adminOnly, sedeController.crearSede);
router.put("/:id",        authMiddleware, adminOnly, sedeController.actualizarSede);
router.delete("/:id",     authMiddleware, adminOnly, sedeController.eliminarSede);
router.get("/:id/usuarios-count", authMiddleware, adminOnly, sedeController.contarUsuarios);

module.exports = router;