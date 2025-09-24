const express = require('express');
const inscripcionController = require('../controllers/inscripcion.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas - solo lectura
router.get('/', inscripcionController.getAllInscripciones);
router.get('/estudiante/:estudianteId', inscripcionController.getInscripcionesByEstudiante);
router.get('/curso/:cursoId', inscripcionController.getInscripcionesByCurso);

// Ruta para obtener inscripciones del usuario actual
router.get('/usuario', 
  authMiddleware.proteger, 
  inscripcionController.getInscripcionesUsuario
);

// Rutas protegidas - estudiantes pueden inscribirse, admin puede gestionar todas las inscripciones
router.post('/', 
  authMiddleware.proteger, 
  inscripcionController.createInscripcion
);

router.delete('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  inscripcionController.deleteInscripcion
);

module.exports = router;