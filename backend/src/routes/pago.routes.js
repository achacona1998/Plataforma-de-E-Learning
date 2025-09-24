const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const pagoController = require("../controllers/pago.controller");

const router = express.Router();

// Crear un nuevo pago
router.post(
  "/crear",
  authMiddleware.proteger,
  pagoController.crearPago
);

// Confirmar un pago
router.put(
  "/:pagoId/confirmar",
  authMiddleware.proteger,
  pagoController.confirmarPago
);

// Cancelar un pago
router.put(
  "/:pagoId/cancelar",
  authMiddleware.proteger,
  pagoController.cancelarPago
);

// Obtener pagos del estudiante autenticado
router.get(
  "/mis-pagos",
  authMiddleware.proteger,
  pagoController.getPagosEstudiante
);

// Obtener todos los pagos (admin)
router.get(
  "/admin/todos",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  pagoController.getTodosPagos
);

// Obtener estadísticas de pagos (admin)
router.get(
  "/admin/estadisticas",
  authMiddleware.proteger,
  authMiddleware.esAdmin,
  pagoController.getEstadisticasPagos
);

// Rutas legacy para Stripe y PayPal (mantener compatibilidad)
router.post("/stripe/create-session", authMiddleware.proteger, (req, res) => {
  try {
    // En una implementación real, aquí se crearía una sesión de pago con Stripe
    res.status(200).json({
      success: true,
      sessionId: "cs_test_" + Math.random().toString(36).substring(2, 15),
      url: "https://checkout.stripe.com/pay/cs_test_123456",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/paypal/confirm", authMiddleware.proteger, (req, res) => {
  try {
    // En una implementación real, aquí se verificaría el pago con PayPal
    res.status(200).json({
      success: true,
      message: "Pago confirmado correctamente",
      data: {
        orderId: req.body.orderId,
        courseId: req.body.courseId,
        userId: req.body.userId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
