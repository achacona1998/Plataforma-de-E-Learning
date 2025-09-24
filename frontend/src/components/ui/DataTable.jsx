import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const DataTable = ({
  columns,
  data,
  onSort,
  sortConfig,
  onRowClick,
  actions,
  emptyMessage = 'No hay datos disponibles',
  emptyIcon: EmptyIcon,
  className = ''
}) => {
  const handleSort = (key) => {
    if (onSort) {
      const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key, direction });
    }
  };

  const getSortIcon = (columnKey) => {
    if (!onSort || sortConfig?.key !== columnKey) return null;
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1" />
    );
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    
    const value = item[column.key];
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'currency' && value !== undefined) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }
    
    if (column.type === 'number' && value !== undefined) {
      return value.toLocaleString();
    }
    
    if (column.type === 'badge' && value) {
      const badgeConfig = column.badgeConfig?.[value] || { 
        className: 'bg-gray-100 text-gray-800', 
        label: value 
      };
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badgeConfig.className}`}>
          {badgeConfig.label}
        </span>
      );
    }
    
    return value || '-';
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          {EmptyIcon && <EmptyIcon className="mx-auto h-12 w-12 text-gray-400" />}
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sin resultados</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    onSort && column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.key === 'avatar' ? (
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={item.avatar}
                          alt={item.name || 'Avatar'}
                        />
                        {item.name && (
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            {item.email && (
                              <div className="text-sm text-gray-500">{item.email}</div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={column.className || 'text-sm text-gray-900'}>
                        {renderCellContent(item, column)}
                      </div>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(item);
                          }}
                          className={`${action.className || 'text-blue-600 hover:text-blue-900'}`}
                          title={action.title}
                          disabled={action.disabled && action.disabled(item)}
                        >
                          {action.icon ? (
                            <action.icon className="h-4 w-4" />
                          ) : (
                            action.label
                          )}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
