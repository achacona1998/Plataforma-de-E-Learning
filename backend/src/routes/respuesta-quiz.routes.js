const express = require('express');
const respuestaQuizController = require('../controllers/respuesta-quiz.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware.proteger);

// Rutas para estudiantes - realizar quizzes
router.post('/quiz/:quizId/iniciar', 
  authMiddleware.esEstudiante,
  respuestaQuizController.iniciarQuiz
);

router.post('/:respuestaQuizId/responder', 
  authMiddleware.esEstudiante,
  respuestaQuizController.enviarRespuesta
);

router.post('/:respuestaQuizId/finalizar', 
  authMiddleware.esEstudiante,
  respuestaQuizController.finalizarQuiz
);

// Rutas para ver resultados
router.get('/:respuestaQuizId/resultados', 
  respuestaQuizController.getResultadosQuiz
);

// Historial de intentos del estudiante
router.get('/quiz/:quizId/mis-intentos', 
  authMiddleware.esEstudiante,
  respuestaQuizController.getHistorialIntentos
);

// Rutas para instructores - ver todas las respuestas de un quiz
router.get('/quiz/:quizId/todas-respuestas', 
  authMiddleware.restringirA('instructor', 'admin'),
  respuestaQuizController.getRespuestasQuiz
);

module.exports = router;