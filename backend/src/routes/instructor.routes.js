const express = require('express');
const instructorController = require('../controllers/instructor.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas - solo lectura
router.get('/', instructorController.getAllInstructores);
router.get('/:id', instructorController.getInstructor);

// Rutas protegidas - solo admin puede crear, actualizar o eliminar instructores
router.post('/', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  instructorController.createInstructor
);

router.patch('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  instructorController.updateInstructor
);

router.delete('/:id', 
  authMiddleware.proteger, 
  authMiddleware.restringirA('admin'), 
  instructorController.deleteInstructor
);

module.exports = router;