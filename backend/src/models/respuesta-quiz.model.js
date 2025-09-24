const mongoose = require('mongoose');

const respuestaSchema = new mongoose.Schema({
  pregunta_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'El ID de la pregunta es requerido']
  },
  respuesta_seleccionada: {
    type: mongoose.Schema.Types.Mixed, // Puede ser String (para texto libre) o ObjectId (para opciones)
    required: [true, 'La respuesta es requerida']
  },
  es_correcta: {
    type: Boolean,
    required: [true, 'El estado de corrección es requerido']
  },
  puntos_obtenidos: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos no pueden ser negativos']
  }
});

const respuestaQuizSchema = new mongoose.Schema({
  estudiante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: [true, 'El estudiante es requerido']
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'El quiz es requerido']
  },
  respuestas: [respuestaSchema],
  puntuacion_total: {
    type: Number,
    default: 0,
    min: [0, 'La puntuación no puede ser negativa']
  },
  puntuacion_porcentaje: {
    type: Number,
    default: 0,
    min: [0, 'El porcentaje no puede ser negativo'],
    max: [100, 'El porcentaje no puede ser mayor a 100']
  },
  tiempo_inicio: {
    type: Date,
    default: Date.now
  },
  tiempo_finalizacion: {
    type: Date
  },
  tiempo_transcurrido: {
    type: Number, // en segundos
    default: 0
  },
  intento_numero: {
    type: Number,
    required: [true, 'El número de intento es requerido'],
    min: [1, 'El número de intento debe ser al menos 1']
  },
  estado: {
    type: String,
    enum: ['en_progreso', 'completado', 'tiempo_agotado'],
    default: 'en_progreso'
  },
  aprobado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para calcular puntuación y tiempo transcurrido al finalizar
respuestaQuizSchema.pre('save', function(next) {
  if (this.isModified('estado') && this.estado === 'completado') {
    if (!this.tiempo_finalizacion) {
      this.tiempo_finalizacion = new Date();
    }
    
    // Calcular tiempo transcurrido
    this.tiempo_transcurrido = Math.floor((this.tiempo_finalizacion - this.tiempo_inicio) / 1000);
    
    // Calcular puntuación total
    this.puntuacion_total = this.respuestas.reduce((total, respuesta) => {
      return total + respuesta.puntos_obtenidos;
    }, 0);
  }
  next();
});

// Índice compuesto para evitar múltiples intentos simultáneos
respuestaQuizSchema.index({ estudiante_id: 1, quiz_id: 1, intento_numero: 1 }, { unique: true });

const RespuestaQuiz = mongoose.model('RespuestaQuiz', respuestaQuizSchema);

module.exports = RespuestaQuiz;