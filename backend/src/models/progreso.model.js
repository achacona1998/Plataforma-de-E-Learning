const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
  estudiante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: [true, 'El estudiante es requerido']
  },
  contenido_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contenido',
    required: [true, 'El contenido es requerido']
  },
  fecha_completado: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Ensure a student can only have one progress record per content
progresoSchema.index({ estudiante_id: 1, contenido_id: 1 }, { unique: true });

const Progreso = mongoose.model('Progreso', progresoSchema);

module.exports = Progreso;