const express = require("express");
const progresoController = require("../controllers/progreso.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Rutas públicas - solo lectura
router.get("/", progresoController.getAllProgresos);
router.get(
  "/estudiante/:estudianteId",
  progresoController.getProgresosByEstudiante
);
router.get(
  "/contenido/:contenidoId",
  progresoController.getProgresosByContenido
);

// Rutas protegidas - estudiantes pueden actualizar su propio progreso
router.post(
  "/",
  authMiddleware.proteger,
  progresoController.createOrUpdateProgreso
);

router.delete(
  "/:id",
  authMiddleware.proteger,
  authMiddleware.restringirA("admin"),
  progresoController.deleteProgreso
);

module.exports = router;
