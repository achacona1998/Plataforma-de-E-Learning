const Quiz = require('../models/quiz.model');
const RespuestaQuiz = require('../models/respuesta-quiz.model');
const Curso = require('../models/curso.model');
const Estudiante = require('../models/estudiante.model');

// Obtener todos los quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('curso_id', 'titulo descripcion')
      .populate('contenido_id', 'titulo tipo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los quizzes',
      error: error.message
    });
  }
};

// Obtener quizzes por curso
exports.getQuizzesByCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;
    
    const quizzes = await Quiz.find({ 
      curso_id: cursoId,
      estado: 'publicado'
    })
      .populate('contenido_id', 'titulo tipo')
      .sort({ orden: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los quizzes del curso',
      error: error.message
    });
  }
};

// Obtener un quiz específico
exports.getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await Quiz.findById(id)
      .populate('curso_id', 'titulo descripcion instructor_id')
      .populate('contenido_id', 'titulo tipo');

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz no encontrado'
      });
    }

    // Si es un estudiante, verificar que esté inscrito en el curso
    if (req.usuario.rol === 'estudiante') {
      const estudiante = await Estudiante.findOne({ usuario_id: req.usuario.id });
      if (!estudiante) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de estudiante no encontrado'
        });
      }

      // Verificar inscripción (esto se puede mejorar con un middleware)
      // Por ahora permitimos el acceso si el quiz está publicado
      if (quiz.estado !== 'publicado') {
        return res.status(403).json({
          success: false,
          message: 'Quiz no disponible'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el quiz',
      error: error.message
    });
  }
};

// Crear un nuevo quiz (solo instructores y admin)
exports.createQuiz = async (req, res) => {
  try {
    const quizData = req.body;
    
    // Verificar que el curso existe
    const curso = await Curso.findById(quizData.curso_id);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Si es instructor, verificar que sea el propietario del curso
    if (req.usuario.rol === 'instructor') {
      const instructor = await Instructor.findOne({ usuario_id: req.usuario.id });
      if (!instructor || curso.instructor_id.toString() !== instructor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para crear quizzes en este curso'
        });
      }
    }

    const nuevoQuiz = await Quiz.create(quizData);
    
    const quizCompleto = await Quiz.findById(nuevoQuiz._id)
      .populate('curso_id', 'titulo descripcion')
      .populate('contenido_id', 'titulo tipo');

    res.status(201).json({
      success: true,
      message: 'Quiz creado exitosamente',
      data: quizCompleto
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el quiz',
      error: error.message
    });
  }
};

// Actualizar un quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz no encontrado'
      });
    }

    // Verificar permisos
    if (req.usuario.rol === 'instructor') {
      const curso = await Curso.findById(quiz.curso_id);
      const instructor = await Instructor.findOne({ usuario_id: req.usuario.id });
      
      if (!instructor || curso.instructor_id.toString() !== instructor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para editar este quiz'
        });
      }
    }

    const quizActualizado = await Quiz.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('curso_id', 'titulo descripcion')
      .populate('contenido_id', 'titulo tipo');

    res.status(200).json({
      success: true,
      message: 'Quiz actualizado exitosamente',
      data: quizActualizado
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el quiz',
      error: error.message
    });
  }
};

// Eliminar un quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz no encontrado'
      });
    }

    // Verificar permisos
    if (req.usuario.rol === 'instructor') {
      const curso = await Curso.findById(quiz.curso_id);
      const instructor = await Instructor.findOne({ usuario_id: req.usuario.id });
      
      if (!instructor || curso.instructor_id.toString() !== instructor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar este quiz'
        });
      }
    }

    // Verificar si hay respuestas asociadas
    const respuestasExistentes = await RespuestaQuiz.countDocuments({ quiz_id: id });
    if (respuestasExistentes > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el quiz porque ya tiene respuestas de estudiantes'
      });
    }

    await Quiz.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Quiz eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el quiz',
      error: error.message
    });
  }
};

// Obtener estadísticas de un quiz (para instructores)
exports.getEstadisticasQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz no encontrado'
      });
    }

    // Verificar permisos
    if (req.usuario.rol === 'instructor') {
      const curso = await Curso.findById(quiz.curso_id);
      const instructor = await Instructor.findOne({ usuario_id: req.usuario.id });
      
      if (!instructor || curso.instructor_id.toString() !== instructor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver las estadísticas de este quiz'
        });
      }
    }

    // Obtener estadísticas
    const totalRespuestas = await RespuestaQuiz.countDocuments({ quiz_id: id });
    const respuestasCompletadas = await RespuestaQuiz.countDocuments({ 
      quiz_id: id, 
      estado: 'completado' 
    });
    const respuestasAprobadas = await RespuestaQuiz.countDocuments({ 
      quiz_id: id, 
      aprobado: true 
    });

    // Calcular promedio de puntuación
    const promedioResult = await RespuestaQuiz.aggregate([
      { $match: { quiz_id: quiz._id, estado: 'completado' } },
      { $group: { _id: null, promedio: { $avg: '$puntuacion_porcentaje' } } }
    ]);
    
    const promedioPuntuacion = promedioResult.length > 0 ? promedioResult[0].promedio : 0;

    // Obtener distribución de puntuaciones
    const distribucionPuntuaciones = await RespuestaQuiz.aggregate([
      { $match: { quiz_id: quiz._id, estado: 'completado' } },
      {
        $bucket: {
          groupBy: '$puntuacion_porcentaje',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'otros',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const estadisticas = {
      totalRespuestas,
      respuestasCompletadas,
      respuestasAprobadas,
      tasaAprobacion: respuestasCompletadas > 0 ? (respuestasAprobadas / respuestasCompletadas * 100) : 0,
      promedioPuntuacion: Math.round(promedioPuntuacion * 100) / 100,
      distribucionPuntuaciones
    };

    res.status(200).json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las estadísticas del quiz',
      error: error.message
    });
  }
};