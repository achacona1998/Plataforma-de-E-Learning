const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const stripeController = require('../controllers/stripe.controller');

const router = express.Router();

// Crear sesión de pago con Stripe
router.post(
  '/create-session',
  authMiddleware.proteger,
  authMiddleware.esEstudiante,
  stripeController.crearSesionPago
);

// Verificar estado de sesión de pago
router.get(
  '/session/:session_id',
  authMiddleware.proteger,
  stripeController.verificarSesionPago
);

// Webhook de Stripe (sin autenticación)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeController.webhookStripe
);

// Obtener configuración pública de Stripe
router.get(
  '/config',
  stripeController.getConfiguracionPublica
);

module.exports = router;