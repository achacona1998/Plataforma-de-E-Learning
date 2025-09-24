import { useState, useMemo, useRef } from 'react';

/**
 * Hook personalizado para manejar búsqueda y filtrado de datos
 * @param {Array} data - Array de datos para filtrar
 * @param {Array} searchFields - Campos en los que buscar
 * @param {object} initialFilters - Filtros iniciales
 * @returns {object} - Datos filtrados y funciones de control
 */
export const useSearch = (data = [], searchFields = [], initialFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const initialFiltersRef = useRef(initialFilters);
  const [filters, setFilters] = useState(initialFiltersRef.current);

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    let filtered = [...data];

    // Aplicar búsqueda por término
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      });
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        filtered = filtered.filter(item => {
          const itemValue = getNestedValue(item, key);
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    return filtered;
  }, [data, searchTerm, filters, JSON.stringify(searchFields)]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(initialFiltersRef.current);
  };

  const getFilterCount = () => {
    let count = 0;
    if (searchTerm.trim()) count++;
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') count++;
    });
    return count;
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredData,
    filterCount: getFilterCount()
  };
};

/**
 * Obtiene un valor anidado de un objeto usando notación de punto
 * @param {object} obj - Objeto del cual obtener el valor
 * @param {string} path - Ruta del valor (ej: 'user.name')
 * @returns {any} - Valor encontrado o undefined
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Hook para manejar paginación
 * @param {Array} data - Datos a paginar
 * @param {number} itemsPerPage - Elementos por página
 * @returns {object} - Datos paginados y controles
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Reset page when data changes
  useState(() => {
    setCurrentPage(1);
  }, [data.length]);

  return {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: data.length,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};