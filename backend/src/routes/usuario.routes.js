const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const usuarioController = require("../controllers/usuario.controller");

const router = express.Router();

// Rutas de administración (solo admin)
router.get(
  "/",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  usuarioController.obtenerUsuarios
);

router.post(
  "/",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  usuarioController.crearUsuario
);

// Ruta para obtener el progreso del usuario
router.get(
  "/progreso",
  authMiddleware.proteger,
  usuarioController.getProgresoUsuario
);

// Ruta para obtener estadísticas del usuario
router.get(
  "/stats",
  authMiddleware.proteger,
  usuarioController.getEstadisticasUsuario
);

// Ruta para obtener estadísticas administrativas (solo admin)
router.get(
  "/admin/estadisticas",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  usuarioController.getEstadisticasAdmin
);

router.get(
  "/:id",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  usuarioController.obtenerUsuarioPorId
);

router.put(
  "/:id",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  usuarioController.actualizarUsuario
);

router.delete(
  "/:id",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  usuarioController.eliminarUsuario
);

module.exports = router;
