const mongoose = require('mongoose');

const certificadoSchema = new mongoose.Schema({
  estudiante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: [true, 'El estudiante es requerido']
  },
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'El curso es requerido']
  },
  fecha_emision: {
    type: Date,
    default: Date.now
  },
  codigo_verificacion: {
    type: String,
    unique: true,
    required: [true, 'El código de verificación es requerido']
  },
  url_certificado: {
    type: String,
    required: [true, 'La URL del certificado es requerida']
  },
  calificacion_final: {
    type: Number,
    min: [0, 'La calificación no puede ser menor a 0'],
    max: [100, 'La calificación no puede ser mayor a 100'],
    required: [true, 'La calificación final es requerida']
  },
  estado: {
    type: String,
    enum: ['activo', 'revocado'],
    default: 'activo'
  },
  metadata: {
    duracion_curso: String,
    instructor_nombre: String,
    fecha_completado: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// Generar código de verificación único antes de guardar
certificadoSchema.pre('save', function(next) {
  if (!this.codigo_verificacion) {
    this.codigo_verificacion = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Índice compuesto para evitar certificados duplicados
certificadoSchema.index({ estudiante_id: 1, curso_id: 1 }, { unique: true });

const Certificado = mongoose.model('Certificado', certificadoSchema);

module.exports = Certificado;