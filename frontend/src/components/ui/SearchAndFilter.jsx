import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Componente reutilizable para búsqueda y filtrado
 * @param {object} props - Propiedades del componente
 * @param {string} props.searchTerm - Término de búsqueda actual
 * @param {Function} props.onSearchChange - Función para cambiar el término de búsqueda
 * @param {string} props.searchPlaceholder - Placeholder del campo de búsqueda
 * @param {Array} props.filters - Array de filtros disponibles
 * @param {object} props.activeFilters - Filtros activos
 * @param {Function} props.onFilterChange - Función para cambiar filtros
 * @param {Function} props.onClearFilters - Función para limpiar filtros
 * @param {number} props.filterCount - Número de filtros activos
 * @returns {JSX.Element}
 */
const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  filterCount = 0
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder={searchPlaceholder}
            />
          </div>
        </div>

        {/* Filtros */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <div key={filter.key} className="min-w-0">
                <select
                  value={activeFilters[filter.key] || 'all'}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{filter.placeholder || `Todos ${filter.label}`}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Botón para limpiar filtros */}
        {filterCount > 0 && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Limpiar ({filterCount})
          </button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {filterCount > 0 && (
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <FunnelIcon className="h-4 w-4 mr-1" />
          {filterCount} filtro{filterCount !== 1 ? 's' : ''} activo{filterCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
