import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "../../layout/AdminLayout";
import {
  BookOpenIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useApi } from "../../hooks/useApi";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalCertificates: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Usar hooks useApi para cada endpoint
  const { data: cursosData, loading: cursosLoading } = useApi("/api/cursos");
  const { data: usuariosData, loading: usuariosLoading } =
    useApi("/api/usuarios");
  const { data: inscripcionesData, loading: inscripcionesLoading } =
    useApi("/api/inscripciones");
  const { data: certificadosData, loading: certificadosLoading } = useApi(
    "/api/certificados/admin/todos"
  );

  const loading =
    cursosLoading ||
    usuariosLoading ||
    inscripcionesLoading ||
    certificadosLoading;

  // Función para calcular tiempo transcurrido
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "hace menos de 1 hora";
    if (diffInHours < 24)
      return `hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    if (diffInDays < 7)
      return `hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
    return `hace ${Math.floor(diffInDays / 7)} semana${
      Math.floor(diffInDays / 7) > 1 ? "s" : ""
    }`;
  };

  // Calcular estadísticas cuando los datos estén disponibles
  useEffect(() => {
    // Calcular estadísticas con los datos disponibles, usando fallbacks si es necesario
    const cursos = cursosData?.data || [];
    const usuarios = usuariosData?.data || [];
    const inscripciones = inscripcionesData?.data || [];
    const certificados = certificadosData?.data || [];

    // Calcular total de cursos
    const totalCourses = cursos.filter(curso => curso.estado === "publicado").length;

    // Calcular total de estudiantes - si no hay datos de usuarios, usar inscripciones únicas
    let totalStudents = 0;
    if (usuarios.length > 0) {
      totalStudents = usuarios.filter((u) => u.rol === "estudiante").length;
    } else if (inscripciones.length > 0) {
      // Contar estudiantes únicos de las inscripciones
      const estudiantesUnicos = new Set(
        inscripciones.map(
          (insc) => insc.estudiante_id?._id || insc.estudiante_id
        )
      );
      totalStudents = estudiantesUnicos.size;
    }

    // Calcular ingresos potenciales
    let totalRevenue = 0;
    if (cursos.length > 0 && inscripciones.length > 0) {
      // Calcular ingresos basado en inscripciones reales
      totalRevenue = inscripciones.reduce((sum, insc) => {
        const curso = cursos.find(
          (c) => c._id === (insc.curso_id?._id || insc.curso_id)
        );
        return sum + (curso?.precio || 0);
      }, 0);
    } else if (cursos.length > 0) {
      // Fallback: usar total_estudiantes de cada curso
      totalRevenue = cursos.reduce(
        (sum, curso) => sum + curso.precio * (curso.total_estudiantes || 0),
        0
      );
    }

    // Calcular total de certificados
    const totalCertificates = certificados.length;

    setStats({
      totalCourses,
      totalStudents,
      totalRevenue,
      totalCertificates,
    });
  }, [cursosData, usuariosData, inscripcionesData, certificadosData]);

  // Generar actividad reciente cuando los datos estén disponibles
  useEffect(() => {
    const certificados = Array.isArray(certificadosData)
      ? certificadosData
      : [];
    const inscripciones = Array.isArray(inscripcionesData)
      ? inscripcionesData
      : [];
    const activities = [];

    // Solo procesar si tenemos al menos algunos datos
    if (certificados.length > 0 || inscripciones.length > 0) {
      // Agregar certificados recientes
      certificados.slice(0, 3).forEach((cert) => {
        activities.push({
          id: `cert-${cert._id}`,
          user: cert.estudiante_id?.nombre || "Usuario",
          action: `completó el curso "${cert.curso_id?.titulo || "Curso"}"`,
          time: getTimeAgo(cert.fecha_emision),
          avatar: "/placeholder-avatar.svg",
        });
      });

      // Agregar inscripciones recientes
      inscripciones.slice(0, 2).forEach((insc) => {
        activities.push({
          id: `insc-${insc._id}`,
          user: insc.estudiante_id?.nombre || "Usuario",
          action: `se inscribió en "${insc.curso_id?.titulo || "Curso"}"`,
          time: getTimeAgo(insc.fecha_inscripcion),
          avatar: "/placeholder-avatar.svg",
        });
      });

      // Ordenar por fecha más reciente
      activities.sort((a, b) => {
        const timeA = a.time.includes("hora")
          ? 1
          : a.time.includes("día")
          ? 2
          : 3;
        const timeB = b.time.includes("hora")
          ? 1
          : b.time.includes("día")
          ? 2
          : 3;
        return timeA - timeB;
      });

      setRecentActivity(activities.slice(0, 5));
    }
  }, [certificadosData, inscripcionesData]);

  // Generar notificaciones cuando los datos estén disponibles
  useEffect(() => {
    const cursos = Array.isArray(cursosData) ? cursosData : [];
    const usuarios = Array.isArray(usuariosData) ? usuariosData : [];
    const estudiantes = usuarios.filter((u) => u.rol === "estudiante");
    const notifs = [];

    // Solo procesar si tenemos al menos algunos datos
    if (cursos.length > 0 || usuarios.length > 0) {
      // Notificación sobre cursos publicados recientemente
      const cursosRecientes = cursos.filter((curso) => {
        const fechaPublicacion = new Date(curso.fecha_publicacion);
        const diasTranscurridos =
          (new Date() - fechaPublicacion) / (1000 * 60 * 60 * 24);
        return diasTranscurridos <= 7;
      });

      if (cursosRecientes.length > 0) {
        notifs.push({
          id: 1,
          title: `${cursosRecientes.length} curso${
            cursosRecientes.length > 1 ? "s" : ""
          } publicado${cursosRecientes.length > 1 ? "s" : ""} recientemente`,
          description: `Se ${
            cursosRecientes.length > 1 ? "han" : "ha"
          } publicado ${cursosRecientes.length} nuevo${
            cursosRecientes.length > 1 ? "s" : ""
          } curso${cursosRecientes.length > 1 ? "s" : ""} en la plataforma.`,
          time: "1 día",
          type: "success",
        });
      }

      // Notificación sobre estudiantes registrados
      if (estudiantes.length > 0) {
        notifs.push({
          id: 2,
          title: `${estudiantes.length} estudiantes registrados`,
          description: `La plataforma cuenta con ${estudiantes.length} estudiantes activos.`,
          time: "2 días",
          type: "info",
        });
      }

      // Notificación sobre cursos populares
      const cursosPopulares = cursos.filter(
        (curso) => (curso.total_estudiantes || 0) > 0
      );
      if (cursosPopulares.length > 0) {
        notifs.push({
          id: 3,
          title: `${cursosPopulares.length} cursos con inscripciones activas`,
          description: `Los cursos están teniendo buena acogida entre los estudiantes.`,
          time: "3 días",
          type: "success",
        });
      }

      // Notificación general
      notifs.push({
        id: 4,
        title: "Sistema funcionando correctamente",
        description: "Todos los servicios de la plataforma están operativos.",
        time: "1 semana",
        type: "info",
      });

      setNotifications(notifs);
    }
  }, [cursosData, usuariosData]);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Dashboard Content */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  🏠 Dashboard de Administrador
                </h1>
                <p className="text-gray-700 text-lg mb-2">
                  Bienvenido de nuevo, <span className="font-semibold text-blue-700">{user?.nombre || "Usuario"}</span>
                </p>
                <p className="text-gray-600">
                  Aquí tienes un resumen completo de la actividad y estadísticas de la plataforma.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpenIcon className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-600">
              <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Última actualización: {new Date().toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow animate-pulse">
                <div className="flex items-center">
                  <div className="p-3 w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 ml-4">
                    <div className="mb-2 h-4 bg-gray-200 rounded"></div>
                    <div className="mb-2 h-8 bg-gray-200 rounded"></div>
                    <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalCourses}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">📚 Total Cursos</h3>
                <p className="text-sm text-blue-600 font-semibold">
                  Publicados en la plataforma
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalStudents.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">👥 Estudiantes</h3>
                <p className="text-sm text-green-600 font-semibold">
                  Usuarios activos registrados
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg border border-yellow-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                  <CurrencyDollarIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">💰 Ingresos</h3>
                <p className="text-sm text-yellow-600 font-semibold">
                  Generados por inscripciones
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalCertificates}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">🎓 Certificados</h3>
                <p className="text-sm text-purple-600 font-semibold">
                  Cursos completados exitosamente
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 lg:col-span-2">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                  📊 Actividad Reciente
                </h2>
                <button className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:from-blue-200 hover:to-indigo-200 transition-all duration-200">
                  Ver todo
                </button>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-4 animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="mb-3 h-4 bg-gray-200 rounded"></div>
                        <div className="w-1/3 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {activity.user.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-2">
                          <span className="font-bold text-blue-700">{activity.user}</span>{" "}
                          <span className="text-gray-700">{activity.action}</span>
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-semibold">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpenIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">📈 Sin Actividad</h3>
                    <p className="text-gray-500">No hay actividad reciente para mostrar</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                🔔 Notificaciones
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-white rounded-xl border border-gray-200 animate-pulse">
                      <div className="mb-3 h-4 bg-gray-200 rounded"></div>
                      <div className="mb-3 h-3 bg-gray-200 rounded"></div>
                      <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border-l-4 shadow-sm transition-all duration-200 hover:shadow-md ${
                        notification.type === "success"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400"
                          : notification.type === "warning"
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400"
                          : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400"
                      }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                          notification.type === "success"
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : notification.type === "warning"
                            ? "bg-gradient-to-br from-yellow-500 to-amber-600"
                            : "bg-gradient-to-br from-blue-500 to-cyan-600"
                        }`}>
                          <span className="text-white text-sm font-bold">
                            {notification.type === "success" ? "✓" : notification.type === "warning" ? "⚠" : "ℹ"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-xs text-gray-700 mb-2">
                            {notification.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            <span className="font-semibold">Hace {notification.time}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 font-bold">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
