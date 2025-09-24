const express = require('express');
const estudianteController = require('../controllers/estudiante.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas - solo lectura básica
router.get('/', estudianteController.getAllEstudiantes);

// Rutas protegidas - estudiantes pueden ver su propia información
router.get('/:id', 
  authMiddleware.proteger,
  estudianteController.getEstudiante
);

router.get('/:id/analytics', 
  authMiddleware.proteger,
  estudianteController.getAnalytics
);

// Rutas para que el estudiante actualice su propia información
router.patch('/:id', 
  authMiddleware.proteger,
  estudianteController.updateEstudiante
);

router.patch('/:id/ultima-conexion', 
  authMiddleware.proteger,
  estudianteController.updateUltimaConexion
);

// Rutas solo para admin
router.post('/', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  estudianteController.createEstudiante
);

router.patch('/:id/estadisticas', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  estudianteController.updateEstadisticas
);

router.delete('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  estudianteController.deleteEstudiante
);

router.delete('/:id/permanente', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  estudianteController.deleteEstudiantePermanente
);

// Ruta para estadísticas generales (solo admin)
router.get('/admin/estadisticas', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  estudianteController.getEstadisticasGenerales
);

module.exports = router;