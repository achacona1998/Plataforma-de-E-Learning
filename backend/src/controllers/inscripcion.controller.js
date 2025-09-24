const Inscripcion = require('../models/inscripcion.model');

// Get all enrollments
exports.getAllInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find()
      .populate('curso_id', 'titulo')
      .populate('estudiante_id', 'nombre correo');
    res.status(200).json({
      status: 'success',
      data: inscripciones
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get enrollments by student ID
exports.getInscripcionesByEstudiante = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({ estudiante_id: req.params.estudianteId })
      .populate('curso_id', 'titulo')
      .populate('estudiante_id', 'nombre correo');
    res.status(200).json({
      status: 'success',
      data: inscripciones
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get enrollments by course ID
exports.getInscripcionesByCurso = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({ curso_id: req.params.cursoId })
      .populate('curso_id', 'titulo')
      .populate('estudiante_id', 'nombre correo');
    res.status(200).json({
      status: 'success',
      data: inscripciones
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get enrollments for current user
exports.getInscripcionesUsuario = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find({ estudiante_id: req.usuario.estudiante_id })
      .populate('curso_id', 'titulo descripcion precio instructor_id')
      .populate('estudiante_id', 'nombre correo');
    res.status(200).json({
      status: 'success',
      data: inscripciones
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new enrollment
exports.createInscripcion = async (req, res) => {
  try {
    const nuevaInscripcion = await Inscripcion.create(req.body);
    const inscripcion = await Inscripcion.findById(nuevaInscripcion._id)
      .populate('curso_id', 'titulo')
      .populate('estudiante_id', 'nombre correo');
    res.status(201).json({
      status: 'success',
      data: inscripcion
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete enrollment
exports.deleteInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({
        status: 'error',
        message: 'Inscripción no encontrada'
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