const Estudiante = require('../models/estudiante.model');
const Inscripcion = require('../models/inscripcion.model');
const Progreso = require('../models/progreso.model');
const Certificado = require('../models/certificado.model');

// Get all students with pagination and filters
exports.getAllEstudiantes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filters = {};
    if (req.query.estado) filters.estado = req.query.estado;
    if (req.query.pais) filters.pais = new RegExp(req.query.pais, 'i');
    if (req.query.nivel_educacion) filters.nivel_educacion = req.query.nivel_educacion;
    
    // Búsqueda por nombre o correo
    if (req.query.search) {
      filters.$or = [
        { nombre: new RegExp(req.query.search, 'i') },
        { apellido: new RegExp(req.query.search, 'i') },
        { correo: new RegExp(req.query.search, 'i') }
      ];
    }

    const estudiantes = await Estudiante.find(filters)
      .sort({ fecha_registro: -1 })
      .skip(skip)
      .limit(limit)
      .select('-configuracion_notificaciones');

    const total = await Estudiante.countDocuments(filters);

    res.status(200).json({
      status: 'success',
      data: estudiantes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single student by ID with detailed information
exports.getEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    // Obtener información adicional del estudiante
    const inscripciones = await Inscripcion.find({ estudiante_id: req.params.id })
      .populate('curso_id', 'titulo descripcion precio duracion');
    
    const certificados = await Certificado.find({ estudiante_id: req.params.id })
      .populate('curso_id', 'titulo');

    res.status(200).json({
      status: 'success',
      data: {
        estudiante,
        inscripciones,
        certificados,
        resumen: {
          cursos_inscritos: inscripciones.length,
          certificados_obtenidos: certificados.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new student
exports.createEstudiante = async (req, res) => {
  try {
    // Verificar si el correo ya existe
    const existeEstudiante = await Estudiante.findOne({ correo: req.body.correo });
    if (existeEstudiante) {
      return res.status(400).json({
        status: 'error',
        message: 'Ya existe un estudiante con este correo electrónico'
      });
    }

    const nuevoEstudiante = await Estudiante.create(req.body);
    
    // No devolver información sensible
    const estudianteResponse = nuevoEstudiante.toJSON();
    delete estudianteResponse.configuracion_notificaciones;

    res.status(201).json({
      status: 'success',
      data: estudianteResponse,
      message: 'Estudiante creado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a student
exports.updateEstudiante = async (req, res) => {
  try {
    // No permitir actualizar ciertos campos
    const camposNoPermitidos = ['fecha_registro', 'estadisticas'];
    camposNoPermitidos.forEach(campo => delete req.body[campo]);

    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: estudiante,
      message: 'Estudiante actualizado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update student statistics
exports.updateEstadisticas = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    await estudiante.actualizarEstadisticas(req.body);

    res.status(200).json({
      status: 'success',
      data: estudiante.estadisticas,
      message: 'Estadísticas actualizadas exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update last connection
exports.updateUltimaConexion = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    await estudiante.actualizarUltimaConexion();

    res.status(200).json({
      status: 'success',
      message: 'Última conexión actualizada'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get student analytics
exports.getAnalytics = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    // Obtener progreso detallado
    const progreso = await Progreso.find({ estudiante_id: req.params.id })
      .populate('curso_id', 'titulo duracion')
      .populate('contenido_id', 'titulo tipo');

    // Calcular estadísticas
    const inscripciones = await Inscripcion.find({ estudiante_id: req.params.id });
    const certificados = await Certificado.find({ estudiante_id: req.params.id });

    const analytics = {
      estudiante: {
        nombre_completo: estudiante.nombre_completo,
        fecha_registro: estudiante.fecha_registro,
        ultima_conexion: estudiante.ultima_conexion
      },
      estadisticas: estudiante.estadisticas,
      progreso_detallado: progreso,
      resumen: {
        cursos_inscritos: inscripciones.length,
        cursos_completados: estudiante.estadisticas.cursos_completados,
        certificados_obtenidos: certificados.length,
        tiempo_total_horas: Math.round(estudiante.estadisticas.tiempo_total_aprendizaje / 60)
      }
    };

    res.status(200).json({
      status: 'success',
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a student (soft delete - change status to inactive)
exports.deleteEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndUpdate(
      req.params.id,
      { estado: 'inactivo' },
      { new: true }
    );
    
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Estudiante desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Permanently delete a student (hard delete)
exports.deleteEstudiantePermanente = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
    if (!estudiante) {
      return res.status(404).json({
        status: 'error',
        message: 'Estudiante no encontrado'
      });
    }

    // También eliminar datos relacionados
    await Inscripcion.deleteMany({ estudiante_id: req.params.id });
    await Progreso.deleteMany({ estudiante_id: req.params.id });
    await Certificado.deleteMany({ estudiante_id: req.params.id });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get students statistics for admin dashboard
exports.getEstadisticasGenerales = async (req, res) => {
  try {
    const totalEstudiantes = await Estudiante.countDocuments();
    const estudiantesActivos = await Estudiante.countDocuments({ estado: 'activo' });
    const estudiantesNuevos = await Estudiante.countDocuments({
      fecha_registro: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Estadísticas por país
    const estudiantesPorPais = await Estudiante.aggregate([
      { $match: { pais: { $exists: true, $ne: null } } },
      { $group: { _id: '$pais', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Estadísticas por nivel educativo
    const estudiantesPorNivel = await Estudiante.aggregate([
      { $group: { _id: '$nivel_educacion', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        resumen: {
          total: totalEstudiantes,
          activos: estudiantesActivos,
          nuevos_ultimo_mes: estudiantesNuevos,
          tasa_actividad: Math.round((estudiantesActivos / totalEstudiantes) * 100)
        },
        distribucion: {
          por_pais: estudiantesPorPais,
          por_nivel_educativo: estudiantesPorNivel
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};