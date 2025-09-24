const mongoose = require('mongoose');

const preguntaSchema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: [true, 'La pregunta es requerida'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['multiple_choice', 'verdadero_falso', 'texto_libre'],
    default: 'multiple_choice'
  },
  opciones: [{
    texto: {
      type: String,
      required: true,
      trim: true
    },
    es_correcta: {
      type: Boolean,
      default: false
    }
  }],
  respuesta_correcta: {
    type: String, // Para preguntas de texto libre
    trim: true
  },
  puntos: {
    type: Number,
    default: 1,
    min: [0, 'Los puntos no pueden ser negativos']
  },
  explicacion: {
    type: String,
    trim: true
  }
});

const quizSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  descripcion: {
    type: String,
    trim: true
  },
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'El curso es requerido']
  },
  contenido_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contenido'
  },
  preguntas: [preguntaSchema],
  tiempo_limite: {
    type: Number, // en minutos
    default: 30,
    min: [1, 'El tiempo límite mínimo es 1 minuto']
  },
  intentos_permitidos: {
    type: Number,
    default: 3,
    min: [1, 'Debe permitir al menos 1 intento']
  },
  puntuacion_minima: {
    type: Number,
    default: 70, // porcentaje
    min: [0, 'La puntuación mínima no puede ser negativa'],
    max: [100, 'La puntuación mínima no puede ser mayor a 100']
  },
  estado: {
    type: String,
    enum: ['borrador', 'publicado', 'archivado'],
    default: 'borrador'
  },
  orden: {
    type: Number,
    default: 0
  },
  es_obligatorio: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Validación personalizada para asegurar que las preguntas de opción múltiple tengan al menos una respuesta correcta
quizSchema.pre('save', function(next) {
  for (let pregunta of this.preguntas) {
    if (pregunta.tipo === 'multiple_choice') {
      const tieneRespuestaCorrecta = pregunta.opciones.some(opcion => opcion.es_correcta);
      if (!tieneRespuestaCorrecta) {
        return next(new Error(`La pregunta "${pregunta.pregunta}" debe tener al menos una respuesta correcta`));
      }
    }
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;