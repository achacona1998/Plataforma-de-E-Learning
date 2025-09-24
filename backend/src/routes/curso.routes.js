const express = require('express');
const cursoController = require('../controllers/curso.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas
router.get('/', cursoController.getAllCursos);
router.get('/:id', cursoController.getCurso);
router.get('/instructor/:instructorId', cursoController.getCursosByInstructor);

// Rutas protegidas - solo instructores y admin pueden crear, actualizar o eliminar cursos
router.post('/', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  cursoController.createCurso
);

router.patch('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  cursoController.updateCurso
);

router.delete('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  cursoController.deleteCurso
);

module.exports = router;