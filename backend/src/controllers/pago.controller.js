const Pago = require('../models/pago.model');
const Curso = require('../models/curso.model');
const Estudiante = require('../models/estudiante.model');
const Inscripcion = require('../models/inscripcion.model');

// Crear un nuevo pago
exports.crearPago = async (req, res) => {
  try {
    const { curso_id, metodo_pago, transaction_id } = req.body;
    const estudiante_id = req.usuario.estudiante_id;

    // Verificar que el curso existe
    const curso = await Curso.findById(curso_id);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar que el estudiante no esté ya inscrito
    const inscripcionExistente = await Inscripcion.findOne({
      estudiante_id,
      curso_id
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás inscrito en este curso'
      });
    }

    // Verificar que no existe un pago pendiente o completado para este curso
    const pagoExistente = await Pago.findOne({
      estudiante_id,
      curso_id,
      estado: { $in: ['pendiente', 'completado'] }
    });

    if (pagoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un pago para este curso',
        data: pagoExistente
      });
    }

    // Crear el pago
    const nuevoPago = new Pago({
      estudiante_id,
      curso_id,
      monto: curso.precio,
      metodo_pago,
      transaction_id,
      estado: 'pendiente'
    });

    await nuevoPago.save();

    // Poblar los datos para la respuesta
    await nuevoPago.populate([
      {
        path: 'curso_id',
        select: 'titulo precio descripcion imagen'
      },
      {
        path: 'estudiante_id',
        populate: {
          path: 'usuario_id',
          select: 'nombre email'
        }
      }
    ]);

    res.status(201).json({
      success: true,
      message: 'Pago creado exitosamente',
      data: nuevoPago
    });

  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Confirmar un pago
exports.confirmarPago = async (req, res) => {
  try {
    const { pagoId } = req.params;
    const { transaction_id } = req.body;

    const pago = await Pago.findById(pagoId);
    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    if (pago.estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'El pago ya ha sido procesado'
      });
    }

    // Actualizar el pago
    pago.estado = 'completado';
    pago.fecha_pago = new Date();
    if (transaction_id) {
      pago.transaction_id = transaction_id;
    }

    await pago.save();

    // Crear la inscripción automáticamente
    const nuevaInscripcion = new Inscripcion({
      estudiante_id: pago.estudiante_id,
      curso_id: pago.curso_id,
      fecha_inscripcion: new Date(),
      estado: 'activo'
    });

    await nuevaInscripcion.save();

    // Poblar los datos para la respuesta
    await pago.populate([
      {
        path: 'curso_id',
        select: 'titulo precio descripcion imagen'
      },
      {
        path: 'estudiante_id',
        populate: {
          path: 'usuario_id',
          select: 'nombre email'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Pago confirmado e inscripción creada exitosamente',
      data: {
        pago,
        inscripcion: nuevaInscripcion
      }
    });

  } catch (error) {
    console.error('Error al confirmar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener pagos de un estudiante
exports.getPagosEstudiante = async (req, res) => {
  try {
    const estudiante_id = req.usuario.estudiante_id;
    const { estado, page = 1, limit = 10 } = req.query;

    const filtros = { estudiante_id };
    if (estado) {
      filtros.estado = estado;
    }

    const opciones = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { fecha_creacion: -1 },
      populate: [
        {
          path: 'curso_id',
          select: 'titulo precio descripcion imagen categoria'
        }
      ]
    };

    const pagos = await Pago.paginate(filtros, opciones);

    res.status(200).json({
      success: true,
      message: 'Pagos obtenidos exitosamente',
      data: pagos
    });

  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los pagos (admin)
exports.getTodosPagos = async (req, res) => {
  try {
    const { estado, metodo_pago, page = 1, limit = 10, fecha_inicio, fecha_fin } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (metodo_pago) filtros.metodo_pago = metodo_pago;
    
    if (fecha_inicio || fecha_fin) {
      filtros.createdAt = {};
      if (fecha_inicio) filtros.createdAt.$gte = new Date(fecha_inicio);
      if (fecha_fin) filtros.createdAt.$lte = new Date(fecha_fin);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalDocs = await Pago.countDocuments(filtros);
    
    // Get paginated results
    const pagos = await Pago.find(filtros)
      .populate({
        path: 'curso_id',
        select: 'titulo precio categoria'
      })
      .populate({
        path: 'estudiante_id',
        select: 'nombre correo fecha_registro'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    const paginationResult = {
      docs: pagos,
      totalDocs,
      limit: limitNum,
      page: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? pageNum + 1 : null,
      prevPage: hasPrevPage ? pageNum - 1 : null
    };

    res.status(200).json({
      success: true,
      message: 'Pagos obtenidos exitosamente',
      data: paginationResult
    });

  } catch (error) {
    console.error('Error al obtener todos los pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas de pagos (admin)
exports.getEstadisticasPagos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const filtroFecha = {};
    if (fecha_inicio || fecha_fin) {
      if (fecha_inicio) filtroFecha.$gte = new Date(fecha_inicio);
      if (fecha_fin) filtroFecha.$lte = new Date(fecha_fin);
    }

    const pipeline = [
      ...(Object.keys(filtroFecha).length > 0 ? [{ $match: { fecha_creacion: filtroFecha } }] : []),
      {
        $group: {
          _id: '$estado',
          total: { $sum: 1 },
          monto_total: { $sum: '$monto' }
        }
      }
    ];

    const estadisticasPorEstado = await Pago.aggregate(pipeline);

    // Estadísticas por método de pago
    const pipelineMetodo = [
      ...(Object.keys(filtroFecha).length > 0 ? [{ $match: { fecha_creacion: filtroFecha } }] : []),
      { $match: { estado: 'completado' } },
      {
        $group: {
          _id: '$metodo_pago',
          total: { $sum: 1 },
          monto_total: { $sum: '$monto' }
        }
      }
    ];

    const estadisticasPorMetodo = await Pago.aggregate(pipelineMetodo);

    // Total general
    const totalPagos = await Pago.countDocuments(
      Object.keys(filtroFecha).length > 0 ? { fecha_creacion: filtroFecha } : {}
    );

    const ingresosTotales = await Pago.aggregate([
      ...(Object.keys(filtroFecha).length > 0 ? [{ $match: { fecha_creacion: filtroFecha } }] : []),
      { $match: { estado: 'completado' } },
      { $group: { _id: null, total: { $sum: '$monto' } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        total_pagos: totalPagos,
        ingresos_totales: ingresosTotales[0]?.total || 0,
        por_estado: estadisticasPorEstado,
        por_metodo_pago: estadisticasPorMetodo
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Cancelar un pago
exports.cancelarPago = async (req, res) => {
  try {
    const { pagoId } = req.params;
    const { motivo } = req.body;

    const pago = await Pago.findById(pagoId);
    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    if (pago.estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden cancelar pagos pendientes'
      });
    }

    pago.estado = 'cancelado';
    if (motivo) {
      pago.metadata = { ...pago.metadata, motivo_cancelacion: motivo };
    }

    await pago.save();

    res.status(200).json({
      success: true,
      message: 'Pago cancelado exitosamente',
      data: pago
    });

  } catch (error) {
    console.error('Error al cancelar pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};