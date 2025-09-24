import { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Mostrar mensaje de cancelación
    toast.info('Pago cancelado. Puedes intentar nuevamente cuando desees.');
  }, []);

  const courseId = searchParams.get('course_id');
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const token = searchParams.get('token');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pago Cancelado</h2>
        
        <p className="text-gray-600 mb-6">
          Has cancelado el proceso de pago. No se ha realizado ningún cargo a tu cuenta.
        </p>

        {(sessionId || orderId || token) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Información de la Transacción</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {sessionId && (
                <p><span className="font-medium">Sesión Stripe:</span> {sessionId}</p>
              )}
              {orderId && (
                <p><span className="font-medium">Orden PayPal:</span> {orderId}</p>
              )}
              {token && (
                <p><span className="font-medium">Token:</span> {token}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Esta transacción ha sido cancelada y no se procesará ningún pago.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {courseId && (
            <Link
              to={`/checkout/${courseId}`}
              className="block w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Intentar Pago Nuevamente
            </Link>
          )}
          
          {courseId && (
            <Link
              to={`/courses/${courseId}`}
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Detalles del Curso
            </Link>
          )}
          
          <Link
            to="/courses"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Explorar Otros Cursos
          </Link>
          
          <Link
            to="/dashboard"
            className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">¿Necesitas Ayuda?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Si experimentaste algún problema durante el proceso de pago, no dudes en contactarnos.
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="mailto:support@elearning.com"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Enviar Email
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="tel:+1234567890"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Llamar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
