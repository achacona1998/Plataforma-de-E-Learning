import React, { useState } from "react";
import { useCourseManagement } from "../../hooks/useCourseManagement";
import CourseViewModal from "../../components/admin/CourseViewModal";
import CourseDeleteModal from "../../components/admin/CourseDeleteModal";
import CourseStatusModal from "../../components/admin/CourseStatusModal";
import {
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "../../layout/AdminLayout";

const AdminCourses = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Usar hook personalizado para gestión de cursos
  const {
    courses,
    filteredCourses,
    loading,
    error,
    searchTerm,
    filterStatus,
    selectedCourse,
    deleting,
    setSearchTerm,
    setFilterStatus,
    deleteCourse,
    handleCreateCourse,
    handleEditCourse,
    selectCourse,
    clearSelection,
    refetch,
    updateCourseStatus,
  } = useCourseManagement();

  const handleDeleteCourse = (course) => {
    selectCourse(course);
    setShowDeleteModal(true);
  };

  const handleViewCourse = (course) => {
    selectCourse(course);
    setShowViewModal(true);
  };

  const handleChangeStatus = (course) => {
    selectCourse(course);
    setShowStatusModal(true);
  };

  const confirmChangeStatus = async (courseId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const result = await updateCourseStatus(courseId, newStatus);
      if (result.success) {
        setShowStatusModal(false);
        clearSelection();
        refetch();
      }
    } catch (error) {
      console.error('Error updating course status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const confirmDeleteCourse = async (courseId) => {
    const result = await deleteCourse(courseId);
    if (result.success) {
      setShowDeleteModal(false);
      clearSelection();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-32 h-32 rounded-full border-b-2 border-teal-600 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar los cursos
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => refetch()}
                    className="px-3 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md hover:bg-red-200">
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-blue-100">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <BookOpenIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  📚 Gestión de Cursos
                </h1>
                <p className="text-gray-600 text-lg mb-2">
                  Administra todos los cursos de la plataforma
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Última actualización: {new Date().toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => refetch()}
                className="flex items-center px-4 py-3 space-x-2 text-gray-600 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200">
                <ArrowPathIcon className="w-5 h-5" />
                <span className="font-semibold">Actualizar</span>
              </button>
              <button
                onClick={handleCreateCourse}
                className="flex items-center px-6 py-3 space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <PlusIcon className="w-5 h-5" />
                <span className="font-semibold">Crear Curso</span>
              </button>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="p-6 mb-8 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Buscar cursos por título o instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-6 py-4 w-full rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-6 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 text-gray-700 appearance-none cursor-pointer">
                  <option value="all">📋 Todos los estados</option>
                  <option value="publicado">✅ Publicados</option>
                  <option value="borrador">📝 Borradores</option>
                  <option value="archivado">📦 Archivados</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                    <BookOpenIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800">📚 Total Cursos</h3>
                </div>
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {courses.length}
                </p>
                <p className="text-sm text-blue-600">cursos disponibles</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                    <UserGroupIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800">👥 Estudiantes</h3>
                </div>
                <p className="text-3xl font-bold text-green-900 mb-1">
                  {courses.reduce(
                    (sum, course) => sum + (course.total_estudiantes || 0),
                    0
                  )}
                </p>
                <p className="text-sm text-green-600">estudiantes inscritos</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md">
                    <ClockIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-yellow-800">⚡ Activos</h3>
                </div>
                <p className="text-3xl font-bold text-yellow-900 mb-1">
                  {
                    courses.filter((course) => course.estado === "publicado")
                      .length
                  }
                </p>
                <p className="text-sm text-yellow-600">cursos publicados</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                    <AcademicCapIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-800">💰 Ingresos</h3>
                </div>
                <p className="text-3xl font-bold text-purple-900 mb-1">
                  $
                  {courses
                    .reduce(
                      (sum, course) =>
                        sum +
                        (course.precio || 0) * (course.total_estudiantes || 0),
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">ingresos totales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 flex items-center">
            📚 Cursos Disponibles ({filteredCourses.length})
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 group">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="object-cover w-full h-48 rounded-t-2xl"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-2 text-xs font-bold rounded-xl shadow-lg ${
                        course.estado === "publicado"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                          : course.estado === "archivado"
                          ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
                          : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800"
                      }`}>
                      {course.estado === "publicado" ? "✅ Publicado" : 
                       course.estado === "archivado" ? "📦 Archivado" : "📝 Borrador"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2 bg-gray-100 p-3 rounded-lg">
                    {course.description}
                  </p>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                      <UserGroupIcon className="mr-3 w-5 h-5 text-blue-600" />
                      <span className="font-semibold">Instructor: {course.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
                      <AcademicCapIcon className="mr-3 w-5 h-5 text-green-600" />
                      <span className="font-semibold">{course.students} estudiantes</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-purple-50 p-2 rounded-lg">
                      <ClockIcon className="mr-3 w-5 h-5 text-purple-600" />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-xl">
                      <span className="text-2xl font-bold text-blue-800">
                        ${course.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewCourse(course)}
                      className="p-3 text-blue-600 bg-blue-100 rounded-xl transition-all duration-200 hover:bg-blue-200 hover:scale-110 shadow-sm"
                      title="Ver curso">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleChangeStatus(course)}
                      className="p-3 text-purple-600 bg-purple-100 rounded-xl transition-all duration-200 hover:bg-purple-200 hover:scale-110 shadow-sm"
                      title="Cambiar estado">
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditCourse(course.id)}
                      className="p-3 text-green-600 bg-green-100 rounded-xl transition-all duration-200 hover:bg-green-200 hover:scale-110 shadow-sm"
                      title="Editar curso">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course)}
                      className="p-3 text-red-600 bg-red-100 rounded-xl transition-all duration-200 hover:bg-red-200 hover:scale-110 shadow-sm"
                      title="Eliminar curso">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-12 shadow-lg border border-blue-200">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                📚 No se encontraron cursos
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No hay cursos que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda o crear un nuevo curso.
              </p>
              <button
                onClick={() => window.location.href = '/admin/courses/create'}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                ➕ Crear Primer Curso
              </button>
            </div>
          </div>
        )}

        {/* Modal de Ver Curso */}
        <CourseViewModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            clearSelection();
          }}
          course={selectedCourse}
          onEdit={handleEditCourse}
        />

        {/* Modal de Confirmación de Eliminación */}
        <CourseDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            clearSelection();
          }}
          onConfirm={confirmDeleteCourse}
          course={selectedCourse}
          isDeleting={deleting}
        />

        {/* Modal de Cambio de Estado */}
        <CourseStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            clearSelection();
          }}
          onConfirm={confirmChangeStatus}
          course={selectedCourse}
          isUpdating={updatingStatus}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
