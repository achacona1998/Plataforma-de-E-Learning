import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');
    const token = searchParams.get('token'); // PayPal token

    if (sessionId) {
      // Stripe payment verification
      verifyStripePayment(sessionId);
    } else if (orderId || token) {
      // PayPal payment verification
      verifyPayPalPayment(orderId || token);
    } else {
      setError('No se encontraron parámetros de pago válidos');
      setLoading(false);
    }
  }, [searchParams]);

  const verifyStripePayment = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/stripe/session/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setPaymentData({
          ...response.data.data,
          paymentMethod: 'Stripe'
        });
        toast.success('¡Pago completado exitosamente!');
      } else {
        setError(response.data.message || 'Error al verificar el pago');
      }
    } catch (error) {
      console.error('Error verifying Stripe payment:', error);
      setError(error.response?.data?.message || 'Error al verificar el pago con Stripe');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayPalPayment = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/paypal/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setPaymentData({
          ...response.data.data,
          paymentMethod: 'PayPal'
        });
        toast.success('¡Pago completado exitosamente!');
      } else {
        setError(response.data.message || 'Error al verificar el pago');
      }
    } catch (error) {
      console.error('Error verifying PayPal payment:', error);
      setError(error.response?.data?.message || 'Error al verificar el pago con PayPal');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando pago...</h2>
          <p className="text-gray-600">Por favor espera mientras confirmamos tu transacción</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error en el Pago</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/courses')}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Volver a Cursos
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h2>
        
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. Ya tienes acceso al curso.
        </p>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Detalles del Pago</h3>
            <div className="space-y-2 text-sm">
              {paymentData.pago?.curso_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Curso:</span>
                  <span className="font-medium">{paymentData.pago.curso_id.titulo}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Método:</span>
                <span className="font-medium">{paymentData.paymentMethod}</span>
              </div>
              {paymentData.pago?.monto && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-medium">${paymentData.pago.monto.toFixed(2)}</span>
                </div>
              )}
              {paymentData.pago?.fecha_pago && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(paymentData.pago.fecha_pago).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {paymentData?.pago?.curso_id?._id && (
            <Link
              to={`/courses/${paymentData.pago.curso_id._id}`}
              className="block w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ir al Curso
            </Link>
          )}
          
          <Link
            to="/dashboard/my-learning"
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ver Mis Cursos
          </Link>
          
          <Link
            to="/dashboard/payments"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ver Historial de Pagos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
