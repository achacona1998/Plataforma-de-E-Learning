const Curso = require('../models/curso.model');

// Get all courses
exports.getAllCursos = async (req, res) => {
  try {
    const cursos = await Curso.find().populate('instructor_id', 'nombre especialidad');
    res.status(200).json({
      status: 'success',
      data: cursos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single course by ID
exports.getCurso = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('instructor_id', 'nombre especialidad');
    if (!curso) {
      return res.status(404).json({
        status: 'error',
        message: 'Curso no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: curso
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new course
exports.createCurso = async (req, res) => {
  try {
    const nuevoCurso = await Curso.create(req.body);
    res.status(201).json({
      status: 'success',
      data: nuevoCurso
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a course
exports.updateCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('instructor_id', 'nombre especialidad');
    
    if (!curso) {
      return res.status(404).json({
        status: 'error',
        message: 'Curso no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: curso
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a course
exports.deleteCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) {
      return res.status(404).json({
        status: 'error',
        message: 'Curso no encontrado'
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

// Get courses by instructor
exports.getCursosByInstructor = async (req, res) => {
  try {
    const cursos = await Curso.find({ instructor_id: req.params.instructorId })
      .populate('instructor_id', 'nombre especialidad');
    res.status(200).json({
      status: 'success',
      data: cursos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};