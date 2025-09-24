const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const paypalController = require('../controllers/paypal.controller');

const router = express.Router();

// Crear orden de pago con PayPal
router.post(
  '/create-order',
  authMiddleware.proteger,
  authMiddleware.esEstudiante,
  paypalController.crearOrdenPago
);

// Capturar pago de PayPal
router.post(
  '/capture/:order_id',
  authMiddleware.proteger,
  authMiddleware.esEstudiante,
  paypalController.capturarPago
);

// Verificar estado de orden
router.get(
  '/order/:order_id',
  authMiddleware.proteger,
  paypalController.verificarOrden
);

// Cancelar orden de PayPal
router.post(
  '/cancel/:order_id',
  authMiddleware.proteger,
  authMiddleware.esEstudiante,
  paypalController.cancelarOrden
);

// Webhook de PayPal (sin autenticación)
router.post(
  '/webhook',
  express.json(),
  paypalController.webhookPaypal
);

// Obtener configuración pública de PayPal
router.get(
  '/config',
  paypalController.getConfiguracionPublica
);

module.exports = router;