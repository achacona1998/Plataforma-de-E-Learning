const RespuestaQuiz = require('../models/respuesta-quiz.model');
const Quiz = require('../models/quiz.model');
const Estudiante = require('../models/estudiante.model');
const Inscripcion = require('../models/inscripcion.model');

// Iniciar un quiz (crear una nueva respuesta en progreso)
exports.iniciarQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    // Verificar que el quiz existe
    const quiz = await Quiz.findById(quizId).populate('curso_id');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz no encontrado'
      });
    }

    // Verificar que el quiz está publicado
    if (quiz.estado !== 'publicado') {
      return res.status(400).json({
        success: false,
        message: 'El quiz no está disponible'
      });
    }

    // Obtener el estudiante
    const estudiante = await Estudiante.findOne({ usuario_id: req.usuario.id });
    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de estudiante no encontrado'
      });
    }

    // Verificar inscripción en el curso
    const inscripcion = await Inscripcion.findOne({
      estudiante_id: estudiante._id,
      curso_id: quiz.curso_id._id,
      estado: 'activa'
    });

    if (!inscripcion) {
      return res.status(403).json({
        success: false,
        message: 'Debes estar inscrito en el curso para realizar este quiz'
      });
    }

    // Verificar intentos previos
    const intentosRealizados = await RespuestaQuiz.countDocuments({
      estudiante_id: estudiante._id,
      quiz_id: quizId
    });

    if (intentosRealizados >= quiz.intentos_permitidos) {
      return res.status(400).json({
        success: false,
        message: `Has agotado todos los intentos permitidos (${quiz.intentos_permitidos})`
      });
    }

    // Verificar si hay un intento en progreso
    const intentoEnProgreso = await RespuestaQuiz.findOne({
      estudiante_id: estudiante._id,
      quiz_id: quizId,
      estado: 'en_progreso'
    });

    if (intentoEnProgreso) {
      return res.status(200).json({
        success: true,
        message: 'Ya tienes un intento en progreso',
        data: intentoEnProgreso
      });
    }

    // Crear nuevo intento
    const nuevoIntento = await RespuestaQuiz.create({
      estudiante_id: estudiante._id,
      quiz_id: quizId,
      intento_numero: intentosRealizados + 1,
      respuestas: [],
      tiempo_inicio: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Quiz iniciado exitosamente',
      data: {
        respuestaQuizId: nuevoIntento._id,
        intentoNumero: nuevoIntento.intento_numero,
        tiempoInicio: nuevoIntento.tiempo_inicio,
        tiempoLimite: quiz.tiempo_limite
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar el quiz',
      error: error.message
    });
  }
};

// Enviar respuesta a una pregunta
exports.enviarRespuesta = async (req, res) => {
  try {
    const { respuestaQuizId } = req.params;
    const { preguntaId, respuestaSeleccionada } = req.body;

    // Verificar que la respuesta quiz existe y está en progreso
    const respuestaQuiz = await RespuestaQuiz.findById(respuestaQuizId)
      .populate('quiz_id');

    if (!respuestaQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Sesión de quiz no encontrada'
      });
    }

    if (respuestaQuiz.estado !== 'en_progreso') {
      return res.status(400).json({
        success: false,
        message: 'El quiz ya ha sido completado o ha expirado'
      });
    }

    // Verificar que el usuario es el propietario de la respuesta
    const estudiante = await Estudiante.findOne({ usuario_id: req.usuario.id });
    if (respuestaQuiz.estudiante_id.toString() !== estudiante._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar esta respuesta'
      });
    }

    // Verificar tiempo límite
    const tiempoTranscurrido = (new Date() - respuestaQuiz.tiempo_inicio) / (1000 * 60); // en minutos
    if (tiempoTranscurrido > respuestaQuiz.quiz_id.tiempo_limite) {
      // Marcar como tiempo agotado
      respuestaQuiz.estado = 'tiempo_agotado';
      respuestaQuiz.tiempo_finalizacion = new Date();
      await respuestaQuiz.save();

      return res.status(400).json({
        success: false,
        message: 'El tiempo para completar el quiz ha expirado'
      });
    }

    // Buscar la pregunta en el quiz
    const pregunta = respuestaQuiz.quiz_id.preguntas.id(preguntaId);
    if (!pregunta) {
      return res.status(404).json({
        success: false,
        message: 'Pregunta no encontrada en este quiz'
      });
    }

    // Evaluar la respuesta
    let esCorrecta = false;
    let puntosObtenidos = 0;

    if (pregunta.tipo === 'multiple_choice') {
      const opcionSeleccionada = pregunta.opciones.id(respuestaSeleccionada);
      if (opcionSeleccionada && opcionSeleccionada.es_correcta) {
        esCorrecta = true;
        puntosObtenidos = pregunta.puntos;
      }
    } else if (pregunta.tipo === 'verdadero_falso') {
      const opcionSeleccionada = pregunta.opciones.id(respuestaSeleccionada);
      if (opcionSeleccionada && opcionSeleccionada.es_correcta) {
        esCorrecta = true;
        puntosObtenidos = pregunta.puntos;
      }
    } else if (pregunta.tipo === 'texto_libre') {
      // Para texto libre, comparación simple (se puede mejorar)
      if (respuestaSeleccionada.toLowerCase().trim() === pregunta.respuesta_correcta.toLowerCase().trim()) {
        esCorrecta = true;
        puntosObtenidos = pregunta.puntos;
      }
    }

    // Verificar si ya existe una respuesta para esta pregunta
    const respuestaExistente = respuestaQuiz.respuestas.find(
      r => r.pregunta_id.toString() === preguntaId
    );

    if (respuestaExistente) {
      // Actualizar respuesta existente
      respuestaExistente.respuesta_seleccionada = respuestaSeleccionada;
      respuestaExistente.es_correcta = esCorrecta;
      respuestaExistente.puntos_obtenidos = puntosObtenidos;
    } else {
      // Agregar nueva respuesta
      respuestaQuiz.respuestas.push({
        pregunta_id: preguntaId,
        respuesta_seleccionada: respuestaSeleccionada,
        es_correcta: esCorrecta,
        puntos_obtenidos: puntosObtenidos
      });
    }

    await respuestaQuiz.save();

    res.status(200).json({
      success: true,
      message: 'Respuesta guardada exitosamente',
      data: {
        esCorrecta,
        puntosObtenidos,
        totalRespuestas: respuestaQuiz.respuestas.length,
        totalPreguntas: respuestaQuiz.quiz_id.preguntas.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al enviar la respuesta',
      error: error.message
    });
  }
};

// Finalizar quiz
exports.finalizarQuiz = async (req, res) => {
  try {
    const { respuestaQuizId } = req.params;

    const respuestaQuiz = await RespuestaQuiz.findById(respuestaQuizId)
      .populate('quiz_id');

    if (!respuestaQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Sesión de quiz no encontrada'
      });
    }

    if (respuestaQuiz.estado !== 'en_progreso') {
      return res.status(400).json({
        success: false,
        message: 'El quiz ya ha sido completado'
      });
    }

    // Verificar que el usuario es el propietario
    const estudiante = await Estudiante.findOne({ usuario_id: req.usuario.id });
    if (respuestaQuiz.estudiante_id.toString() !== estudiante._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para finalizar esta respuesta'
      });
    }

    // Calcular puntuación final
    const totalPuntos = respuestaQuiz.quiz_id.preguntas.reduce((sum, pregunta) => sum + pregunta.puntos, 0);
    const puntosObtenidos = respuestaQuiz.respuestas.reduce((sum, respuesta) => sum + respuesta.puntos_obtenidos, 0);
    const porcentaje = totalPuntos > 0 ? (puntosObtenidos / totalPuntos) * 100 : 0;

    // Actualizar respuesta quiz
    respuestaQuiz.estado = 'completado';
    respuestaQuiz.tiempo_finalizacion = new Date();
    respuestaQuiz.puntuacion_total = puntosObtenidos;
    respuestaQuiz.puntuacion_porcentaje = Math.round(porcentaje * 100) / 100;
    respuestaQuiz.aprobado = porcentaje >= respuestaQuiz.quiz_id.puntuacion_minima;

    await respuestaQuiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz finalizado exitosamente',
      data: {
        puntuacionTotal: respuestaQuiz.puntuacion_total,
        puntuacionPorcentaje: respuestaQuiz.puntuacion_porcentaje,
        aprobado: respuestaQuiz.aprobado,
        tiempoTranscurrido: respuestaQuiz.tiempo_transcurrido,
        puntuacionMinima: respuestaQuiz.quiz_id.puntuacion_minima
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al finalizar el quiz',
      error: error.message
    });
  }
};

// Obtener resultados de un quiz
exports.getResultadosQuiz = async (req, res) => {
  try {
    const { respuestaQuizId } = req.params;

    const respuestaQuiz = await RespuestaQuiz.findById(respuestaQuizId)
      .populate('quiz_id')
      .populate('estudiante_id', 'nombre correo');

    if (!respuestaQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Resultados no encontrados'
      });
    }

    // Verificar permisos
    const estudiante = await Estudiante.findOne({ usuario_id: req.usuario.id });
    const esPropio = estudiante && respuestaQuiz.estudiante_id._id.toString() === estudiante._id.toString();
    const esInstructor = req.usuario.rol === 'instructor' || req.usuario.rol === 'admin';

    if (!esPropio && !esInstructor) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver estos resultados'
      });
    }

    // Preparar datos de respuesta con detalles
    const respuestasDetalladas = respuestaQuiz.respuestas.map(respuesta => {
      const pregunta = respuestaQuiz.quiz_id.preguntas.id(respuesta.pregunta_id);
      return {
        pregunta: pregunta ? pregunta.pregunta : 'Pregunta no encontrada',
        tipo: pregunta ? pregunta.tipo : 'unknown',
        respuestaSeleccionada: respuesta.respuesta_seleccionada,
        esCorrecta: respuesta.es_correcta,
        puntosObtenidos: respuesta.puntos_obtenidos,
        puntosPosibles: pregunta ? pregunta.puntos : 0,
        explicacion: pregunta ? pregunta.explicacion : null
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          titulo: respuestaQuiz.quiz_id.titulo,
          descripcion: respuestaQuiz.quiz_id.descripcion
        },
        estudiante: respuestaQuiz.estudiante_id,
        intentoNumero: respuestaQuiz.intento_numero,
        estado: respuestaQuiz.estado,
        puntuacionTotal: respuestaQuiz.puntuacion_total,
        puntuacionPorcentaje: respuestaQuiz.puntuacion_porcentaje,
        aprobado: respuestaQuiz.aprobado,
        tiempoInicio: respuestaQuiz.tiempo_inicio,
        tiempoFinalizacion: respuestaQuiz.tiempo_finalizacion,
        tiempoTranscurrido: respuestaQuiz.tiempo_transcurrido,
        respuestas: respuestasDetalladas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los resultados',
      error: error.message
    });
  }
};

// Obtener historial de intentos de un estudiante para un quiz
exports.getHistorialIntentos = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const estudiante = await Estudiante.findOne({ usuario_id: req.usuario.id });
    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de estudiante no encontrado'
      });
    }

    const intentos = await RespuestaQuiz.find({
      estudiante_id: estudiante._id,
      quiz_id: quizId
    })
      .populate('quiz_id', 'titulo intentos_permitidos puntuacion_minima')
      .sort({ intento_numero: -1 });

    res.status(200).json({
      success: true,
      data: intentos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de intentos',
      error: error.message
    });
  }
};

// Obtener todas las respuestas de un quiz (para instructores)
exports.getRespuestasQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Verificar que el quiz existe
    const quiz = await Quiz.findById(quizId).populate('curso_id');
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz no encontrado'
      });
    }

    // Verificar permisos (solo instructores del curso y admin)
    if (req.usuario.rol === 'instructor') {
      const instructor = await Instructor.findOne({ usuario_id: req.usuario.id });
      if (!instructor || quiz.curso_id.instructor_id.toString() !== instructor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver las respuestas de este quiz'
        });
      }
    }

    const respuestas = await RespuestaQuiz.find({ quiz_id: quizId })
      .populate('estudiante_id', 'nombre correo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: respuestas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las respuestas del quiz',
      error: error.message
    });
  }
};