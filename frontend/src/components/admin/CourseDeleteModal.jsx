import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Modal para confirmar la eliminación de un curso
 * @param {object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {function} props.onConfirm - Función para confirmar la eliminación
 * @param {object} props.course - Datos del curso a eliminar
 * @param {boolean} props.isDeleting - Si se está procesando la eliminación
 */
const CourseDeleteModal = ({ isOpen, onClose, onConfirm, course, isDeleting }) => {
  if (!isOpen || !course) return null;

  const handleConfirm = () => {
    onConfirm(course.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Confirmar eliminación
            </h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            ¿Estás seguro de que quieres eliminar el curso 
            <span className="font-semibold text-gray-900">"{course.title}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción no se puede deshacer y se eliminarán todos los datos asociados al curso.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDeleteModal;