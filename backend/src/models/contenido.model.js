const mongoose = require('mongoose');

const contenidoSchema = new mongoose.Schema({
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'El curso es requerido']
  },
  tipo: {
    type: String,
    required: [true, 'El tipo de contenido es requerido'],
    trim: true,
    maxlength: [20, 'El tipo no puede tener más de 20 caracteres'],
    enum: ['video', 'documento', 'quiz', 'tarea']
  },
  url: {
    type: String,
    required: [true, 'La URL del contenido es requerida'],
    trim: true,
    maxlength: [255, 'La URL no puede tener más de 255 caracteres']
  },
  duracion: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [0, 'La duración no puede ser negativa']
  }
}, {
  timestamps: true,
  versionKey: false
});

const Contenido = mongoose.model('Contenido', contenidoSchema);

module.exports = Contenido;