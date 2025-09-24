const Pago = require('../models/pago.model');
const Curso = require('../models/curso.model');
const Estudiante = require('../models/estudiante.model');
const Inscripcion = require('../models/inscripcion.model');

// Simulación de Stripe (en producción se usaría el SDK real)
const stripe = {
  checkout: {
    sessions: {
      create: async (params) => {
        // Simulación de creación de sesión de Stripe
        return {
          id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
          url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(2, 15)}`,
          payment_status: 'unpaid',
          amount_total: params.line_items[0].price_data.unit_amount,
          currency: params.line_items[0].price_data.currency,
          metadata: params.metadata
        };
      },
      retrieve: async (sessionId) => {
        // Simulación de recuperación de sesión
        return {
          id: sessionId,
          payment_status: Math.random() > 0.3 ? 'paid' : 'unpaid',
          amount_total: 5000, // $50.00
          currency: 'usd',
          metadata: {
            curso_id: '507f1f77bcf86cd799439011',
            estudiante_id: '507f1f77bcf86cd799439012'
          }
        };
      }
    }
  },
  webhooks: {
    constructEvent: (payload, signature, secret) => {
      // Simulación de verificación de webhook
      return {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
            payment_status: 'paid',
            metadata: {
              curso_id: '507f1f77bcf86cd799439011',
              estudiante_id: '507f1f77bcf86cd799439012'
            }
          }
        }
      };
    }
  }
};

// Crear sesión de pago con Stripe
exports.crearSesionPago = async (req, res) => {
  try {
    const { curso_id } = req.body;
    const estudiante_id = req.usuario.estudiante_id;

    // Verificar que el curso existe
    const curso = await Curso.findById(curso_id);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar que el estudiante no esté ya inscrito
    const inscripcionExistente = await Inscripcion.findOne({
      estudiante_id,
      curso_id
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás inscrito en este curso'
      });
    }

    // Verificar que no existe un pago pendiente o completado
    const pagoExistente = await Pago.findOne({
      estudiante_id,
      curso_id,
      estado: { $in: ['pendiente', 'completado'] }
    });

    if (pagoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un pago para este curso'
      });
    }

    // Crear el pago en estado pendiente
    const nuevoPago = new Pago({
      estudiante_id,
      curso_id,
      monto: curso.precio,
      metodo_pago: 'stripe',
      estado: 'pendiente'
    });

    await nuevoPago.save();

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: curso.titulo,
              description: curso.descripcion,
              images: curso.imagen ? [curso.imagen] : []
            },
            unit_amount: Math.round(curso.precio * 100) // Convertir a centavos
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        curso_id: curso_id.toString(),
        estudiante_id: estudiante_id.toString(),
        pago_id: nuevoPago._id.toString()
      }
    });

    // Actualizar el pago con el session_id de Stripe
    nuevoPago.transaction_id = session.id;
    await nuevoPago.save();

    res.status(200).json({
      success: true,
      message: 'Sesión de pago creada exitosamente',
      data: {
        session_id: session.id,
        url: session.url,
        pago_id: nuevoPago._id
      }
    });

  } catch (error) {
    console.error('Error al crear sesión de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Verificar estado de sesión de pago
exports.verificarSesionPago = async (req, res) => {
  try {
    const { session_id } = req.params;

    // Buscar el pago por transaction_id
    const pago = await Pago.findOne({ transaction_id: session_id })
      .populate('curso_id')
      .populate({
        path: 'estudiante_id',
        populate: {
          path: 'usuario_id',
          select: 'nombre email'
        }
      });

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    // Verificar el estado en Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid' && pago.estado === 'pendiente') {
      // Actualizar el pago
      pago.estado = 'completado';
      pago.fecha_pago = new Date();
      await pago.save();

      // Crear la inscripción
      const nuevaInscripcion = new Inscripcion({
        estudiante_id: pago.estudiante_id,
        curso_id: pago.curso_id,
        fecha_inscripcion: new Date(),
        estado: 'activo'
      });

      await nuevaInscripcion.save();

      return res.status(200).json({
        success: true,
        message: 'Pago completado e inscripción creada exitosamente',
        data: {
          pago,
          inscripcion: nuevaInscripcion,
          session_status: session.payment_status
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Estado de pago obtenido',
      data: {
        pago,
        session_status: session.payment_status
      }
    });

  } catch (error) {
    console.error('Error al verificar sesión de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Webhook de Stripe para manejar eventos
exports.webhookStripe = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.error('Error al verificar webhook:', err.message);
      return res.status(400).json({
        success: false,
        message: 'Webhook signature verification failed'
      });
    }

    // Manejar el evento
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Buscar el pago
        const pago = await Pago.findOne({ transaction_id: session.id });
        if (!pago) {
          console.error('Pago no encontrado para session:', session.id);
          break;
        }

        // Actualizar el pago
        pago.estado = 'completado';
        pago.fecha_pago = new Date();
        await pago.save();

        // Crear la inscripción si no existe
        const inscripcionExistente = await Inscripcion.findOne({
          estudiante_id: pago.estudiante_id,
          curso_id: pago.curso_id
        });

        if (!inscripcionExistente) {
          const nuevaInscripcion = new Inscripcion({
            estudiante_id: pago.estudiante_id,
            curso_id: pago.curso_id,
            fecha_inscripcion: new Date(),
            estado: 'activo'
          });
          await nuevaInscripcion.save();
        }

        console.log('Pago completado via webhook:', pago._id);
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        
        // Buscar y cancelar el pago
        const pagoExpirado = await Pago.findOne({ transaction_id: expiredSession.id });
        if (pagoExpirado && pagoExpirado.estado === 'pendiente') {
          pagoExpirado.estado = 'cancelado';
          pagoExpirado.metadata = {
            ...pagoExpirado.metadata,
            motivo_cancelacion: 'Sesión de pago expirada'
          };
          await pagoExpirado.save();
        }
        break;

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error en webhook de Stripe:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener configuración pública de Stripe
exports.getConfiguracionPublica = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_example',
        currency: 'usd',
        country: 'US'
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};