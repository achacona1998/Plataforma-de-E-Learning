import React from 'react';
import { ExclamationTriangleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Componente para mostrar mensajes de error reutilizable
 * @param {object} props - Propiedades del componente
 * @param {string} props.message - Mensaje de error
 * @param {string} props.type - Tipo de mensaje (error, warning, info)
 * @param {Function} props.onClose - Función para cerrar el mensaje
 * @param {boolean} props.dismissible - Si se puede cerrar
 * @returns {JSX.Element}
 */
const ErrorMessage = ({ 
  message, 
  type = 'error', 
  onClose, 
  dismissible = false 
}) => {
  if (!message) return null;

  const typeConfig = {
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      icon: XCircleIcon,
      iconColor: 'text-red-400'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-400'
    },
    info: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-400'
    }
  };

  const config = typeConfig[type] || typeConfig.error;
  const Icon = config.icon;

  return (
    <div className={`rounded-md ${config.bgColor} ${config.borderColor} border p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${config.textColor}`}>
            {message}
          </p>
        </div>
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md ${config.bgColor} p-1.5 ${config.textColor} hover:${config.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${config.bgColor} focus:ring-${config.textColor}`}
                onClick={onClose}
              >
                <span className="sr-only">Cerrar</span>
                <XCircleIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
