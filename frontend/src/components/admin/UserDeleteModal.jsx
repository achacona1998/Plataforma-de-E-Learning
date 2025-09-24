import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UserDeleteModal = ({ isOpen, onClose, onConfirm, user, isDeleting }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Confirmar Eliminación
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              ¿Estás seguro de que deseas eliminar al usuario?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="font-medium text-red-800">
                {user.nombre}
              </p>
              <p className="text-sm text-red-600">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Advertencia
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al usuario, incluyendo:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>Información personal</li>
                  <li>Historial de cursos</li>
                  <li>Progreso de aprendizaje</li>
                  <li>Certificaciones obtenidas</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Para confirmar la eliminación, escribe <strong>ELIMINAR</strong> en el campo de abajo:
          </p>
          
          <input
            type="text"
            placeholder="Escribe ELIMINAR para confirmar"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            id="confirmDelete"
            disabled={isDeleting}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const confirmInput = document.getElementById('confirmDelete');
              if (confirmInput.value === 'ELIMINAR') {
                onConfirm();
              } else {
                alert('Debes escribir "ELIMINAR" para confirmar la eliminación');
              }
            }}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span>Eliminar Usuario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;