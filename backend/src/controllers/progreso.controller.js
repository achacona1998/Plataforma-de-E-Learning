const Progreso = require('../models/progreso.model');

// Get all progress records
exports.getAllProgresos = async (req, res) => {
  try {
    const progresos = await Progreso.find()
      .populate('estudiante_id', 'nombre correo')
      .populate('contenido_id');
    res.status(200).json({
      status: 'success',
      data: progresos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get progress records by student ID
exports.getProgresosByEstudiante = async (req, res) => {
  try {
    const progresos = await Progreso.find({ estudiante_id: req.params.estudianteId })
      .populate('estudiante_id', 'nombre correo')
      .populate({
        path: 'contenido_id',
        populate: {
          path: 'curso_id',
          select: 'titulo'
        }
      });
    res.status(200).json({
      status: 'success',
      data: progresos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get progress records by content ID
exports.getProgresosByContenido = async (req, res) => {
  try {
    const progresos = await Progreso.find({ contenido_id: req.params.contenidoId })
      .populate('estudiante_id', 'nombre correo')
      .populate('contenido_id');
    res.status(200).json({
      status: 'success',
      data: progresos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create or update progress record
exports.createOrUpdateProgreso = async (req, res) => {
  try {
    // Check if a progress record already exists for this student and content
    let progreso = await Progreso.findOne({
      estudiante_id: req.body.estudiante_id,
      contenido_id: req.body.contenido_id
    });

    if (progreso) {
      // Update existing record
      progreso.fecha_completado = req.body.fecha_completado || progreso.fecha_completado;
      await progreso.save();
    } else {
      // Create new record
      progreso = await Progreso.create(req.body);
    }

    // Populate references
    progreso = await Progreso.findById(progreso._id)
      .populate('estudiante_id', 'nombre correo')
      .populate('contenido_id');

    res.status(201).json({
      status: 'success',
      data: progreso
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete progress record
exports.deleteProgreso = async (req, res) => {
  try {
    const progreso = await Progreso.findByIdAndDelete(req.params.id);
    if (!progreso) {
      return res.status(404).json({
        status: 'error',
        message: 'Registro de progreso no encontrado'
      });
    }
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