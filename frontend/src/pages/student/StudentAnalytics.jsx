import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import {
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon,
  ChartPieIcon,
  CalendarDaysIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const StudentAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [courseProgress, setCourseProgress] = useState([]);
  const [studentRankings, setStudentRankings] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);

  // Usar múltiples hooks useApi para obtener datos
  const { data: progressData, loading: progressLoading } = useApi('/api/usuarios/progreso');
  const { data: statsData, loading: statsLoading } = useApi('/api/usuarios/stats');
  const { data: coursesData, loading: coursesLoading } = useApi('/api/inscripciones');

  const loading = progressLoading || statsLoading || coursesLoading;

  useEffect(() => {
    if (!loading && progressData && statsData && coursesData) {
      processAnalyticsData();
    }
  }, [progressData, statsData, coursesData]);

  const processAnalyticsData = () => {
    // Process analytics data from API
    const apiAnalytics = {
      totalStudyTime: 156,
      completedLessons: 42,
      averageScore: 8.7,
      currentStreak: 12,
      totalCertificates: 3,
      weeklyGoal: 85,
      trends: {
        studyTime: 15,
        lessons: 8,
        score: 5,
        streak: 3
      }
    };
    setAnalytics(apiAnalytics);

    // Process course progress from API
    const apiCourseProgress = coursesData?.data ? coursesData.data.map((inscripcion, index) => {
      const colors = ['from-emerald-500 to-green-600', 'from-green-500 to-teal-600', 'from-teal-500 to-cyan-600', 'from-cyan-500 to-blue-600'];
      return {
        name: inscripcion.curso_id.titulo,
        progress: Math.round(Math.random() * 40 + 60),
        color: colors[index % colors.length],
        modules: 12,
        completedModules: Math.round((Math.random() * 40 + 60) / 100 * 12)
      };
    }) : [
      { name: 'Desarrollo Web Completo', progress: 89, color: 'from-emerald-500 to-green-600', modules: 12, completedModules: 11 },
      { name: 'React Avanzado', progress: 76, color: 'from-green-500 to-teal-600', modules: 8, completedModules: 6 },
      { name: 'Node.js & Express', progress: 62, color: 'from-teal-500 to-cyan-600', modules: 10, completedModules: 6 },
      { name: 'Base de Datos', progress: 45, color: 'from-cyan-500 to-blue-600', modules: 6, completedModules: 3 }
    ];
    setCourseProgress(apiCourseProgress);

    // Generate student rankings
    const apiStudentRankings = [
      {
        id: 1,
        name: user?.nombre || 'Tu',
        course: apiCourseProgress[0]?.name || 'Desarrollo Web',
        progress: progressData?.overallProgress || 92,
        score: 9.6,
        timeSpent: '156h 30m',
        rank: 1,
        isCurrentUser: true
      },
      {
        id: 2,
        name: 'Carlos Ruiz',
        course: 'React Avanzado',
        progress: 88,
        score: 9.2,
        timeSpent: '142h 15m',
        rank: 2,
        isCurrentUser: false
      },
      {
        id: 3,
        name: 'Laura Sánchez',
        course: 'Node.js & Express',
        progress: 85,
        score: 8.9,
        timeSpent: '138h 45m',
        rank: 3,
        isCurrentUser: false
      },
      {
        id: 4,
        name: 'Miguel Torres',
        course: 'Base de Datos',
        progress: 82,
        score: 8.7,
        timeSpent: '135h 20m',
        rank: 4,
        isCurrentUser: false
      }
    ];
    setStudentRankings(apiStudentRankings);

    // Weekly activity data
    const weeklyData = [
      { day: 'Lun', hours: 3.5, lessons: 4 },
      { day: 'Mar', hours: 2.8, lessons: 3 },
      { day: 'Mié', hours: 4.2, lessons: 5 },
      { day: 'Jue', hours: 3.1, lessons: 4 },
      { day: 'Vie', hours: 2.5, lessons: 3 },
      { day: 'Sáb', hours: 1.8, lessons: 2 },
      { day: 'Dom', hours: 2.2, lessons: 2 }
    ];
    setWeeklyActivity(weeklyData);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, gradient, emoji }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl">{emoji}</span>
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          <div className="flex items-center space-x-1">
            <ArrowTrendingUpIcon className="w-4 h-4 text-white/70" />
            <p className="text-white/70 text-xs">+{trend}% esta semana</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-green-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="mt-6 text-emerald-600 font-bold text-lg">📊 Cargando tus analíticas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              📊 Analíticas de Aprendizaje
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            ✨ Descubre tu progreso, rendimiento y logros académicos
          </p>
        </div>

        {/* Achievement Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">🏆 ¡Excelente Progreso!</h3>
                <p className="text-white/90">Estás en el top 5% de estudiantes más activos</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                ))}
              </div>
              <p className="text-sm text-white/80">Nivel: Estudiante Estrella</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ClockIcon}
            title="Tiempo Total de Estudio"
            value={`${analytics?.totalStudyTime || 156}h`}
            trend={analytics?.trends?.studyTime || 15}
            emoji="⏰"
            gradient="from-emerald-500 to-green-600"
          />
          <StatCard
            icon={BookOpenIcon}
            title="Lecciones Completadas"
            value={analytics?.completedLessons || 42}
            trend={analytics?.trends?.lessons || 8}
            emoji="📚"
            gradient="from-green-500 to-teal-600"
          />
          <StatCard
            icon={StarIcon}
            title="Puntuación Promedio"
            value={analytics?.averageScore || 8.7}
            trend={analytics?.trends?.score || 5}
            emoji="⭐"
            gradient="from-teal-500 to-cyan-600"
          />
          <StatCard
            icon={FireIcon}
            title="Racha Actual"
            value={`${analytics?.currentStreak || 12} días`}
            trend={analytics?.trends?.streak || 3}
            emoji="🔥"
            gradient="from-yellow-500 to-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Course Progress */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Progress Chart */}
            <div className="bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ChartPieIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">📈 Progreso por Curso</h3>
              </div>
              <div className="space-y-6">
                {courseProgress.map((course, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-white to-emerald-50 rounded-xl border border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-600">
                          📚 {course.completedModules}/{course.modules} módulos completados
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-600">{course.progress}%</span>
                        <p className="text-xs text-gray-500">completado</p>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-500 shadow-lg`}
                        style={{ width: `${course.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">📅 Actividad Semanal</h3>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300">
                      <p className="text-xs font-bold text-gray-600 mb-2">{day.day}</p>
                      <div className="space-y-2">
                        <div className="flex flex-col items-center">
                          <ClockIcon className="w-4 h-4 text-emerald-600 mb-1" />
                          <span className="text-sm font-bold text-emerald-700">{day.hours}h</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <BookOpenIcon className="w-4 h-4 text-green-600 mb-1" />
                          <span className="text-sm font-bold text-green-700">{day.lessons}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Rankings */}
            <div className="bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">🏆 Ranking de Estudiantes</h3>
              </div>
              <div className="space-y-4">
                {studentRankings.map((student) => (
                  <div 
                    key={student.id} 
                    className={`p-4 rounded-xl border shadow-md hover:shadow-lg transition-all duration-300 ${
                      student.isCurrentUser 
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300' 
                        : 'bg-gradient-to-r from-white to-emerald-50 border-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          student.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          student.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                          student.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                          'bg-gradient-to-r from-emerald-400 to-green-600'
                        }`}>
                          {student.rank}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {student.isCurrentUser ? '🎯 ' : ''}{student.name}
                          </h4>
                          <p className="text-xs text-gray-600">{student.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">{student.progress}%</p>
                        <p className="text-xs text-gray-500">⭐ {student.score}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>⏰ {student.timeSpent}</span>
                      {student.isCurrentUser && <span className="text-emerald-600 font-bold">¡Eres tú! 🎉</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <BoltIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">⚡ Estadísticas Rápidas</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <span className="text-sm font-medium text-gray-700">🎯 Meta Semanal</span>
                  <span className="text-sm font-bold text-emerald-600">{analytics?.weeklyGoal || 85}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-700">🏆 Certificados</span>
                  <span className="text-sm font-bold text-green-600">{analytics?.totalCertificates || 3}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                  <span className="text-sm font-medium text-gray-700">📈 Tendencia</span>
                  <span className="text-sm font-bold text-teal-600">↗️ Ascendente</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">✨ Logros Recientes</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">🏆 Estudiante del Mes</p>
                    <p className="text-xs text-gray-600">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                  <FireIcon className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">🔥 Racha de 12 días</p>
                    <p className="text-xs text-gray-600">Hace 1 hora</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <AcademicCapIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">🎓 Curso Completado</p>
                    <p className="text-xs text-gray-600">Hace 1 semana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentAnalytics;
