const express = require('express');
const contenidoController = require('../controllers/contenido.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas - solo lectura
router.get('/', contenidoController.getAllContenidos);
router.get('/:id', contenidoController.getContenido);
router.get('/curso/:cursoId', contenidoController.getContenidosByCurso);

// Rutas protegidas - solo instructores y admin pueden crear, actualizar o eliminar contenido
router.post('/', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  contenidoController.createContenido
);

router.patch('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  contenidoController.updateContenido
);

router.delete('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  contenidoController.deleteContenido
);

module.exports = router;