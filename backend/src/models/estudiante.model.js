const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true,
    maxlength: [100, 'El apellido no puede tener más de 100 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo electrónico es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [100, 'El correo no puede tener más de 100 caracteres'],
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido']
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede tener más de 20 caracteres']
  },
  fecha_nacimiento: {
    type: Date
  },
  genero: {
    type: String,
    enum: ['masculino', 'femenino', 'otro', 'prefiero_no_decir'],
    default: 'prefiero_no_decir'
  },
  pais: {
    type: String,
    trim: true,
    maxlength: [50, 'El país no puede tener más de 50 caracteres']
  },
  ciudad: {
    type: String,
    trim: true,
    maxlength: [50, 'La ciudad no puede tener más de 50 caracteres']
  },
  nivel_educacion: {
    type: String,
    enum: ['secundaria', 'tecnico', 'universitario', 'posgrado', 'otro'],
    default: 'universitario'
  },
  ocupacion: {
    type: String,
    trim: true,
    maxlength: [100, 'La ocupación no puede tener más de 100 caracteres']
  },
  intereses: [{
    type: String,
    trim: true
  }],
  biografia: {
    type: String,
    trim: true,
    maxlength: [500, 'La biografía no puede tener más de 500 caracteres']
  },
  avatar: {
    type: String,
    default: '/placeholder-avatar.svg'
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  ultima_conexion: {
    type: Date,
    default: Date.now
  },
  configuracion_notificaciones: {
    email_cursos: {
      type: Boolean,
      default: true
    },
    email_certificados: {
      type: Boolean,
      default: true
    },
    email_promociones: {
      type: Boolean,
      default: false
    }
  },
  estadisticas: {
    cursos_completados: {
      type: Number,
      default: 0
    },
    cursos_en_progreso: {
      type: Number,
      default: 0
    },
    certificados_obtenidos: {
      type: Number,
      default: 0
    },
    tiempo_total_aprendizaje: {
      type: Number, // en minutos
      default: 0
    },
    puntuacion_promedio: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para mejorar el rendimiento
estudianteSchema.index({ correo: 1 });
estudianteSchema.index({ estado: 1 });
estudianteSchema.index({ fecha_registro: -1 });

// Método virtual para obtener el nombre completo
estudianteSchema.virtual('nombre_completo').get(function() {
  return `${this.nombre} ${this.apellido}`;
});

// Método para actualizar última conexión
estudianteSchema.methods.actualizarUltimaConexion = function() {
  this.ultima_conexion = new Date();
  return this.save();
};

// Método para actualizar estadísticas
estudianteSchema.methods.actualizarEstadisticas = function(datos) {
  if (datos.cursos_completados !== undefined) {
    this.estadisticas.cursos_completados = datos.cursos_completados;
  }
  if (datos.cursos_en_progreso !== undefined) {
    this.estadisticas.cursos_en_progreso = datos.cursos_en_progreso;
  }
  if (datos.certificados_obtenidos !== undefined) {
    this.estadisticas.certificados_obtenidos = datos.certificados_obtenidos;
  }
  if (datos.tiempo_total_aprendizaje !== undefined) {
    this.estadisticas.tiempo_total_aprendizaje = datos.tiempo_total_aprendizaje;
  }
  if (datos.puntuacion_promedio !== undefined) {
    this.estadisticas.puntuacion_promedio = datos.puntuacion_promedio;
  }
  return this.save();
};

// Configurar toJSON para incluir virtuals
estudianteSchema.set('toJSON', { virtuals: true });

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;