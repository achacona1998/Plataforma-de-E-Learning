import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Only initialize Stripe if we have a valid public key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey && stripePublicKey !== 'pk_test_your_stripe_public_key_here' 
  ? loadStripe(stripePublicKey) 
  : null;

const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(stripePromise ? 'stripe' : 'paypal');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCourseDetails();
  }, [courseId, user, navigate]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cursos/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      toast.error('Error al cargar los detalles del curso');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    try {
      if (!stripePromise) {
        toast.error('Stripe no está configurado correctamente. Por favor, contacta al administrador.');
        return;
      }
      
      const stripe = await stripePromise;
      if (!stripe) {
        toast.error('Error al cargar Stripe. Por favor, intenta nuevamente.');
        return;
      }
      
      const response = await axios.post(
        'http://localhost:5000/api/stripe/create-session',
        {
          curso_id: courseId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        window.location.href = response.data.data.url;
      } else {
        toast.error(response.data.message || 'Error al crear sesión de pago');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar el pago con Stripe');
    }
  };

  const createOrder = async (data, actions) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/paypal/create-order',
        {
          curso_id: courseId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        return response.data.data.order_id;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear orden de PayPal');
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/paypal/capture/${data.orderID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('¡Pago completado con éxito!');
        navigate(`/courses/${courseId}`);
      } else {
        toast.error(response.data.message || 'Error al completar el pago');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al confirmar el pago con PayPal');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Resumen del Pedido</h3>
            <div className="bg-gray-50 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{course.titulo}</span>
                <span className="text-gray-600">${course.precio}</span>
              </div>
              <p className="text-sm text-gray-500">{course.descripcion}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Método de Pago</h3>
            <div className="space-y-4">
              <label className={`flex items-center space-x-3 ${!stripePromise ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={!stripePromise}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 disabled:opacity-50"
                />
                <span className="text-gray-900">
                  Tarjeta de Crédito (Stripe)
                  {!stripePromise && <span className="text-sm text-gray-500 ml-2">(No disponible)</span>}
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="text-gray-900">PayPal</span>
              </label>
            </div>
          </div>

          <div className="mt-8">
            {paymentMethod === 'stripe' ? (
              <button
                onClick={handleStripePayment}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Pagar con Tarjeta
              </button>
            ) : (
              <PayPalScriptProvider options={{ 'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  style={{ layout: 'horizontal' }}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
