import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import { useApi } from "../../hooks/useApi";
import { API_ROUTES } from "../../utils/constants";
import { formatCurrency } from "../../utils/helpers";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../../components/ui/StatCard";

const InstructorAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30");

  // Usar hooks personalizados para obtener datos
  const {
    data: analytics,
    loading,
    error,
    refetch,
  } = useApi(
    `${API_ROUTES.ANALYTICS}/instructor/${user?.id}?days=${timeRange}`,
    {
      overview: {
        totalRevenue: 15420.5,
        totalStudents: 342,
        totalCourses: 8,
        averageRating: 4.7,
        revenueChange: 12.5,
        studentsChange: 8.3,
        coursesChange: 0,
        ratingChange: 0.2,
      },
      coursePerformance: [],
      revenueData: [],
      studentEngagement: {
        totalViews: 2450,
        averageWatchTime: 45,
        completionRate: 78,
        dropoffRate: 22,
      },
      topCourses: [],
      recentActivity: [],
    }
  );

  // Datos de ejemplo para desarrollo
  const mockData = {
    coursePerformance: [
      {
        id: 1,
        titulo: "Introducción a React",
        estudiantes: 125,
        ingresos: 6250,
        rating: 4.8,
        completionRate: 78,
      },
      {
        id: 2,
        titulo: "JavaScript Avanzado",
        estudiantes: 98,
        ingresos: 4900,
        rating: 4.6,
        completionRate: 82,
      },
      {
        id: 3,
        titulo: "Node.js Fundamentals",
        estudiantes: 76,
        ingresos: 3800,
        rating: 4.5,
        completionRate: 71,
      },
    ],
    recentActivity: [
      {
        type: "enrollment",
        message: 'Nuevo estudiante inscrito en "Introducción a React"',
        time: "2024-01-20 14:30",
        course: "Introducción a React",
      },
      {
        type: "completion",
        message: 'Estudiante completó "JavaScript Avanzado"',
        time: "2024-01-20 12:15",
        course: "JavaScript Avanzado",
      },
      {
        type: "review",
        message: 'Nueva reseña de 5 estrellas en "Node.js Fundamentals"',
        time: "2024-01-20 10:45",
        course: "Node.js Fundamentals",
      },
    ],
  };

  // Función auxiliar para formatear números
  const formatNumber = (num) => {
    return new Intl.NumberFormat("es-MX").format(num);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "enrollment":
        return <UserGroupIcon className="w-5 h-5 text-blue-500" />;
      case "completion":
        return <AcademicCapIcon className="w-5 h-5 text-green-500" />;
      case "review":
        return <StarIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando analytics..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <ChartBarIcon className="w-8 h-8 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">
                  Analiza el rendimiento de tus cursos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="7">Últimos 7 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
                <option value="365">Último año</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <StatCard
            title="Ingresos Totales"
            value={formatCurrency(analytics.overview.totalRevenue)}
            change={analytics.overview.revenueChange}
            icon={CurrencyDollarIcon}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
          />
          <StatCard
            title="Total Estudiantes"
            value={formatNumber(analytics.overview.totalStudents)}
            change={analytics.overview.studentsChange}
            icon={UserGroupIcon}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
          <StatCard
            title="Cursos Activos"
            value={analytics.overview.totalCourses}
            change={analytics.overview.coursesChange}
            icon={AcademicCapIcon}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
          <StatCard
            title="Rating Promedio"
            value={analytics.overview.averageRating.toFixed(1)}
            change={analytics.overview.ratingChange}
            icon={StarIcon}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Course Performance */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Rendimiento por Curso
            </h3>
            <div className="space-y-4">
              {analytics.coursePerformance.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {course.titulo}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Estudiantes</p>
                      <p className="font-medium">{course.estudiantes}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Ingresos</p>
                      <p className="font-medium">
                        {formatCurrency(course.ingresos)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completado</p>
                      <p className="font-medium">{course.completionRate}%</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-teal-600 rounded-full"
                        style={{ width: `${course.completionRate}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Engagement */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Engagement de Estudiantes
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <EyeIcon className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Total de Visualizaciones
                    </p>
                    <p className="text-sm text-gray-500">Vistas de lecciones</p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-gray-900">
                  {formatNumber(analytics.studentEngagement.totalViews)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tiempo Promedio
                    </p>
                    <p className="text-sm text-gray-500">Minutos por sesión</p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-gray-900">
                  {analytics.studentEngagement.averageWatchTime}m
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tasa de Finalización
                    </p>
                    <p className="text-sm text-gray-500">Cursos completados</p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-gray-900">
                  {analytics.studentEngagement.completionRate}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tasa de Abandono
                    </p>
                    <p className="text-sm text-gray-500">
                      Estudiantes que abandonan
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-semibold text-gray-900">
                  {analytics.studentEngagement.dropoffRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Top Courses */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Cursos Más Exitosos
            </h3>
            <div className="space-y-4">
              {analytics.topCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-500"
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {course.titulo}
                      </p>
                      <p className="text-sm text-gray-500">
                        {course.estudiantes} estudiantes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(course.ingresos)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <CalendarIcon className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;
