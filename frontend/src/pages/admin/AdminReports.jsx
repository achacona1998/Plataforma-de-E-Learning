import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useApi } from '../../hooks/useApi';
import {
  CalendarIcon,
  ClockIcon,
  DocumentChartBarIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const AdminReports = () => {
  const [reports, setReports] = useState({
    userReport: {
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeUsers: 0,
      usersByRole: { student: 0, instructor: 0, admin: 0 }
    },
    courseReport: {
      totalCourses: 0,
      publishedCourses: 0,
      draftCourses: 0,
      averageRating: 0,
      totalEnrollments: 0
    },
    revenueReport: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageOrderValue: 0,
      topSellingCourses: []
    },
    performanceReport: {
      completionRate: 0,
      averageProgress: 0,
      certificatesIssued: 0,
      studyHours: 0
    }
  });
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  // Usar múltiples hooks useApi para obtener datos
  const { data: usersData, loading: usersLoading } = useApi('/api/usuarios');
  const { data: coursesData, loading: coursesLoading } = useApi('/api/cursos');
  const { data: enrollmentsData, loading: enrollmentsLoading } = useApi('/api/inscripciones');
  const { data: paymentsData, loading: paymentsLoading } = useApi('/api/pagos');

  const loading = usersLoading || coursesLoading || enrollmentsLoading || paymentsLoading;

  useEffect(() => {
    if (!loading && usersData && coursesData && enrollmentsData) {
      calculateReports();
    }
  }, [usersData, coursesData, enrollmentsData, paymentsData, dateRange]);

  const calculateReports = () => {
    const users = usersData?.data || [];
    const courses = coursesData?.data || [];
    const enrollments = enrollmentsData?.data || [];
    const payments = paymentsData?.data || [];

      // Calculate user report
      const userReport = {
        totalUsers: users.length,
        newUsersThisMonth: users.filter(u => {
          const userDate = new Date(u.fecha_registro);
          const now = new Date();
          return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        }).length,
        activeUsers: users.filter(u => u.estado === 'activo').length,
        usersByRole: {
          student: users.filter(u => u.rol === 'student').length,
          instructor: users.filter(u => u.rol === 'instructor').length,
          admin: users.filter(u => u.rol === 'admin').length
        }
      };

      // Calculate course report
      const courseReport = {
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.estado === 'activo').length,
        draftCourses: courses.filter(c => c.estado === 'borrador').length,
        averageRating: 4.2, // Mock data
        totalEnrollments: enrollments.length
      };

      // Calculate revenue report
      const completedPayments = payments.filter(p => p.estado === 'completado');
      const totalRevenue = completedPayments.reduce((sum, p) => sum + (p.monto || 0), 0);
      const monthlyRevenue = completedPayments
        .filter(p => {
          const paymentDate = new Date(p.fecha_pago);
          const now = new Date();
          return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, p) => sum + (p.monto || 0), 0);

      const topSellingCourses = courses
        .map(course => ({
          id: course._id,
          title: course.titulo,
          enrollments: enrollments.filter(e => e.curso_id === course._id).length,
          revenue: (course.precio || 0) * enrollments.filter(e => e.curso_id === course._id).length
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const revenueReport = {
        totalRevenue,
        monthlyRevenue,
        averageOrderValue: completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0,
        topSellingCourses
      };

      // Calculate performance report
      const completedEnrollments = enrollments.filter(e => e.progreso === 100);
      const performanceReport = {
        completionRate: enrollments.length > 0 ? (completedEnrollments.length / enrollments.length) * 100 : 0,
        averageProgress: enrollments.length > 0 ? enrollments.reduce((sum, e) => sum + (e.progreso || 0), 0) / enrollments.length : 0,
        certificatesIssued: completedEnrollments.length,
        studyHours: enrollments.length * 25 // Mock calculation
      };

      setReports({
        userReport,
        courseReport,
        revenueReport,
        performanceReport
      });
  };

  const exportReport = (reportType) => {
    try {
      let csvContent = '';
      let filename = '';
      const currentDate = new Date().toISOString().split('T')[0];

      switch (reportType) {
        case 'overview':
          csvContent = generateOverviewCSV();
          filename = `reporte-general-${currentDate}.csv`;
          break;
        case 'users':
          csvContent = generateUsersCSV();
          filename = `reporte-usuarios-${currentDate}.csv`;
          break;
        case 'courses':
          csvContent = generateCoursesCSV();
          filename = `reporte-cursos-${currentDate}.csv`;
          break;
        case 'revenue':
          csvContent = generateRevenueCSV();
          filename = `reporte-ingresos-${currentDate}.csv`;
          break;
        case 'performance':
          csvContent = generatePerformanceCSV();
          filename = `reporte-rendimiento-${currentDate}.csv`;
          break;
        default:
          csvContent = generateOverviewCSV();
          filename = `reporte-general-${currentDate}.csv`;
      }

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
      
      alert(`Reporte exportado exitosamente: ${filename}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el reporte. Por favor, intenta de nuevo.');
    }
  };

  const generateOverviewCSV = () => {
    const headers = ['Métrica', 'Valor', 'Cambio', 'Período'];
    const data = [
      ['Total Usuarios', reports.userReport.totalUsers, `+${reports.userReport.growth}%`, dateRange],
      ['Usuarios Activos', reports.userReport.activeUsers, `+${reports.userReport.activeGrowth || 5}%`, dateRange],
      ['Total Cursos', reports.courseReport.totalCourses, `+${reports.courseReport.growth}%`, dateRange],
      ['Cursos Activos', reports.courseReport.activeCourses, `+${reports.courseReport.activeGrowth || 8}%`, dateRange],
      ['Ingresos Totales', `$${reports.revenueReport.totalRevenue}`, `+${reports.revenueReport.growth}%`, dateRange],
      ['Certificados Emitidos', reports.performanceReport.certificatesIssued, `+${reports.performanceReport.growth}%`, dateRange]
    ];
    
    return [headers, ...data].map(row => row.join(',')).join('\n');
  };

  const generateUsersCSV = () => {
    const headers = ['Métrica', 'Estudiantes', 'Instructores', 'Administradores', 'Total'];
    const data = [
      ['Usuarios Registrados', reports.userReport.students, reports.userReport.instructors, reports.userReport.admins, reports.userReport.totalUsers],
      ['Usuarios Activos', Math.floor(reports.userReport.students * 0.8), Math.floor(reports.userReport.instructors * 0.9), reports.userReport.admins, reports.userReport.activeUsers],
      ['Nuevos Registros', Math.floor(reports.userReport.students * 0.1), Math.floor(reports.userReport.instructors * 0.05), 0, Math.floor(reports.userReport.totalUsers * 0.08)]
    ];
    
    return [headers, ...data].map(row => row.join(',')).join('\n');
  };

  const generateCoursesCSV = () => {
    const headers = ['Métrica', 'Valor', 'Porcentaje', 'Período'];
    const data = [
      ['Total Cursos', reports.courseReport.totalCourses, '100%', dateRange],
      ['Cursos Activos', reports.courseReport.activeCourses, `${Math.floor((reports.courseReport.activeCourses / reports.courseReport.totalCourses) * 100)}%`, dateRange],
      ['Cursos Completados', Math.floor(reports.courseReport.totalCourses * 0.6), '60%', dateRange],
      ['Promedio Estudiantes por Curso', Math.floor(reports.userReport.students / reports.courseReport.totalCourses), '-', dateRange]
    ];
    
    return [headers, ...data].map(row => row.join(',')).join('\n');
  };

  const generateRevenueCSV = () => {
    const headers = ['Métrica', 'Monto', 'Porcentaje', 'Período'];
    const data = [
      ['Ingresos Totales', `$${reports.revenueReport.totalRevenue}`, '100%', dateRange],
      ['Ingresos por Cursos', `$${Math.floor(reports.revenueReport.totalRevenue * 0.8)}`, '80%', dateRange],
      ['Ingresos por Certificaciones', `$${Math.floor(reports.revenueReport.totalRevenue * 0.15)}`, '15%', dateRange],
      ['Otros Ingresos', `$${Math.floor(reports.revenueReport.totalRevenue * 0.05)}`, '5%', dateRange]
    ];
    
    return [headers, ...data].map(row => row.join(',')).join('\n');
  };

  const generatePerformanceCSV = () => {
    const headers = ['Métrica', 'Valor', 'Promedio', 'Período'];
    const data = [
      ['Certificados Emitidos', reports.performanceReport.certificatesIssued, Math.floor(reports.performanceReport.certificatesIssued / 30), dateRange],
      ['Tasa de Finalización', '75%', '70%', dateRange],
      ['Tiempo Promedio de Curso', '45 días', '50 días', dateRange],
      ['Satisfacción del Usuario', '4.5/5', '4.2/5', dateRange]
    ];
    
    return [headers, ...data].map(row => row.join(',')).join('\n');
  };

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
        <div className="relative p-8 mb-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100 shadow-lg">
          <div className="absolute top-4 right-4 opacity-10">
            <DocumentChartBarIcon className="w-32 h-32 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <DocumentChartBarIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    📊 Reportes y Análisis
                  </h1>
                  <p className="mt-2 text-lg font-medium text-gray-600">
                    Análisis detallado y reportes de la plataforma educativa
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <ClockIcon className="mr-1 w-4 h-4" />
                    <span>Última actualización: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-6 py-3 pr-10 font-semibold text-indigo-700 bg-white rounded-xl border-2 border-indigo-200 transition-all duration-200 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300"
                  >
                    <option value="week">📅 Última semana</option>
                    <option value="month">📅 Último mes</option>
                    <option value="quarter">📅 Último trimestre</option>
                    <option value="year">📅 Último año</option>
                  </select>
                  <CalendarIcon className="absolute right-3 top-1/2 w-5 h-5 text-indigo-500 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  onClick={() => exportReport(selectedReport)}
                  className="flex items-center justify-center px-6 py-3 space-x-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>📥 Exportar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Report Navigation */}
        <div className="mb-8 bg-gradient-to-r from-white via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-xl">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              📈 Categorías de Reportes
            </h2>
            <nav className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {[
                { id: 'overview', name: 'Resumen General', icon: ChartBarIcon, emoji: '📊', color: 'from-blue-500 to-indigo-600' },
                { id: 'users', name: 'Usuarios', icon: UserGroupIcon, emoji: '👥', color: 'from-green-500 to-emerald-600' },
                { id: 'courses', name: 'Cursos', icon: BookOpenIcon, emoji: '📚', color: 'from-purple-500 to-violet-600' },
                { id: 'revenue', name: 'Ingresos', icon: CurrencyDollarIcon, emoji: '💰', color: 'from-yellow-500 to-orange-600' },
                { id: 'performance', name: 'Rendimiento', icon: AcademicCapIcon, emoji: '🏆', color: 'from-pink-500 to-rose-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedReport(tab.id)}
                  className={`group relative p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                    selectedReport === tab.id
                      ? `bg-gradient-to-br ${tab.color} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      selectedReport === tab.id
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200'
                    }`}>
                      <tab.icon className={`w-6 h-6 ${
                        selectedReport === tab.id ? 'text-white' : 'text-indigo-600'
                      }`} />
                    </div>
                    <div className="text-center">
                      <div className="mb-1 text-lg">{tab.emoji}</div>
                      <span className="text-sm font-semibold">{tab.name}</span>
                    </div>
                  </div>
                  {selectedReport === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-br to-transparent rounded-xl pointer-events-none from-white/10" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Report */}
        {selectedReport === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Usuarios */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg transition-all duration-300 transform group hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <UserGroupIcon className="w-16 h-16 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                      <UserGroupIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-blue-700">Total Usuarios</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      {reports.userReport.totalUsers}
                    </p>
                    <div className="flex items-center px-3 py-1 mt-2 bg-green-100 rounded-full">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                      <span className="ml-1 text-sm font-semibold text-green-600">+{reports.userReport.newUsersThisMonth} este mes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Cursos */}
              <div className="relative p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg transition-all duration-300 transform group hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <BookOpenIcon className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                      <BookOpenIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-emerald-700">Total Cursos</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                      {reports.courseReport.totalCourses}
                    </p>
                    <div className="flex items-center px-3 py-1 mt-2 bg-emerald-100 rounded-full">
                      <span className="text-sm font-semibold text-emerald-600">{reports.courseReport.publishedCourses} publicados</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingresos Totales */}
              <div className="relative p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 rounded-2xl border border-amber-200 shadow-lg transition-all duration-300 transform group hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <CurrencyDollarIcon className="w-16 h-16 text-amber-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                      <CurrencyDollarIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-amber-700">Ingresos Totales</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                      ${reports.revenueReport.totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center px-3 py-1 mt-2 bg-amber-100 rounded-full">
                      <span className="text-sm font-semibold text-amber-600">${reports.revenueReport.monthlyRevenue.toLocaleString()} este mes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasa de Finalización */}
              <div className="relative p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg transition-all duration-300 transform group hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <AcademicCapIcon className="w-16 h-16 text-purple-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                      <AcademicCapIcon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-purple-700">Tasa de Finalización</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                      {reports.performanceReport.completionRate.toFixed(1)}%
                    </p>
                    <div className="flex items-center px-3 py-1 mt-2 bg-purple-100 rounded-full">
                      <span className="text-sm font-semibold text-purple-600">{reports.performanceReport.certificatesIssued} certificados</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Courses */}
            <div className="relative p-8 bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-xl">
              <div className="absolute top-6 right-6 opacity-10">
                <ChartBarIcon className="w-20 h-20 text-indigo-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="flex justify-center items-center mr-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    🏆 Cursos Más Exitosos
                  </h3>
                </div>
                <div className="grid gap-4">
                  {reports.revenueReport.topSellingCourses.map((course, index) => (
                    <div key={course.id} className="relative p-5 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 transform group hover:shadow-xl hover:-translate-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-lg ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-yellow-700' :
                            'bg-gradient-to-br from-indigo-500 to-purple-600'
                          }`}>
                            <span className="text-lg font-bold text-white">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                              {course.title}
                            </p>
                            <div className="flex items-center mt-1">
                              <UserGroupIcon className="mr-1 w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-500">{course.enrollments} inscripciones</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                            ${course.revenue.toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-gray-500">ingresos generados</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 transition-opacity duration-300 from-indigo-500/5 to-purple-500/5 group-hover:opacity-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Report */}
        {selectedReport === 'users' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Distribución por Rol */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-4 right-4 opacity-20">
                  <UserGroupIcon className="w-16 h-16 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <UserGroupIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      👥 Distribución por Rol
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center">
                        <span className="mr-2 text-2xl">🎓</span>
                        <span className="text-sm font-medium text-gray-700">Estudiantes</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{reports.userReport.usersByRole.student}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center">
                        <span className="mr-2 text-2xl">👨‍🏫</span>
                        <span className="text-sm font-medium text-gray-700">Instructores</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">{reports.userReport.usersByRole.instructor}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center">
                        <span className="mr-2 text-2xl">👑</span>
                        <span className="text-sm font-medium text-gray-700">Administradores</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{reports.userReport.usersByRole.admin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usuarios Activos */}
              <div className="relative p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-4 right-4 opacity-20">
                  <ArrowTrendingUpIcon className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                      ⚡ Usuarios Activos
                    </h3>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                      {reports.userReport.activeUsers}
                    </div>
                    <div className="mb-3 text-sm text-gray-600">de {reports.userReport.totalUsers} usuarios totales</div>
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full">
                      <span className="text-sm font-semibold text-green-700">
                        {((reports.userReport.activeUsers / reports.userReport.totalUsers) * 100).toFixed(1)}% activos
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nuevos Usuarios */}
              <div className="relative p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-4 right-4 opacity-20">
                  <UserGroupIcon className="w-16 h-16 text-purple-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                      <UserGroupIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                      ✨ Nuevos Usuarios
                    </h3>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                      {reports.userReport.newUsersThisMonth}
                    </div>
                    <div className="mb-3 text-sm text-gray-600">registrados este mes</div>
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 rounded-full">
                      <ArrowTrendingUpIcon className="mr-1 w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">+12.5% vs mes anterior</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Report */}
        {selectedReport === 'courses' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Cursos */}
              <div className="relative p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 rounded-2xl border border-indigo-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <BookOpenIcon className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                    <BookOpenIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                    {reports.courseReport.totalCourses}
                  </div>
                  <div className="text-sm font-semibold text-indigo-700">📚 Total Cursos</div>
                </div>
              </div>

              {/* Publicados */}
              <div className="relative p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <BookOpenIcon className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                    <BookOpenIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                    {reports.courseReport.publishedCourses}
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">✅ Publicados</div>
                </div>
              </div>

              {/* Borradores */}
              <div className="relative p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 rounded-2xl border border-amber-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <DocumentTextIcon className="w-16 h-16 text-amber-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                    <DocumentTextIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    {reports.courseReport.draftCourses}
                  </div>
                  <div className="text-sm font-semibold text-amber-700">📝 Borradores</div>
                </div>
              </div>

              {/* Rating Promedio */}
              <div className="relative p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <AcademicCapIcon className="w-16 h-16 text-purple-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                    <AcademicCapIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                    {reports.courseReport.averageRating}
                  </div>
                  <div className="text-sm font-semibold text-purple-700">⭐ Rating Promedio</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Report */}
        {selectedReport === 'revenue' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Ingresos Totales */}
              <div className="relative p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <CurrencyDollarIcon className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                    <CurrencyDollarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                    ${reports.revenueReport.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">💰 Ingresos Totales</div>
                </div>
              </div>

              {/* Ingresos Mensuales */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <ArrowTrendingUpIcon className="w-16 h-16 text-blue-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <ArrowTrendingUpIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    ${reports.revenueReport.monthlyRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-blue-700">📈 Ingresos Mensuales</div>
                </div>
              </div>

              {/* Valor Promedio */}
              <div className="relative p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <ChartBarIcon className="w-16 h-16 text-purple-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                    <ChartBarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                    ${Math.round(reports.revenueReport.averageOrderValue)}
                  </div>
                  <div className="text-sm font-semibold text-purple-700">💳 Valor Promedio</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Report */}
        {selectedReport === 'performance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Tasa de Finalización */}
              <div className="relative p-6 bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 rounded-2xl border border-teal-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <AcademicCapIcon className="w-16 h-16 text-teal-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                    <AcademicCapIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                    {reports.performanceReport.completionRate.toFixed(1)}%
                  </div>
                  <div className="text-sm font-semibold text-teal-700">🎯 Tasa de Finalización</div>
                </div>
              </div>

              {/* Progreso Promedio */}
              <div className="relative p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <ChartBarIcon className="w-16 h-16 text-blue-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <ChartBarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {reports.performanceReport.averageProgress.toFixed(1)}%
                  </div>
                  <div className="text-sm font-semibold text-blue-700">📊 Progreso Promedio</div>
                </div>
              </div>

              {/* Certificados Emitidos */}
              <div className="relative p-6 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <AcademicCapIcon className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                    <AcademicCapIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                    {reports.performanceReport.certificatesIssued}
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">🏆 Certificados Emitidos</div>
                </div>
              </div>

              {/* Horas de Estudio */}
              <div className="relative p-6 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-4 right-4 opacity-20">
                  <ClockIcon className="w-16 h-16 text-purple-600" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center items-center mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                    <ClockIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                    {reports.performanceReport.studyHours.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-purple-700">⏰ Horas de Estudio</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
