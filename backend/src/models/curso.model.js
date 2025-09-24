const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: [true, 'El instructor es requerido']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  moneda: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'MXN', 'COP', 'ARS']
  },
  duracion_horas: {
    type: Number,
    required: [true, 'La duración en horas es requerida'],
    min: [0.5, 'La duración mínima es 0.5 horas']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['programacion', 'diseño', 'marketing', 'negocios', 'idiomas', 'ciencias', 'arte', 'musica', 'otros']
  },
  nivel: {
    type: String,
    enum: ['principiante', 'intermedio', 'avanzado'],
    default: 'principiante'
  },
  imagen_url: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['borrador', 'publicado', 'archivado'],
    default: 'borrador'
  },
  requisitos: [{
    type: String,
    trim: true
  }],
  objetivos: [{
    type: String,
    trim: true
  }],
  calificacion_promedio: {
    type: Number,
    default: 0,
    min: [0, 'La calificación no puede ser menor a 0'],
    max: [5, 'La calificación no puede ser mayor a 5']
  },
  total_estudiantes: {
    type: Number,
    default: 0,
    min: [0, 'El total de estudiantes no puede ser negativo']
  },
  fecha_publicacion: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;