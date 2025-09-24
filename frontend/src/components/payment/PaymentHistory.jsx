import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completado, pendiente, cancelado, fallido

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/pagos/estudiante',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        toast.error(response.data.message || 'Error al cargar historial de pagos');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error(error.response?.data?.message || 'Error al cargar historial de pagos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      case 'fallido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completado':
        return 'Completado';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      case 'fallido':
        return 'Fallido';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'stripe':
        return 'Tarjeta de Crédito';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.estado === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Pagos</h1>
        <p className="mt-2 text-gray-600">Revisa todos tus pagos y transacciones</p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('completado')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completado'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completados
          </button>
          <button
            onClick={() => setFilter('pendiente')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pendiente'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('cancelado')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'cancelado'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelados
          </button>
          <button
            onClick={() => setFilter('fallido')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'fallido'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fallidos
          </button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pagos</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'Aún no has realizado ningún pago'
              : `No tienes pagos con estado: ${getStatusText(filter)}`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <li key={payment._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {payment.curso_id?.titulo || 'Curso no disponible'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Método: {getPaymentMethodText(payment.metodo_pago)}
                        </p>
                        {payment.transaction_id && (
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {payment.transaction_id}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${payment.monto.toFixed(2)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusColor(payment.estado)
                        }`}>
                          {getStatusText(payment.estado)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-4a4 4 0 018 0v4z" />
                      </svg>
                      <span>
                        Creado: {new Date(payment.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {payment.fecha_pago && (
                        <>
                          <span className="mx-2">•</span>
                          <span>
                            Pagado: {new Date(payment.fecha_pago).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
