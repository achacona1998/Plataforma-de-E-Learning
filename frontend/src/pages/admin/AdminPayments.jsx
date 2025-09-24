import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para datos y carga
  const [paymentsData, setPaymentsData] = useState({ docs: [] });
  const [allPaymentsData, setAllPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const payments = paymentsData?.docs || [];
  


  // Función para obtener pagos con paginación
  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      // Construir parámetros de consulta
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      // Agregar filtros si están activos
      if (filterStatus !== 'all') {
        params.append('estado', filterStatus);
      }
      if (filterMethod !== 'all') {
        params.append('metodo_pago', filterMethod);
      }

      const response = await fetch(`/api/pagos/admin/todos?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los pagos');
      }

      const data = await response.json();

   
      if (data.success) {
        setPaymentsData(data.data);
        setTotalPages(data.data.totalPages);
        setTotalDocs(data.data.totalDocs);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPaymentsData({ docs: [] });
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener todos los pagos para estadísticas
  const fetchAllPayments = async () => {
    try {
      const response = await fetch(`/api/pagos/admin/todos?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener todos los pagos');
      }

      const data = await response.json();
      
      if (data.success) {
        const processedAllPayments = data.data.docs.map(payment => ({
          id: payment._id,
          transactionId: payment.transaction_id || `TXN-${payment._id.slice(-8)}`,
          studentName: payment.estudiante_id?.nombre || 'Usuario desconocido',
          studentEmail: payment.estudiante_id?.correo || 'email@ejemplo.com',
          courseName: payment.curso_id?.titulo || 'Curso desconocido',
          amount: payment.monto || 0,
          currency: payment.moneda || 'USD',
          status: payment.estado || 'pendiente',
          method: payment.metodo_pago || 'tarjeta',
          date: new Date(payment.createdAt || payment.fecha_creacion).toLocaleDateString(),
          description: payment.descripcion || 'Pago de curso',
          reference: payment.referencia || 'N/A'
        }));
        setAllPaymentsData(processedAllPayments);
      }
    } catch (error) {
      console.error('Error fetching all payments:', error);
      setAllPaymentsData([]);
    }
  };

  // Procesar datos de pagos
  const processedPayments = payments.map(payment => ({
    id: payment._id,
    transactionId: payment.transaction_id || `TXN-${payment._id.slice(-8)}`,
    studentName: payment.estudiante_id?.nombre || 'Usuario desconocido',
    studentEmail: payment.estudiante_id?.correo || 'email@ejemplo.com',
    courseName: payment.curso_id?.titulo || 'Curso desconocido',
    amount: payment.monto || 0,
    currency: payment.moneda || 'USD',
    status: payment.estado || 'pendiente',
    method: payment.metodo_pago || 'tarjeta',
    date: new Date(payment.createdAt || payment.fecha_creacion).toLocaleDateString(),
    description: payment.descripcion || 'Pago de curso',
    reference: payment.referencia || 'N/A'
  }));

  // useEffect para cargar datos inicialmente
  useEffect(() => {
    fetchPayments();
    fetchAllPayments(); // Cargar todos los pagos para estadísticas
  }, []);

  // useEffect para recargar datos cuando cambien los filtros o la página
  useEffect(() => {
    fetchPayments();
  }, [currentPage, filterStatus, filterMethod]);

  // Usar solo datos procesados del backend
  const finalPayments = processedPayments;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completado':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'pendiente':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'fallido':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleViewPayment = (paymentId) => {
    const payment = processedPayments.find(p => p.id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setIsModalOpen(true);
    }
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/payments/${paymentId}/receipt`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener el recibo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recibo-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar recibo:', error);
      alert('Error al descargar el recibo');
    }
  };

  const exportPayments = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `reporte-pagos-${currentDate}.csv`;
      
      // Fetch all payments for export
      const params = new URLSearchParams({
        page: '1',
        limit: '1000' // Get a large number to include all payments
      });

      // Add current filters
      if (filterStatus !== 'all') {
        params.append('estado', filterStatus);
      }
      if (filterMethod !== 'all') {
        params.append('metodo_pago', filterMethod);
      }

      const response = await fetch(`/api/pagos/admin/todos?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los datos para exportar');
      }

      const data = await response.json();
      const allPayments = data.data.docs || [];

      // Process all payments for export
      const processedExportPayments = allPayments.map(payment => ({
        transactionId: payment.transaction_id || `TXN-${payment._id.slice(-8)}`,
        studentName: payment.estudiante_id?.nombre || 'Usuario desconocido',
        studentEmail: payment.estudiante_id?.correo || 'email@ejemplo.com',
        courseName: payment.curso_id?.titulo || 'Curso desconocido',
        amount: payment.monto || 0,
        currency: payment.moneda || 'USD',
        status: payment.estado || 'pendiente',
        method: payment.metodo_pago || 'tarjeta',
        date: new Date(payment.createdAt || payment.fecha_creacion).toLocaleDateString(),
        description: payment.descripcion || 'Pago de curso',
        reference: payment.referencia || 'N/A'
      }));

      // Apply search filter if active
      const exportPayments = processedExportPayments.filter(payment => {
        if (!searchTerm) return true;
        const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
      
      // Generate CSV content
      const headers = [
        'ID Transacción',
        'Estudiante',
        'Email',
        'Curso',
        'Monto',
        'Moneda',
        'Estado',
        'Método de Pago',
        'Fecha',
        'Descripción',
        'Referencia'
      ];
      
      const csvData = exportPayments.map(payment => [
        payment.transactionId,
        payment.studentName,
        payment.studentEmail,
        payment.courseName,
        payment.amount,
        payment.currency,
        payment.status,
        payment.method,
        payment.date,
        payment.description,
        payment.reference
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Reporte de pagos exportado exitosamente: ${filename}`);
    } catch (error) {
      console.error('Error exporting payments:', error);
      alert('Error al exportar el reporte de pagos. Por favor, intenta de nuevo.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'fallido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'tarjeta':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'transferencia':
        return '🏦';
      default:
        return '💰';
    }
  };

  // Filtrado por búsqueda (solo para búsqueda de texto, los otros filtros se manejan en el backend)
  const filteredPayments = finalPayments.filter(payment => {
    if (!searchTerm) return true;
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Los datos ya vienen paginados del backend
  const paginatedPayments = filteredPayments;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalDocs);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterMethod]);

  const totalRevenue = allPaymentsData.filter(p => p.status === 'completado').reduce((sum, p) => sum + p.amount, 0);
  const pendingRevenue = allPaymentsData.filter(p => p.status === 'pendiente').length;
  const completedPayments = allPaymentsData.filter(p => p.status === 'completado').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-32 h-32 rounded-full border-b-2 border-teal-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CurrencyDollarIcon className="w-8 h-8 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
                <p className="text-gray-600">Administra todas las transacciones de la plataforma</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={exportPayments}
                className="flex items-center px-4 py-2 space-x-2 text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          {/* Ingresos Totales */}
          <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <CurrencyDollarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold tracking-wide text-green-700 uppercase">Ingresos Totales</p>
                  <p className="mt-1 text-3xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>

          {/* Pagos Pendientes */}
          <div className="relative p-6 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl border border-yellow-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold tracking-wide text-yellow-700 uppercase">Pagos Pendientes</p>
                  <p className="mt-1 text-3xl font-bold text-yellow-900">{pendingRevenue}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>

          {/* Pagos Completados */}
          <div className="relative p-6 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold tracking-wide text-blue-700 uppercase">Pagos Completados</p>
                  <p className="mt-1 text-3xl font-bold text-blue-900">{completedPayments}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Total Transacciones */}
          <div className="relative p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl border border-purple-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <CreditCardIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold tracking-wide text-purple-700 uppercase">Total Transacciones</p>
                  <p className="mt-1 text-3xl font-bold text-purple-900">{totalDocs}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-8 mb-8 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 shadow-lg">
          <div className="mb-4">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <MagnifyingGlassIcon className="mr-2 w-5 h-5 text-teal-600" />
              Filtros de Búsqueda
            </h3>
            <p className="mt-1 text-sm text-gray-600">Encuentra transacciones específicas usando los filtros disponibles</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Search Input */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Búsqueda General</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transition-colors transform -translate-y-1/2 group-focus-within:text-teal-500" />
                <input
                  type="text"
                  placeholder="Estudiante, curso o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-3 pr-4 pl-10 w-full bg-white rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Estado del Pago</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 w-full bg-white rounded-xl border border-gray-200 transition-all duration-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300"
                >
                  <option value="all">🔄 Todos los estados</option>
                  <option value="completado">✅ Completados</option>
                  <option value="pendiente">⏳ Pendientes</option>
                  <option value="fallido">❌ Fallidos</option>
                </select>
                <div className="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Method Filter */}
            <div className="relative group">
              <label className="block mb-2 text-sm font-medium text-gray-700">Método de Pago</label>
              <div className="relative">
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="px-4 py-3 w-full bg-white rounded-xl border border-gray-200 transition-all duration-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300"
                >
                  <option value="all">💳 Todos los métodos</option>
                  <option value="tarjeta">💳 Tarjeta de Crédito</option>
                  <option value="paypal">🅿️ PayPal</option>
                  <option value="transferencia">🏦 Transferencia</option>
                </select>
                <div className="flex absolute inset-y-0 right-0 items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          {(searchTerm || filterStatus !== 'all' || filterMethod !== 'all') && (
            <div className="p-4 mt-6 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-teal-800">Filtros activos:</span>
                  <span className="text-sm text-teal-600">
                    {totalDocs} transacciones encontradas
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterMethod('all');
                  }}
                  className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-800"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h3 className="flex items-center text-lg font-semibold text-gray-800">
              <CreditCardIcon className="mr-2 w-5 h-5 text-teal-600" />
              Transacciones de Pagos
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {totalDocs} transacciones encontradas
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    💳 Transacción
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    👤 Estudiante
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    💰 Monto
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    📊 Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                    ⚙️ Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedPayments.map((payment, index) => (
                  <tr 
                    key={payment.id} 
                    className="transition-all duration-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex flex-shrink-0 justify-center items-center mr-3 w-8 h-8 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg">
                          <span className="text-xs font-bold text-teal-700">#{startIndex + index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-teal-700">
                            {payment.transactionId}
                          </div>
                          <div className="text-xs text-gray-500">{payment.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex flex-shrink-0 justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full">
                          <span className="text-sm font-bold text-white">
                            {payment.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 transition-colors group-hover:text-purple-700">
                            {payment.studentName}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">{payment.courseName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="px-3 py-2 text-sm font-bold text-gray-900 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-700">${payment.amount}</span>
                        <span className="ml-1 text-xs text-gray-500">{payment.currency}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg border ${getStatusColor(payment.status)} shadow-sm`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewPayment(payment.id)}
                          className="p-2 text-blue-600 rounded-lg border border-blue-200 transition-all duration-200 hover:text-white hover:bg-blue-600 hover:border-blue-600 group/btn"
                          title="Ver detalles del pago"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="p-2 text-green-600 rounded-lg border border-green-200 transition-all duration-200 hover:text-white hover:bg-green-600 hover:border-green-600 group/btn"
                          title="Descargar recibo"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalDocs === 0 && (
          <div className="py-12 text-center">
            <CurrencyDollarIcon className="mx-auto w-12 h-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron pagos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterMethod !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay transacciones registradas'
              }
            </p>
          </div>
        )}

        {/* Paginación */}
        {totalDocs > 0 && totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 mt-6 bg-white rounded-xl border border-gray-100 shadow-lg">
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">
                Mostrando {startIndex + 1} - {endIndex} de {totalDocs} transacciones
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Botón Anterior */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300 hover:text-teal-700'
                }`}
              >
                <ChevronLeftIcon className="mr-1 w-4 h-4" />
                Anterior
              </button>

              {/* Números de página */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => {
                  // Mostrar solo algunas páginas alrededor de la página actual
                  const showPage = pageNumber === 1 || 
                                  pageNumber === totalPages || 
                                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                  
                  if (!showPage) {
                    // Mostrar puntos suspensivos
                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                      return (
                        <span key={pageNumber} className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        currentPage === pageNumber
                          ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300 hover:text-teal-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300 hover:text-teal-700'
                }`}
              >
                Siguiente
                <ChevronRightIcon className="ml-1 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal de Detalles del Pago */}
        {isModalOpen && selectedPayment && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del Modal */}
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg">
                    <CreditCardIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Detalles de la Transacción</h3>
                    <p className="text-sm text-gray-600">ID: {selectedPayment.transactionId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 rounded-lg transition-colors hover:text-gray-600 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Información del Estudiante */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <h4 className="flex items-center mb-3 text-sm font-semibold text-purple-800">
                    <div className="flex justify-center items-center mr-2 w-6 h-6 bg-purple-500 rounded-full">
                      <span className="text-xs font-bold text-white">👤</span>
                    </div>
                    Información del Estudiante
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Nombre</label>
                      <p className="mt-1 text-sm font-medium text-gray-900">{selectedPayment.studentName}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Email</label>
                      <p className="mt-1 text-sm text-gray-700">{selectedPayment.studentEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Curso */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <h4 className="flex items-center mb-3 text-sm font-semibold text-blue-800">
                    <div className="flex justify-center items-center mr-2 w-6 h-6 bg-blue-500 rounded-full">
                      <span className="text-xs font-bold text-white">📚</span>
                    </div>
                    Información del Curso
                  </h4>
                  <div>
                    <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Curso</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selectedPayment.courseName}</p>
                    <p className="mt-1 text-xs text-gray-500">Curso en línea</p>
                  </div>
                </div>

                {/* Información del Pago */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <h4 className="flex items-center mb-3 text-sm font-semibold text-green-800">
                    <div className="flex justify-center items-center mr-2 w-6 h-6 bg-green-500 rounded-full">
                      <span className="text-xs font-bold text-white">💰</span>
                    </div>
                    Información del Pago
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Monto</label>
                      <p className="mt-1 text-lg font-bold text-green-700">
                        ${selectedPayment.amount} {selectedPayment.currency}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Método de Pago</label>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 text-lg">{getMethodIcon(selectedPayment.method)}</span>
                        <span className="text-sm font-medium text-gray-700 capitalize">{selectedPayment.method}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Estado</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1 text-xs font-semibold rounded-lg border ${getStatusColor(selectedPayment.status)}`}>
                          {getStatusIcon(selectedPayment.status)}
                          <span className="capitalize">{selectedPayment.status}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Fecha de Procesamiento</label>
                      <p className="mt-1 text-sm text-gray-700">{selectedPayment.date}</p>
                    </div>
                  </div>
                </div>

                {/* Información Técnica */}
                <div className="p-4 bg-gradient-to-r from-gray-50 rounded-lg border border-gray-100 to-slate-50">
                  <h4 className="flex items-center mb-3 text-sm font-semibold text-gray-800">
                    <div className="flex justify-center items-center mr-2 w-6 h-6 bg-gray-500 rounded-full">
                      <span className="text-xs font-bold text-white">🔧</span>
                    </div>
                    Información Técnica
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">ID de Transacción</label>
                      <p className="px-2 py-1 mt-1 font-mono text-sm text-gray-900 bg-gray-100 rounded">{selectedPayment.transactionId}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-gray-600 uppercase">Referencia</label>
                      <p className="px-2 py-1 mt-1 font-mono text-sm text-gray-700 bg-gray-100 rounded">{selectedPayment.reference}</p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
                  <button
                    onClick={() => handleDownloadReceipt(selectedPayment.id)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
                  >
                    <DocumentArrowDownIcon className="mr-2 w-4 h-4" />
                    Descargar Recibo
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
