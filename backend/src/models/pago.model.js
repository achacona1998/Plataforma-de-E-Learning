const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
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
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  moneda: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'MXN', 'COP', 'ARS']
  },
  metodo_pago: {
    type: String,
    enum: ['stripe', 'paypal', 'transferencia'],
    required: [true, 'El método de pago es requerido']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completado', 'fallido', 'reembolsado'],
    default: 'pendiente'
  },
  transaction_id: {
    type: String,
    unique: true,
    sparse: true // Permite valores null pero únicos cuando existen
  },
  stripe_payment_intent_id: {
    type: String,
    sparse: true
  },
  paypal_order_id: {
    type: String,
    sparse: true
  },
  fecha_pago: {
    type: Date
  },
  fecha_vencimiento: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    }
  },
  detalles_facturacion: {
    nombre: String,
    email: String,
    direccion: String,
    ciudad: String,
    codigo_postal: String,
    pais: String
  },
  metadata: {
    ip_address: String,
    user_agent: String,
    descuento_aplicado: Number,
    codigo_promocional: String
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para actualizar fecha_pago cuando el estado cambia a completado
pagoSchema.pre('save', function(next) {
  if (this.isModified('estado') && this.estado === 'completado' && !this.fecha_pago) {
    this.fecha_pago = new Date();
  }
  next();
});

// Índice para búsquedas eficientes
pagoSchema.index({ estudiante_id: 1, curso_id: 1 });
pagoSchema.index({ estado: 1 });
pagoSchema.index({ fecha_pago: -1 });

const Pago = mongoose.model('Pago', pagoSchema);

module.exports = Pago;