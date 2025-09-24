import React from 'react';
import {
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

/**
 * Modal para visualizar los detalles de un curso
 * @param {object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {object} props.course - Datos del curso a mostrar
 * @param {function} props.onEdit - Función para editar el curso
 */
const CourseViewModal = ({ isOpen, onClose, course, onEdit }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Curso</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                course.status === 'activo' ? 'bg-green-100 text-green-800' :
                course.status === 'inactivo' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {course.status}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>Instructor: {course.instructor}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>{course.students} estudiantes</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>Duración: {course.duration}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="text-lg font-bold text-teal-600">${course.price}</span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(course.id);
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Editar Curso
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewModal;