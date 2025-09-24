const Instructor = require('../models/instructor.model');

// Get all instructors
exports.getAllInstructores = async (req, res) => {
  try {
    const instructores = await Instructor.find();
    res.status(200).json({
      status: 'success',
      data: instructores
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single instructor by ID
exports.getInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({
        status: 'error',
        message: 'Instructor no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: instructor
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new instructor
exports.createInstructor = async (req, res) => {
  try {
    const nuevoInstructor = await Instructor.create(req.body);
    res.status(201).json({
      status: 'success',
      data: nuevoInstructor
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update an instructor
exports.updateInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!instructor) {
      return res.status(404).json({
        status: 'error',
        message: 'Instructor no encontrado'
      });
    }
    res.status(200).json({
      status: 'success',
      data: instructor
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete an instructor
exports.deleteInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({
        status: 'error',
        message: 'Instructor no encontrado'
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