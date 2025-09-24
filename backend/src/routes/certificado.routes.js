const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const certificadoController = require("../controllers/certificado.controller");

const router = express.Router();

// Generar certificado para un curso completado
router.post(
  "/generar",
  authMiddleware.proteger,
  certificadoController.generarCertificado
);

// Obtener certificados del usuario autenticado
router.get(
  "/usuario",
  authMiddleware.proteger,
  certificadoController.getCertificadosUsuario
);

// Verificar un certificado por código
router.get(
  "/verificar/:codigo",
  certificadoController.verificarCertificado
);

// Obtener estadísticas de certificados (admin)
router.get(
  "/admin/stats",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  certificadoController.getEstadisticasCertificados
);

// Obtener todos los certificados (admin)
router.get(
  "/admin/todos",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  certificadoController.getTodosCertificados
);

// Revocar un certificado (admin)
router.put(
  "/admin/:certificadoId/revocar",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  certificadoController.revocarCertificado
);

// Descargar un certificado específico
router.get(
  "/:certificadoId/download",
  authMiddleware.proteger,
  certificadoController.descargarCertificado
);

module.exports = router;
