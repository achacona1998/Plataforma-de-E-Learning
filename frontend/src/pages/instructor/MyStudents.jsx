import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InstructorLayout from '../../layout/InstructorLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import StatCard from '../../components/ui/StatCard';
import { useApi } from '../../hooks/useApi';
import { API_ROUTES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const MyStudents = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Usar hooks personalizados para obtener datos
  const { data: coursesData, loading: coursesLoading } = useApi(
    `${API_ROUTES.COURSES}/instructor/${user?.id}`,
    []
  );
  
  const { data: studentsData, loading: studentsLoading } = useApi(
    `${API_ROUTES.ENROLLMENTS}/instructor/${user?.id}`,
    []
  );
  
  const courses = coursesData || [];
  const loading = coursesLoading || studentsLoading;

  // Procesar datos de estudiantes y calcular estadísticas
  const { students, stats } = useMemo(() => {
    if (!studentsData || studentsData.length === 0) {
      // Datos mock si no hay datos de la API
      const mockStudents = [
        {
          id: 1,
          nombre: 'Ana García',
          email: 'ana@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=0d9488&color=fff',
          curso: 'Introducción a React',
          cursoId: 1,
          progreso: 75,
          fechaInscripcion: '2024-01-15',
          ultimaActividad: '2024-01-20',
          estado: 'activo',
          completado: false
        },
        {
          id: 2,
          nombre: 'Carlos López',
          email: 'carlos@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=0d9488&color=fff',
          curso: 'JavaScript Avanzado',
          cursoId: 2,
          progreso: 100,
          fechaInscripcion: '2024-01-10',
          ultimaActividad: '2024-01-18',
          estado: 'completado',
          completado: true
        },
        {
          id: 3,
          nombre: 'María Rodríguez',
          email: 'maria@email.com',
          avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=0d9488&color=fff',
          curso: 'Introducción a React',
          cursoId: 1,
          progreso: 45,
          fechaInscripcion: '2024-01-12',
          ultimaActividad: '2024-01-19',
          estado: 'activo',
          completado: false
        }
      ];
      
      return {
        students: mockStudents,
        stats: {
          totalStudents: 3,
          activeStudents: 2,
          completedCourses: 1,
          averageProgress: 73
        }
      };
    }

    // Procesar datos reales de estudiantes
    const processedStudents = studentsData.map(enrollment => ({
      id: enrollment.usuario_id,
      nombre: enrollment.usuario?.nombre || 'Usuario',
      email: enrollment.usuario?.email || 'No disponible',
      avatar: enrollment.usuario?.avatar || `https://ui-avatars.com/api/?name=${enrollment.usuario?.nombre}&background=0d9488&color=fff`,
      curso: enrollment.curso?.titulo || 'Curso no disponible',
      cursoId: enrollment.curso_id,
      progreso: enrollment.progreso || 0,
      fechaInscripcion: enrollment.fecha_inscripcion,
      ultimaActividad: enrollment.ultima_actividad || enrollment.fecha_inscripcion,
      estado: enrollment.estado || 'activo',
      completado: enrollment.progreso >= 100
    }));
    
    // Calcular estadísticas
    const totalStudents = processedStudents.length;
    const activeStudents = processedStudents.filter(s => s.estado === 'activo').length;
    const completedCourses = processedStudents.filter(s => s.completado).length;
    const averageProgress = totalStudents > 0 
      ? processedStudents.reduce((sum, s) => sum + s.progreso, 0) / totalStudents 
      : 0;
    
    return {
      students: processedStudents,
      stats: {
        totalStudents,
        activeStudents,
        completedCourses,
        averageProgress: Math.round(averageProgress)
      }
    };
  }, [studentsData]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.curso.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = selectedCourse === 'all' || student.cursoId.toString() === selectedCourse;
    
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'completed' && student.completado) ||
                         (selectedStatus === 'active' && !student.completado && student.estado === 'activo') ||
                         (selectedStatus === 'inactive' && student.estado === 'inactivo');
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (student) => {
    if (student.completado) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    if (student.estado === 'activo') {
      return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
    return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sendMessage = (studentEmail) => {
    // This would open email client or messaging system
    window.location.href = `mailto:${studentEmail}`;
  };

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSpinner message="Cargando estudiantes..." />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <UserGroupIcon className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Estudiantes</h1>
                <p className="text-gray-600">Gestiona y monitorea el progreso de tus estudiantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Estudiantes"
            value={stats.totalStudents}
            icon={UserGroupIcon}
            color="blue"
          />
          
          <StatCard
            title="Estudiantes Activos"
            value={stats.activeStudents}
            icon={ClockIcon}
            color="green"
          />
          
          <StatCard
            title="Cursos Completados"
            value={stats.completedCourses}
            icon={AcademicCapIcon}
            color="purple"
          />
          
          <StatCard
            title="Progreso Promedio"
            value={`${stats.averageProgress}%`}
            icon={ChartBarIcon}
            color="teal"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar estudiantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Todos los cursos</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.titulo}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="completed">Completados</option>
              <option value="inactive">Inactivos</option>
            </select>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <FunnelIcon className="h-5 w-5" />
              <span className="text-sm">{filteredStudents.length} estudiantes</span>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={`${student.id}-${student.cursoId}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.avatar}
                          alt={student.nombre}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.nombre}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.curso}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(student.progreso)}`}
                            style={{ width: `${student.progreso}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 min-w-0">{student.progreso}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(student)}
                        <span className={`text-sm ${
                          student.completado ? 'text-green-600' :
                          student.estado === 'activo' ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {student.completado ? 'Completado' :
                           student.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.fechaInscripcion)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.ultimaActividad)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => sendMessage(student.email)}
                          className="text-teal-600 hover:text-teal-900 p-1 rounded"
                          title="Enviar mensaje"
                        >
                          <EnvelopeIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudiantes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCourse !== 'all' || selectedStatus !== 'all'
                  ? 'No se encontraron estudiantes con los filtros aplicados.'
                  : 'Aún no tienes estudiantes inscritos en tus cursos.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </InstructorLayout>
  );
};

export default MyStudents;
