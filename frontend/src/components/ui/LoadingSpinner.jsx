import React from 'react';

/**
 * Componente de spinner de carga reutilizable
 * @param {object} props - Propiedades del componente
 * @param {string} props.size - Tamaño del spinner (sm, md, lg)
 * @param {string} props.color - Color del spinner
 * @param {string} props.text - Texto a mostrar
 * @param {boolean} props.fullScreen - Si debe ocupar toda la pantalla
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = 'Cargando...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <svg
          className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} mx-auto`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {text && (
          <p className={`mt-2 text-sm ${colorClasses[color]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
