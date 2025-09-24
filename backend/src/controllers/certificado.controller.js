const Certificado = require("../models/certificado.model");
const Inscripcion = require("../models/inscripcion.model");
const Curso = require("../models/curso.model");
const Progreso = require("../models/progreso.model");
const Contenido = require("../models/contenido.model");
const Estudiante = require("../models/estudiante.model");
const Instructor = require("../models/instructor.model");
const certificateGenerator = require("../services/certificateGenerator");
const path = require('path');

// Generar certificado para un curso completado
exports.generarCertificado = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const estudianteId = req.usuario.estudiante_id;

    // Verificar que el estudiante esté inscrito en el curso
    const inscripcion = await Inscripcion.findOne({
      estudiante_id: estudianteId,
      curso_id: cursoId
    });

    if (!inscripcion) {
      return res.status(404).json({
        success: false,
        message: 'No estás inscrito en este curso'
      });
    }

    // Verificar que el curso esté completado
    const totalContenidos = await Contenido.countDocuments({ curso_id: cursoId });
    const contenidosCompletados = await Progreso.countDocuments({
      estudiante_id: estudianteId,
      contenido_id: { $in: await Contenido.find({ curso_id: cursoId }).select('_id') },
      fecha_completado: { $ne: null }
    });

    const porcentajeCompletado = (contenidosCompletados / totalContenidos) * 100;

    if (porcentajeCompletado < 100) {
      return res.status(400).json({
        success: false,
        message: 'Debes completar el 100% del curso para obtener el certificado',
        progreso: porcentajeCompletado
      });
    }

    // Verificar si ya existe un certificado
    let certificado = await Certificado.findOne({
      estudiante_id: estudianteId,
      curso_id: cursoId
    });

    if (certificado) {
      return res.status(200).json({
        success: true,
        message: 'Certificado ya existe',
        data: certificado
      });
    }

    // Obtener datos del curso y estudiante
    const curso = await Curso.findById(cursoId).populate('instructor_id');
    const estudiante = await Estudiante.findById(estudianteId).populate('usuario_id');
    const instructor = await Instructor.findById(curso.instructor_id).populate('usuario_id');

    if (!curso || !estudiante) {
      return res.status(404).json({
        success: false,
        message: 'Curso o estudiante no encontrado'
      });
    }

    // Generar código de verificación único
    const codigoVerificacion = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calcular calificación promedio (simulada por ahora)
    const calificacionFinal = 85; // Esto debería calcularse basado en quizzes

    // Crear certificado
    certificado = new Certificado({
      estudiante_id: estudianteId,
      curso_id: cursoId,
      calificacion_final: calificacionFinal,
      fecha_emision: new Date(),
      codigo_verificacion: codigoVerificacion,
      url_certificado: `/uploads/certificates/certificate_temp.pdf`,
      estado: 'activo',
      metadata: {
        duracion_curso: `${curso.duracion_horas} horas`,
        instructor_nombre: instructor.usuario_id.nombre,
        fecha_completado: new Date()
      }
    });

    await certificado.save();

    // Generar PDF del certificado
    try {
      const certificateData = {
        studentName: estudiante.usuario_id.nombre,
        courseName: curso.titulo,
        instructorName: instructor.usuario_id.nombre,
        completionDate: new Date(),
        verificationCode: codigoVerificacion,
        certificateId: certificado._id
      };

      const pdfResult = await certificateGenerator.generateCertificate(certificateData);
      
      // Actualizar URL del certificado
      certificado.url_certificado = pdfResult.url;
      await certificado.save();
    } catch (pdfError) {
      console.error('Error generando PDF:', pdfError);
      // Continuar sin PDF por ahora
    }

    res.status(201).json({
      success: true,
      message: 'Certificado generado exitosamente',
      data: certificado
    });

  } catch (error) {
    console.error('Error al generar certificado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas de certificados (admin)
exports.getEstadisticasCertificados = async (req, res) => {
  try {
    // Contar certificados por estado
    const totalCertificados = await Certificado.countDocuments();
    const certificadosActivos = await Certificado.countDocuments({ estado: 'activo' });
    const certificadosRevocados = await Certificado.countDocuments({ estado: 'revocado' });

    // Obtener certificados recientes (últimos 30 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);
    const certificadosRecientes = await Certificado.countDocuments({
      fecha_emision: { $gte: fechaLimite }
    });

    // Calcular calificación promedio
    const resultadoPromedio = await Certificado.aggregate([
      { $match: { estado: 'activo' } },
      { $group: { _id: null, promedio: { $avg: '$calificacion_final' } } }
    ]);
    const calificacionPromedio = resultadoPromedio.length > 0 ? resultadoPromedio[0].promedio : 0;

    // Obtener certificados por curso (top 5)
    const certificadosPorCurso = await Certificado.aggregate([
      { $match: { estado: 'activo' } },
      { $group: { _id: '$curso_id', total: { $sum: 1 } } },
      { $lookup: { from: 'cursos', localField: '_id', foreignField: '_id', as: 'curso' } },
      { $unwind: '$curso' },
      { $project: { curso: '$curso.titulo', total: 1 } },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalCertificados,
        activos: certificadosActivos,
        revocados: certificadosRevocados,
        recientes: certificadosRecientes,
        calificacionPromedio: Math.round(calificacionPromedio * 100) / 100,
        porCurso: certificadosPorCurso
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de certificados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener certificados del usuario actual
exports.getCertificadosUsuario = async (req, res) => {
  try {
    // Verificar que el usuario tenga un estudiante_id
    if (!req.usuario.estudiante_id) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no tiene un perfil de estudiante asociado'
      });
    }

    const certificados = await Certificado.find({
      estudiante_id: req.usuario.estudiante_id
    })
    .populate({
      path: 'curso_id',
      select: 'titulo descripcion categoria imagen_url duracion_horas'
    })
    .populate({
      path: 'estudiante_id',
      select: 'nombre correo'
    })
    .sort({ fecha_emision: -1 });

    res.status(200).json({
      success: true,
      data: certificados
    });

  } catch (error) {
    console.error('Error al obtener certificados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Verificar certificado por código
exports.verificarCertificado = async (req, res) => {
  try {
    const { codigo } = req.params;

    const certificado = await Certificado.findOne({
      codigo_verificacion: codigo,
      estado: 'activo'
    })
    .populate({
      path: 'curso_id',
      select: 'titulo descripcion categoria duracion_horas'
    })
    .populate({
      path: 'estudiante_id',
      select: 'nombre correo'
    });

    if (!certificado) {
      return res.status(404).json({
        success: false,
        message: 'Certificado no encontrado o inválido'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        valido: true,
        estudiante: certificado.estudiante_id.nombre,
        curso: certificado.curso_id.titulo,
        fecha_emision: certificado.fecha_emision,
        calificacion: certificado.calificacion_final,
        codigo: certificado.codigo_verificacion
      }
    });

  } catch (error) {
    console.error('Error al verificar certificado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los certificados (admin)
exports.getTodosCertificados = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const certificados = await Certificado.find()
      .populate({
        path: 'curso_id',
        select: 'titulo categoria'
      })
      .populate({
        path: 'estudiante_id',
        select: 'nombre correo'
      })
      .sort({ fecha_emision: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Certificado.countDocuments();

    res.status(200).json({
      success: true,
      data: certificados,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener certificados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Revocar certificado (admin)
exports.revocarCertificado = async (req, res) => {
  try {
    const { certificadoId } = req.params;
    const { motivo } = req.body;

    const certificado = await Certificado.findByIdAndUpdate(
      certificadoId,
      { 
        estado: 'revocado',
        'metadata.motivo_revocacion': motivo,
        'metadata.fecha_revocacion': new Date()
      },
      { new: true }
    );

    if (!certificado) {
      return res.status(404).json({
        success: false,
        message: 'Certificado no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Certificado revocado exitosamente',
      data: certificado
    });

  } catch (error) {
    console.error('Error al revocar certificado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Descargar certificado en PDF
exports.descargarCertificado = async (req, res) => {
  try {
    const { certificadoId } = req.params;
    const estudianteId = req.usuario.estudiante_id;

    // Verificar que el certificado existe y pertenece al estudiante
    const certificado = await Certificado.findOne({
      _id: certificadoId,
      estudiante_id: estudianteId,
      estado: 'activo'
    }).populate('curso_id').populate({
      path: 'estudiante_id',
      select: 'nombre correo'
    });

    if (!certificado) {
      return res.status(404).json({
        success: false,
        message: 'Certificado no encontrado'
      });
    }

    // Verificar si el archivo PDF existe
    const filePath = path.join(__dirname, '..', certificado.url_certificado);
    
    try {
      // Intentar servir el archivo PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificado_${certificado.codigo_verificacion}.pdf"`);
      
      // En un entorno real, aquí usarías fs.createReadStream(filePath).pipe(res)
      // Por ahora, devolvemos la información del certificado
      res.status(200).json({
        success: true,
        message: 'Certificado disponible para descarga',
        data: {
          url_descarga: certificado.url_certificado,
          codigo_verificacion: certificado.codigo_verificacion,
          fecha_emision: certificado.fecha_emision,
          nombre_archivo: `certificado_${certificado.codigo_verificacion}.pdf`
        }
      });
    } catch (fileError) {
      console.error('Error al acceder al archivo:', fileError);
      res.status(404).json({
        success: false,
        message: 'Archivo de certificado no encontrado'
      });
    }

  } catch (error) {
    console.error('Error al descargar certificado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
