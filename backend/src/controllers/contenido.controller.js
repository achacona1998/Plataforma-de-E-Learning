const Contenido = require('../models/contenido.model');

// Get all content
exports.getAllContenidos = async (req, res) => {
  try {
    const contenidos = await Contenido.find()
      .populate('curso_id', 'titulo');
    res.status(200).json({
      status: 'success',
      data: contenidos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get content by course ID
exports.getContenidosByCurso = async (req, res) => {
  try {
    const contenidos = await Contenido.find({ curso_id: req.params.cursoId })
      .populate('curso_id', 'titulo');
    res.status(200).json({
      status: 'success',
      data: contenidos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single content by ID
exports.getContenido = async (req, res) => {
  try {
    const contenido = await Contenido.findById(req.params.id)
      .populate('curso_id', 'titulo');
    if (!contenido) {
      return res.status(404).json({
        status: 'error',
        message: 'Contenido no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: contenido
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new content
exports.createContenido = async (req, res) => {
  try {
    const nuevoContenido = await Contenido.create(req.body);
    res.status(201).json({
      status: 'success',
      data: nuevoContenido
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update content
exports.updateContenido = async (req, res) => {
  try {
    const contenido = await Contenido.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('curso_id', 'titulo');

    if (!contenido) {
      return res.status(404).json({
        status: 'error',
        message: 'Contenido no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: contenido
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete content
exports.deleteContenido = async (req, res) => {
  try {
    const contenido = await Contenido.findByIdAndDelete(req.params.id);
    if (!contenido) {
      return res.status(404).json({
        status: 'error',
        message: 'Contenido no encontrado'
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