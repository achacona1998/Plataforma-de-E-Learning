const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'El curso es requerido']
  },
  estudiante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: [true, 'El estudiante es requerido']
  },
  fecha_inscripcion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Ensure a student can only enroll once in a course
inscripcionSchema.index({ curso_id: 1, estudiante_id: 1 }, { unique: true });

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);

module.exports = Inscripcion;