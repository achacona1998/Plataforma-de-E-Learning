const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  especialidad: {
    type: String,
    required: [true, 'La especialidad es requerida'],
    trim: true,
    maxlength: [50, 'La especialidad no puede tener más de 50 caracteres']
  }
}, {
  timestamps: true,
  versionKey: false
});

const Instructor = mongoose.model('Instructor', instructorSchema);

module.exports = Instructor;