const Pago = require('../models/pago.model');
const Curso = require('../models/curso.model');
const Estudiante = require('../models/estudiante.model');
const Inscripcion = require('../models/inscripcion.model');

// Simulación de PayPal SDK (en producción se usaría el SDK real)
const paypal = {
  orders: {
    create: async (request) => {
      // Simulación de creación de orden de PayPal
      return {
        id: 'PAYPAL_' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        status: 'CREATED',
        links: [
          {
            rel: 'approve',
            href: `https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_${Math.random().toString(36).substring(2, 15)}`,
            method: 'GET'
          },
          {
            rel: 'capture',
            href: `https://api.sandbox.paypal.com/v2/checkout/orders/PAYPAL_${Math.random().toString(36).substring(2, 15)}/capture`,
            method: 'POST'
          }
        ],
        purchase_units: request.purchase_units
      };
    },
    capture: async (orderId) => {
      // Simulación de captura de pago
      return {
        id: orderId,
        status: Math.random() > 0.2 ? 'COMPLETED' : 'PENDING',
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: 'CAPTURE_' + Math.random().toString(36).substring(2, 15),
                  status: 'COMPLETED',
                  amount: {
                    currency_code: 'USD',
                    value: '50.00'
                  }
                }
              ]
            }
          }
        ]
      };
    },
    get: async (orderId) => {
      // Simulación de obtener orden
      return {
        id: orderId,
        status: Math.random() > 0.3 ? 'COMPLETED' : 'CREATED',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '50.00'
            },
            custom_id: 'curso_507f1f77bcf86cd799439011_estudiante_507f1f77bcf86cd799439012'
          }
        ]
      };
    }
  }
};

// Crear orden de pago con PayPal
exports.crearOrdenPago = async (req, res) => {
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
      metodo_pago: 'paypal',
      estado: 'pendiente'
    });

    await nuevoPago.save();

    // Crear orden de PayPal
    const request = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: curso.precio.toFixed(2)
          },
          description: curso.titulo,
          custom_id: `curso_${curso_id}_estudiante_${estudiante_id}_pago_${nuevoPago._id}`
        }
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment/paypal/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/paypal/cancel`,
        brand_name: 'E-Learning Platform',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW'
      }
    };

    const order = await paypal.orders.create(request);

    // Actualizar el pago con el order_id de PayPal
    nuevoPago.transaction_id = order.id;
    await nuevoPago.save();

    // Encontrar el enlace de aprobación
    const approveLink = order.links.find(link => link.rel === 'approve');

    res.status(200).json({
      success: true,
      message: 'Orden de PayPal creada exitosamente',
      data: {
        order_id: order.id,
        approve_url: approveLink ? approveLink.href : null,
        pago_id: nuevoPago._id
      }
    });

  } catch (error) {
    console.error('Error al crear orden de PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Capturar pago de PayPal
exports.capturarPago = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Buscar el pago por transaction_id
    const pago = await Pago.findOne({ transaction_id: order_id })
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

    if (pago.estado === 'completado') {
      return res.status(400).json({
        success: false,
        message: 'El pago ya ha sido completado'
      });
    }

    // Capturar el pago en PayPal
    const capture = await paypal.orders.capture(order_id);

    if (capture.status === 'COMPLETED') {
      // Actualizar el pago
      pago.estado = 'completado';
      pago.fecha_pago = new Date();
      pago.metadata = {
        ...pago.metadata,
        paypal_capture_id: capture.purchase_units[0].payments.captures[0].id
      };
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
          capture_details: capture
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'El pago no pudo ser completado',
        data: {
          capture_status: capture.status
        }
      });
    }

  } catch (error) {
    console.error('Error al capturar pago de PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Verificar estado de orden de PayPal
exports.verificarOrden = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Buscar el pago por transaction_id
    const pago = await Pago.findOne({ transaction_id: order_id })
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

    // Obtener el estado de la orden en PayPal
    const order = await paypal.orders.get(order_id);

    res.status(200).json({
      success: true,
      message: 'Estado de orden obtenido',
      data: {
        pago,
        order_status: order.status,
        order_details: order
      }
    });

  } catch (error) {
    console.error('Error al verificar orden de PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Cancelar orden de PayPal
exports.cancelarOrden = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Buscar el pago por transaction_id
    const pago = await Pago.findOne({ transaction_id: order_id });

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }

    if (pago.estado === 'completado') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar un pago completado'
      });
    }

    // Actualizar el estado del pago
    pago.estado = 'cancelado';
    pago.metadata = {
      ...pago.metadata,
      motivo_cancelacion: 'Cancelado por el usuario',
      fecha_cancelacion: new Date()
    };
    await pago.save();

    res.status(200).json({
      success: true,
      message: 'Orden cancelada exitosamente',
      data: {
        pago
      }
    });

  } catch (error) {
    console.error('Error al cancelar orden de PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Webhook de PayPal para manejar eventos
exports.webhookPaypal = async (req, res) => {
  try {
    const event = req.body;

    // Verificar la autenticidad del webhook (en producción)
    // En este caso, simulamos la verificación
    
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('Orden aprobada:', event.resource.id);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        const captureId = event.resource.id;
        const orderId = event.resource.supplementary_data?.related_ids?.order_id;
        
        if (orderId) {
          const pago = await Pago.findOne({ transaction_id: orderId });
          if (pago && pago.estado === 'pendiente') {
            pago.estado = 'completado';
            pago.fecha_pago = new Date();
            pago.metadata = {
              ...pago.metadata,
              paypal_capture_id: captureId
            };
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
          }
        }
        break;

      case 'PAYMENT.CAPTURE.DENIED':
      case 'CHECKOUT.ORDER.VOIDED':
        const deniedOrderId = event.resource.id;
        const pagoDenegado = await Pago.findOne({ transaction_id: deniedOrderId });
        if (pagoDenegado && pagoDenegado.estado === 'pendiente') {
          pagoDenegado.estado = 'fallido';
          pagoDenegado.metadata = {
            ...pagoDenegado.metadata,
            motivo_fallo: 'Pago denegado o cancelado',
            fecha_fallo: new Date()
          };
          await pagoDenegado.save();
        }
        break;

      default:
        console.log(`Evento de PayPal no manejado: ${event.event_type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error en webhook de PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener configuración pública de PayPal
exports.getConfiguracionPublica = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        client_id: process.env.PAYPAL_CLIENT_ID || 'paypal_client_id_example',
        currency: 'USD',
        intent: 'capture',
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      }
    });
  } catch (error) {
    console.error('Error al obtener configuración de PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};