const express = require('express');
const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas - solo lectura para quizzes publicados
router.get('/', quizController.getAllQuizzes);
router.get('/curso/:cursoId', quizController.getQuizzesByCurso);

// Rutas protegidas - acceso a quiz específico
router.get('/:id', 
  authMiddleware.proteger, 
  quizController.getQuiz
);

// Rutas para instructores y admin - gestión de quizzes
router.post('/', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  quizController.createQuiz
);

router.patch('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  quizController.updateQuiz
);

router.delete('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  quizController.deleteQuiz
);

// Ruta para estadísticas del quiz (instructores y admin)
router.get('/:id/estadisticas', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('instructor', 'admin'), 
  quizController.getEstadisticasQuiz
);

module.exports = router;