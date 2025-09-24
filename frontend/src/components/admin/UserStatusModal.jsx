import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UserStatusModal = ({ isOpen, onClose, onConfirm, user, isUpdating }) => {
  if (!isOpen || !user) return null;

  const isActivating = user.estado === 'inactivo';
  const newStatus = isActivating ? 'activo' : 'inactivo';
  const actionText = isActivating ? 'activar' : 'desactivar';
  const actionTextCapitalized = isActivating ? 'Activar' : 'Desactivar';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {isActivating ? (
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {actionTextCapitalized} Usuario
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUpdating}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-3">
              ¿Estás seguro de que deseas {actionText} al usuario?
            </p>
            <div className={`border rounded-lg p-3 ${isActivating ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-medium ${isActivating ? 'text-green-800' : 'text-red-800'}`}>
                {user.nombre}
              </p>
              <p className={`text-sm ${isActivating ? 'text-green-600' : 'text-red-600'}`}>
                {user.email}
              </p>
              <p className={`text-sm mt-1 ${isActivating ? 'text-green-600' : 'text-red-600'}`}>
                Estado actual: <span className="font-medium">{user.estado}</span>
              </p>
            </div>
          </div>
          
          <div className={`border rounded-lg p-3 mb-4 ${isActivating ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex">
              <ExclamationTriangleIcon className={`h-5 w-5 mr-2 flex-shrink-0 mt-0.5 ${isActivating ? 'text-blue-400' : 'text-yellow-400'}`} />
              <div>
                <h4 className={`text-sm font-medium ${isActivating ? 'text-blue-800' : 'text-yellow-800'}`}>
                  {isActivating ? 'Información' : 'Advertencia'}
                </h4>
                <p className={`text-sm mt-1 ${isActivating ? 'text-blue-700' : 'text-yellow-700'}`}>
                  {isActivating ? (
                    <>
                      Al activar este usuario:
                      <ul className="mt-2 list-disc list-inside">
                        <li>Podrá acceder a la plataforma</li>
                        <li>Recibirá notificaciones por email</li>
                        <li>Podrá participar en cursos</li>
                        <li>Tendrá acceso completo a sus funciones</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      Al desactivar este usuario:
                      <ul className="mt-2 list-disc list-inside">
                        <li>No podrá acceder a la plataforma</li>
                        <li>Se cerrará su sesión actual</li>
                        <li>No recibirá notificaciones</li>
                        <li>Sus datos se conservarán</li>
                      </ul>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            El estado del usuario cambiará a: <strong className={isActivating ? 'text-green-600' : 'text-red-600'}>{newStatus}</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
              isActivating 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            }`}
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                {isActivating ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <XCircleIcon className="h-4 w-4" />
                )}
                <span>{actionTextCapitalized} Usuario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusModal;