import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import {
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  CalendarIcon,
  BookOpenIcon,
  FireIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [currentCourse, setCurrentCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  // Estados para la racha de aprendizaje
  const [learningStreak, setLearningStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    studyDates: [],
    level: 'Principiante',
    stars: 0
  });

  // Estados para estadísticas dinámicas
  const [studentStats, setStudentStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    studyHours: 0,
    certificates: 0,
    monthlyIncrease: 0,
    weeklyHours: 0,
    completionPercentage: 0
  });

  // Usar useApi para obtener datos
  const { data: progressData, loading: progressLoading } = useApi('/api/usuarios/progreso');
  const { data: coursesData, loading: coursesLoading } = useApi('/api/inscripciones');
  const { data: certificatesData, loading: certificatesLoading } = useApi('/api/certificados');
  const { data: allProgressData, loading: allProgressLoading } = useApi('/api/progresos');

  const loading = progressLoading || coursesLoading || certificatesLoading || allProgressLoading;

  // Función para calcular la racha de aprendizaje
  const calculateLearningStreak = (studyDates) => {
    if (!studyDates || studyDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Ordenar fechas de más reciente a más antigua
    const sortedDates = studyDates.sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Verificar si estudió hoy o ayer para mantener la racha
    const lastStudyDate = new Date(sortedDates[0]);
    const daysDifference = Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 1) {
      currentStreak = 1;
      
      // Calcular racha actual
      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const previousDate = new Date(sortedDates[i - 1]);
        const diff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calcular racha más larga
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const previousDate = new Date(sortedDates[i - 1]);
      const diff = Math.floor((previousDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { currentStreak, longestStreak };
  };

  // Función para determinar el nivel basado en la racha
  const determineStudentLevel = (streak) => {
    if (streak >= 30) return { level: 'Maestro del Aprendizaje', stars: 5 };
    if (streak >= 21) return { level: 'Estudiante Experto', stars: 5 };
    if (streak >= 14) return { level: 'Estudiante Avanzado', stars: 4 };
    if (streak >= 7) return { level: 'Estudiante Dedicado', stars: 3 };
    if (streak >= 3) return { level: 'Estudiante Comprometido', stars: 2 };
    if (streak >= 1) return { level: 'Estudiante Activo', stars: 1 };
    return { level: 'Principiante', stars: 0 };
  };

  // Función para generar fechas de estudio simuladas (esto se reemplazaría con datos reales de la API)
  const generateStudyDates = () => {
    const dates = [];
    const today = new Date();
    
    // Simular estudio en los últimos 5 días
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  // Función para calcular estadísticas reales
  const calculateStudentStats = () => {
    let stats = {
      enrolledCourses: 0,
      completedCourses: 0,
      studyHours: 0,
      certificates: 0,
      monthlyIncrease: 0,
      weeklyHours: 0,
      completionPercentage: 0
    };

    // Calcular cursos inscritos
    if (coursesData?.data) {
      stats.enrolledCourses = coursesData.data.length;
    }

    // Calcular cursos completados
    if (allProgressData?.data) {
      const completedCourses = allProgressData.data.filter(progress => 
        progress.porcentaje_completado >= 100
      );
      stats.completedCourses = completedCourses.length;
    }

    // Calcular porcentaje de finalización
    if (stats.enrolledCourses > 0) {
      stats.completionPercentage = Math.round((stats.completedCourses / stats.enrolledCourses) * 100);
    }

    // Calcular certificados
    if (certificatesData?.data) {
      stats.certificates = certificatesData.data.length;
    }

    // Calcular horas de estudio (simulado basado en progreso)
    if (allProgressData?.data) {
      const totalProgress = allProgressData.data.reduce((sum, progress) => 
        sum + (progress.porcentaje_completado || 0), 0
      );
      // Estimación: cada 10% de progreso = 2 horas de estudio
      stats.studyHours = Math.round((totalProgress / 10) * 2);
      
      // Simular horas de esta semana (20% del total)
      stats.weeklyHours = Math.round(stats.studyHours * 0.2);
    }

    // Simular incremento mensual
    if (stats.enrolledCourses > 0) {
      stats.monthlyIncrease = Math.max(1, Math.round(stats.enrolledCourses * 0.3));
    }

    return stats;
  };

  useEffect(() => {
    if (!loading && progressData && coursesData) {
      processStudentData();
    }
  }, [progressData, coursesData]);

  useEffect(() => {
    if (!loading && coursesData && allProgressData && certificatesData) {
      const calculatedStats = calculateStudentStats();
      setStudentStats(calculatedStats);
    }
  }, [coursesData, allProgressData, certificatesData, loading]);

  useEffect(() => {
    // Calcular racha de aprendizaje
    const studyDates = generateStudyDates(); // En producción, esto vendría de la API
    const { currentStreak, longestStreak } = calculateLearningStreak(studyDates);
    const { level, stars } = determineStudentLevel(currentStreak);
    
    setLearningStreak({
      currentStreak,
      longestStreak,
      lastStudyDate: studyDates[0],
      studyDates,
      level,
      stars
    });
  }, []);

  const processStudentData = () => {
    // Process current course data
    if (coursesData.data && coursesData.data.length > 0) {
      const currentCourseData = {
        id: coursesData.data[0].curso_id._id,
        title: coursesData.data[0].curso_id.titulo,
        instructor: coursesData.data[0].curso_id.instructor_id?.nombre || 'Instructor',
        modules: 24,
        duration: '48 horas',
        progress: Math.round((progressData.overallProgress || 0)),
        currentModule: 'Módulo actual en progreso'
      };
      setCurrentCourse(currentCourseData);
    }

    // Set course progress from API data
    const progressModules = [
      {
        id: 1,
        title: 'Módulo 1: Introducción',
        status: 'completed',
        lessons: [
          { id: 1, title: '1.1 Bienvenida al curso', completed: true },
          { id: 2, title: '1.2 Configuración del entorno', completed: true },
          { id: 3, title: '1.3 Conceptos básicos', completed: true }
        ]
      },
      {
        id: 2,
        title: 'Módulo 2: Fundamentos',
        status: 'completed',
        lessons: [
          { id: 4, title: '2.1 Conceptos básicos', completed: true },
          { id: 5, title: '2.2 Práctica inicial', completed: true },
          { id: 6, title: '2.3 Ejercicios', completed: true }
        ]
      },
      {
        id: 3,
        title: 'Módulo 3: Avanzado',
        status: 'in_progress',
        lessons: [
          { id: 7, title: '3.1 Conceptos avanzados', completed: true },
          { id: 8, title: '3.2 Práctica avanzada', completed: false },
          { id: 9, title: '3.3 Proyecto final', completed: false }
        ]
      }
    ];
    setCourseProgress(progressModules);

    // Set upcoming events
    const events = [
      {
        id: 1,
        type: 'project',
        title: 'Entrega Proyecto Parcial',
        date: '24 de octubre, 2023',
        status: 'pending'
      },
      {
        id: 2,
        type: 'quiz',
        title: 'Quiz del módulo',
        date: '26 de octubre, 2023',
        status: 'pending'
      }
    ];
    setUpcomingEvents(events);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <PlayIcon className="w-5 h-5 text-emerald-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'project':
        return <DocumentTextIcon className="w-5 h-5 text-emerald-500" />;
      case 'quiz':
        return <AcademicCapIcon className="w-5 h-5 text-green-500" />;
      case 'live':
        return <VideoCameraIcon className="w-5 h-5 text-red-500" />;
      case 'exam':
        return <BookOpenIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <CalendarIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, emoji }) => (
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
          <p className="text-white/70 text-xs">{subtitle}</p>
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
          <div className="mt-6 text-emerald-600 font-bold text-lg">🎓 Cargando tu dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        {/* Dashboard Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              ¡Bienvenido de vuelta, {user?.nombre || 'Usuario'}! 🎉
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            ✨ Aquí tienes un resumen de tu progreso académico y nuevas oportunidades de aprendizaje
          </p>
        </div>

        {/* Achievement Banner - Dinámico */}
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FireIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {learningStreak.currentStreak > 0 ? '🔥 ¡Racha de Aprendizaje!' : '💪 ¡Comienza tu racha!'}
                </h3>
                <p className="text-white/90">
                  {learningStreak.currentStreak > 0 
                    ? `Has estudiado ${learningStreak.currentStreak} día${learningStreak.currentStreak > 1 ? 's' : ''} consecutivo${learningStreak.currentStreak > 1 ? 's' : ''}. ¡Sigue así!`
                    : '¡Empieza a estudiar hoy para comenzar tu racha de aprendizaje!'
                  }
                </p>
                {learningStreak.longestStreak > learningStreak.currentStreak && (
                  <p className="text-white/70 text-sm mt-1">
                    🏆 Tu mejor racha: {learningStreak.longestStreak} días
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(Math.max(1, learningStreak.stars))].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`w-5 h-5 ${i < learningStreak.stars ? 'text-yellow-300 fill-current' : 'text-white/30'}`} 
                  />
                ))}
              </div>
              <p className="text-sm text-white/80">Nivel: {learningStreak.level}</p>
              {learningStreak.currentStreak > 0 && (
                <p className="text-xs text-white/60 mt-1">
                  Último estudio: {new Date(learningStreak.lastStudyDate).toLocaleDateString('es-ES')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards - Dinámicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpenIcon}
            title="Cursos Inscritos"
            value={studentStats.enrolledCourses.toString()}
            subtitle={studentStats.monthlyIncrease > 0 ? `+${studentStats.monthlyIncrease} este mes` : 'Sin cambios este mes'}
            emoji="📚"
            gradient="from-emerald-500 to-green-600"
          />
          <StatCard
            icon={CheckCircleIcon}
            title="Cursos Completados"
            value={studentStats.completedCourses.toString()}
            subtitle={studentStats.completionPercentage > 0 ? `${studentStats.completionPercentage}% de tus cursos` : 'Aún no has completado cursos'}
            emoji="✅"
            gradient="from-green-500 to-teal-600"
          />
          <StatCard
            icon={ClockIcon}
            title="Horas de Estudio"
            value={studentStats.studyHours.toString()}
            subtitle={studentStats.weeklyHours > 0 ? `+${studentStats.weeklyHours} esta semana` : 'Comienza a estudiar'}
            emoji="⏰"
            gradient="from-teal-500 to-cyan-600"
          />
          <StatCard
            icon={TrophyIcon}
            title="Certificados"
            value={studentStats.certificates.toString()}
            subtitle={studentStats.certificates > 0 ? 'Disponible para descarga' : 'Completa cursos para obtener'}
            emoji="🏆"
            gradient="from-yellow-500 to-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Current Course */}
            <div className="bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                        <BookOpenIcon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        📖 Curso Actual: {currentCourse?.title || 'No hay curso activo'}
                      </h2>
                    </div>
                    <p className="text-gray-600 font-medium">
                      {currentCourse ? `👨‍🏫 Por ${currentCourse.instructor} • 📚 ${currentCourse.modules} módulos • ⏱️ ${currentCourse.duration}` : '🎯 Inscríbete en un curso para comenzar tu aprendizaje'}
                    </p>
                  </div>
                  {currentCourse && (
                    <div className="flex space-x-3">
                      <button className="px-6 py-3 text-white bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold">
                        🚀 Continuar
                      </button>
                      <button className="px-6 py-3 text-emerald-600 border-2 border-emerald-500 rounded-xl hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 font-bold">
                        📋 Ver Detalles
                      </button>
                    </div>
                  )}
                </div>

                {currentCourse && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-gray-700">📊 Progreso del curso</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-full">
                        {currentCourse.progress}%
                      </span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full transition-all duration-500 shadow-lg" 
                        style={{ width: `${currentCourse.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Module */}
                <div className="p-4 mb-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="mb-1 font-bold text-gray-900">
                        🎯 {currentCourse?.currentModule}
                      </h3>
                      <p className="text-sm text-emerald-700 font-medium">📈 Continúa donde lo dejaste</p>
                    </div>
                    <PlayIcon className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                {/* Course Progress Modules */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5 text-emerald-600" />
                    <span>📚 Progreso por Módulos</span>
                  </h3>
                  {courseProgress.map((module) => (
                    <div key={module.id} className="p-4 bg-gradient-to-r from-white to-emerald-50 rounded-xl border border-emerald-100 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(module.status)}
                          <h4 className="font-bold text-gray-900">{module.title}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          module.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : module.status === 'in_progress'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {module.status === 'completed' ? '✅ Completado' : 
                           module.status === 'in_progress' ? '🔄 En Progreso' : '⏳ Pendiente'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center space-x-2 text-sm">
                            {lesson.completed ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                            )}
                            <span className={lesson.completed ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl shadow-xl border border-green-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">📅 Próximos Eventos</h3>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gradient-to-r from-white to-green-50 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600 font-medium">📅 {event.date}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                          ⏰ Pendiente
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <TrophyIcon className="w-6 h-6 text-emerald-600" />
                <span>🚀 Acciones Rápidas</span>
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold">
                  📚 Explorar Cursos
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold">
                  📊 Ver Progreso
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold">
                  🏆 Mis Certificados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentDashboard;
