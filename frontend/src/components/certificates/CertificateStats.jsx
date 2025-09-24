import React from 'react';
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const CertificateStats = ({ stats = {}, variant = 'admin' }) => {
  const getStatsConfig = () => {
    switch (variant) {
      case 'admin':
        return [
          {
            key: 'issued',
            label: 'Certificados Emitidos',
            icon: AcademicCapIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            key: 'pending',
            label: 'Pendientes de Emisión',
            icon: DocumentTextIcon,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
          },
          {
            key: 'students',
            label: 'Estudiantes Certificados',
            icon: UserGroupIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          },
          {
            key: 'courses',
            label: 'Cursos con Certificados',
            icon: BookOpenIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
          }
        ];
      case 'instructor':
        return [
          {
            key: 'issued',
            label: 'Certificados Emitidos',
            icon: AcademicCapIcon,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
          },
          {
            key: 'pending',
            label: 'Pendientes de Emisión',
            icon: DocumentTextIcon,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
          },
          {
            key: 'students',
            label: 'Estudiantes Certificados',
            icon: UserGroupIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
          }
        ];
      default:
        return [];
    }
  };

  // Handle case when stats is null, undefined, or empty
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {getStatsConfig().map((config) => {
          const IconComponent = config.icon;
          return (
            <div key={config.key} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{config.label}</p>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend > 0) return ArrowTrendingUpIcon;
    if (trend < 0) return ArrowTrendingDownIcon;
    return null;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const formatTrend = (trend) => {
    if (trend === 0) return 'Sin cambios';
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend}`;
  };

  const statsConfig = getStatsConfig();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((config) => {
        const IconComponent = config.icon;
        const value = stats[config.key] || 0;
        const trend = stats.trends?.[config.key] || 0;
        const TrendIcon = getTrendIcon(trend);

        return (
          <div key={config.key} className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{config.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {stats.trends && trend !== undefined && (
              <div className="mt-4 flex items-center">
                {TrendIcon && (
                  <TrendIcon className={`h-4 w-4 mr-1 ${getTrendColor(trend)}`} />
                )}
                <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                  {formatTrend(trend)}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CertificateStats;
