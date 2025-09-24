const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir password en las consultas por defecto
  },
  rol: {
    type: String,
    enum: ['estudiante', 'instructor', 'admin'],
    default: 'estudiante'
  },
  estudiante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estudiante'
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  ultimo_acceso: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede tener más de 20 caracteres'],
    match: [/^[+]?[0-9\s\-()]+$/, 'Por favor ingrese un número de teléfono válido']
  },
  avatar: {
    type: String,
    trim: true,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombre)}&background=0d9488&color=fff`;
    }
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  biografia: {
    type: String,
    trim: true,
    maxlength: [500, 'La biografía no puede tener más de 500 caracteres']
  },
  direccion: {
    type: String,
    trim: true,
    maxlength: [200, 'La dirección no puede tener más de 200 caracteres']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return next();
  }
  
  // Generar salt y hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para verificar contraseña
usuarioSchema.methods.verificarPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para generar JWT
usuarioSchema.methods.generarJWT = function() {
  return jwt.sign(
    { id: this._id, email: this.email, rol: this.rol },
    process.env.JWT_SECRET || 'mi_secreto_temporal',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;