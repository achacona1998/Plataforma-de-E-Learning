import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useApi } from "../../hooks/useApi";
import {
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const AdminStatistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeStudents: 0,
    completedCourses: 0,
    monthlyGrowth: 0,
    courseGrowth: 0,
    revenueGrowth: 0,
    enrollmentGrowth: 0,
    recentActivity: [],
    topCourses: [],
    userGrowth: [],
    revenueData: [],
  });
  const [timeRange, setTimeRange] = useState("month");

  // Usar el nuevo endpoint de estadísticas administrativas
  const { data: statsResponse, loading } = useApi(
    "/api/usuarios/admin/estadisticas"
  );

  useEffect(() => {
    if (!loading && statsResponse && statsResponse.success) {
      setStats(statsResponse.data);
    }
  }, [statsResponse, loading]);

  // Función para calcular el valor máximo de un array de datos
  const getMaxValue = (data, key) => {
    if (!data || data.length === 0) return 1;
    const values = data.map((item) => item[key] || 0);
    const max = Math.max(...values);
    return max > 0 ? max : 1;
  };

  // Constante con los datos de las tarjetas estadísticas
  const statisticsCards = [
    {
      id: "totalUsers",
      title: "Total Usuarios",
      value: stats.totalUsers,
      growth: stats.monthlyGrowth,
      icon: UserGroupIcon,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      formatter: (value) => value,
    },
    {
      id: "totalCourses",
      title: "Total Cursos",
      value: stats.totalCourses,
      growth: stats.courseGrowth,
      icon: BookOpenIcon,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      formatter: (value) => value,
    },
    {
      id: "totalRevenue",
      title: "Ingresos Totales",
      value: stats.totalRevenue,
      growth: stats.revenueGrowth,
      icon: CurrencyDollarIcon,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      formatter: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      id: "activeStudents",
      title: "Estudiantes Activos",
      value: stats.activeStudents,
      growth: stats.enrollmentGrowth,
      icon: AcademicCapIcon,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      formatter: (value) => value,
    },
  ];

  // Componente Card reutilizable con diseño moderno
  const StatisticCard = ({
    title,
    value,
    growth,
    icon: Icon,
    bgColor,
    iconColor,
    formatter,
  }) => (
    <div className="overflow-hidden relative p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-50"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div
            className={`p-4 rounded-xl shadow-md transition-transform duration-300 ${bgColor} group-hover:scale-110`}>
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
          <div className="text-right">
            <div className="flex items-center">
              {growth >= 0 ? (
                <ArrowTrendingUpIcon className="mr-1 w-4 h-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="mr-1 w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  growth >= 0 ? "text-green-600" : "text-red-600"
                } bg-${growth >= 0 ? "green" : "red"}-50 px-2 py-1 rounded-lg`}>
                {growth >= 0 ? "+" : ""}
                {growth || 0}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-teal-700">
            {formatter(value)}
          </p>
          <div className="overflow-hidden mt-3 h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"
              style={{ width: "75%" }}></div>
          </div>
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-700 transform -translate-x-full -skew-x-12 group-hover:opacity-20 group-hover:translate-x-full"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-32 h-32 rounded-full border-b-2 border-teal-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header Moderno */}
        <div className="mb-8">
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl shadow-md">
                  <ChartBarIcon className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-transparent text-gray-900 bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
                    📊 Estadísticas
                  </h1>
                  <p className="mt-1 text-gray-600">
                    Panel de análisis y métricas de la plataforma educativa
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <CalendarIcon className="mr-1 w-4 h-4" />
                    Última actualización:{" "}
                    {new Date().toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="py-3 pr-4 pl-10 text-sm font-medium bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:shadow-md">
                    <option value="week">📅 Última semana</option>
                    <option value="month">📅 Último mes</option>
                    <option value="quarter">📅 Último trimestre</option>
                    <option value="year">📅 Último año</option>
                  </select>
                </div>

                <button className="flex items-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl shadow-md transition-all duration-200 hover:from-teal-600 hover:to-blue-600 hover:shadow-lg">
                  <ArrowTrendingUpIcon className="mr-2 w-4 h-4" />
                  Exportar Datos
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statisticsCards.map((card) => (
            <StatisticCard
              key={card.id}
              title={card.title}
              value={card.value}
              growth={card.growth}
              icon={card.icon}
              bgColor={card.bgColor}
              iconColor={card.iconColor}
              formatter={card.formatter}
            />
          ))}
        </div>

        {/* Sección de Gráficos Modernos */}
        <div className="grid grid-cols-1 gap-8 mb-8 xl:grid-cols-2">
          {/* User Growth Chart */}
          <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg">
            <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <UserGroupIcon className="mr-2 w-5 h-5 text-teal-600" />
                    📈 Crecimiento de Usuarios
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">Últimos 12 meses</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">
                    {stats.userGrowth?.reduce(
                      (acc, curr) => acc + (curr.users || 0),
                      0
                    ) || 0}
                  </div>
                  <div className="text-xs text-gray-500">Total usuarios</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <div className="flex justify-between items-end space-x-1 h-64 min-w-[600px]">
                  {(() => {
                    const maxUsers = getMaxValue(stats.userGrowth, "users");

                    return (stats.userGrowth || []).map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-col flex-1 items-center min-w-[45px]">
                          <div
                            className="w-full bg-teal-500 rounded-t transition-all duration-300 cursor-pointer hover:bg-teal-600"
                            style={{
                              height: `${
                                ((data.users || 0) / (maxUsers || 1)) * 200
                              }px`,
                              minHeight: "2px",
                            }}
                            title={`${data.month}: ${data.users} usuarios`}></div>
                          <span className="mt-2 text-xs text-gray-600 transform origin-center -rotate-45">
                            {data.month || ""}
                          </span>
                          <span className="mt-1 text-xs font-medium text-gray-900">
                            {data.users || 0}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900">
                    <CurrencyDollarIcon className="mr-2 w-5 h-5 text-green-600" />
                    💰 Ingresos Mensuales
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">Últimos 12 meses</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    $
                    {(
                      stats.revenueData?.reduce(
                        (acc, curr) => acc + (curr.revenue || 0),
                        0
                      ) || 0
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Ingresos totales</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <div className="flex justify-between items-end space-x-1 h-64 min-w-[600px]">
                  {(() => {
                    const maxRevenue = getMaxValue(
                      stats.revenueData,
                      "revenue"
                    );
                    return (stats.revenueData || []).map((data, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-col flex-1 items-center min-w-[45px]">
                          <div
                            className="w-full bg-green-500 rounded-t transition-all duration-300 cursor-pointer hover:bg-green-600"
                            style={{
                              height: `${
                                ((data.revenue || 0) / (maxRevenue || 1)) * 200
                              }px`,
                              minHeight: "2px",
                            }}
                            title={`${data.month}: $${(
                              data.revenue || 0
                            ).toLocaleString()}`}></div>
                          <span className="mt-2 text-xs text-gray-600 transform origin-center -rotate-45">
                            {data.month || ""}
                          </span>
                          <span className="mt-1 text-xs font-medium text-gray-900">
                            ${((data.revenue || 0) / 1000).toFixed(0)}k
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Top Courses */}
            <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  <BookOpenIcon className="mr-2 w-5 h-5 text-purple-600" />
                  🏆 Cursos Más Populares
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Top 5 por ingresos y calificación
                </p>
              </div>
              <div className="p-6 space-y-4">
                {(stats.topCourses || []).map((course, index) => (
                  <div
                    key={course.id}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-md group">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex justify-center items-center w-10 h-10 text-sm font-bold text-white rounded-xl shadow-md ${
                            index === 0
                              ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-400 to-gray-600"
                              : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-yellow-700"
                              : "bg-gradient-to-br from-teal-400 to-blue-500"
                          }`}>
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-purple-700">
                          {course.title}
                        </p>
                        <p className="flex items-center mt-1 text-xs text-gray-500">
                          <UserGroupIcon className="mr-1 w-3 h-3" />
                          {course.enrollments} estudiantes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="px-2 py-1 text-sm font-bold text-green-600 bg-green-50 rounded-lg">
                        ${(course.revenue || 0).toLocaleString()}
                      </p>
                      <div className="flex justify-end items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.floor(course.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-1 text-xs font-medium text-gray-600">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  <CalendarIcon className="mr-2 w-5 h-5 text-blue-600" />
                  🔔 Actividad Reciente
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Últimas 5 actividades
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {(stats.recentActivity || [])
                    .slice(0, 5)
                    .map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-center p-4 space-x-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-md group">
                        <div className="flex-shrink-0">
                          <div
                            className={`flex justify-center items-center w-12 h-12 text-sm font-bold text-white rounded-xl shadow-md ${
                              activity.type === "enrollment"
                                ? "bg-gradient-to-br from-green-400 to-emerald-600"
                                : activity.type === "completion"
                                ? "bg-gradient-to-br from-blue-400 to-indigo-600"
                                : activity.type === "payment"
                                ? "bg-gradient-to-br from-yellow-400 to-orange-600"
                                : "bg-gradient-to-br from-teal-400 to-cyan-600"
                            }`}>
                            {activity.type === "enrollment"
                              ? "📚"
                              : activity.type === "completion"
                              ? "🎓"
                              : activity.type === "payment"
                              ? "💰"
                              : activity.user
                              ? activity.user.charAt(0).toUpperCase()
                              : "👤"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-gray-900 truncate transition-colors group-hover:text-blue-700">
                              {activity.action}
                            </p>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                activity.type === "enrollment"
                                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                                  : activity.type === "completion"
                                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
                                  : activity.type === "payment"
                                  ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800"
                                  : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800"
                              }`}>
                              {activity.type === "enrollment"
                                ? "📚 Inscripción"
                                : activity.type === "completion"
                                ? "🎓 Completado"
                                : activity.type === "payment"
                                ? "💰 Pago"
                                : "Actividad"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md">
                              {activity.time}
                            </p>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm animate-pulse"></div>
                              <span className="text-xs font-medium text-gray-500">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
              <div className="p-6 text-center bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
                <div className="p-4 mb-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                  <BookOpenIcon className="mx-auto mb-2 w-8 h-8 text-teal-600" />
                  <div className="text-3xl font-bold text-teal-600 transition-transform duration-300 group-hover:scale-110">
                    {stats.completedCourses}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  🎯 Cursos Completados
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Total de cursos finalizados
                </div>
              </div>

              <div className="p-6 text-center bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
                <div className="p-4 mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <CurrencyDollarIcon className="mx-auto mb-2 w-8 h-8 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-110">
                    $
                    {Math.round(
                      (stats.totalRevenue || 0) / (stats.totalUsers || 1)
                    ) || 0}
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  💰 Ingreso Promedio por Usuario
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Revenue per user
                </div>
              </div>

              <div className="p-6 text-center bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
                <div className="p-4 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <ChartBarIcon className="mx-auto mb-2 w-8 h-8 text-green-600" />
                  <div className="text-3xl font-bold text-green-600 transition-transform duration-300 group-hover:scale-110">
                    {Math.round(
                      ((stats.completedCourses || 0) /
                        ((stats.totalCourses || 1) *
                          (stats.activeStudents || 1))) *
                        100
                    ) || 0}
                    %
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  📊 Tasa de Finalización
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Completion rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistics;
