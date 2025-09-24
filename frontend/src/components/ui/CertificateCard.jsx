import React from 'react';
import {
  AcademicCapIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const CertificateCard = ({ 
  certificate, 
  onView, 
  onDownload, 
  onShare, 
  onGenerate,
  showActions = true,
  showStudentInfo = false,
  showInstructorInfo = false,
  variant = 'card' // 'card' | 'table-row'
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      issued: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Emitido',
        icon: CheckCircleIcon
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pendiente',
        icon: ClockIcon
      },
      expired: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Expirado',
        icon: ClockIcon
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (variant === 'table-row') {
    return (
      <tr className="hover:bg-gray-50">
        {showStudentInfo && (
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-teal-800">
                    {certificate.studentName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{certificate.studentName}</div>
                <div className="text-sm text-gray-500">{certificate.studentEmail}</div>
              </div>
            </div>
          </td>
        )}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{certificate.courseName}</div>
          {showInstructorInfo && (
            <div className="text-sm text-gray-500">{certificate.instructor}</div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            <span className={`font-semibold ${getGradeColor(certificate.grade)}`}>
              {certificate.grade}%
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{formatDate(certificate.completionDate)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {getStatusBadge(certificate.status)}
        </td>
        {showActions && (
          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
            <div className="flex items-center space-x-2">
              {certificate.status === 'pending' && onGenerate && (
                <button 
                  onClick={() => onGenerate(certificate)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-900"
                  title="Generar certificado"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Generar</span>
                </button>
              )}
              {certificate.status === 'issued' && (
                <>
                  {onView && (
                    <button 
                      onClick={() => onView(certificate)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver certificado"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  )}
                  {onDownload && (
                    <button 
                      onClick={() => onDownload(certificate)}
                      className="text-green-600 hover:text-green-900"
                      title="Descargar certificado"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                  )}
                  {onShare && (
                    <button 
                      onClick={() => onShare(certificate)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Compartir certificado"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </td>
        )}
      </tr>
    );
  }

  // Card variant
  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{certificate.courseName}</h3>
              {showStudentInfo && (
                <p className="text-sm text-gray-600">{certificate.studentName}</p>
              )}
              {showInstructorInfo && (
                <p className="text-sm text-gray-600">Instructor: {certificate.instructor}</p>
              )}
            </div>
          </div>
          {getStatusBadge(certificate.status)}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Calificación:</span>
            <span className={`font-semibold ${getGradeColor(certificate.grade)}`}>
              {certificate.grade}%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Completado:</span>
            <span className="text-gray-900">{formatDate(certificate.completionDate)}</span>
          </div>

          {certificate.issueDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Emitido:</span>
              <span className="text-gray-900">{formatDate(certificate.issueDate)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Duración:</span>
            <span className="text-gray-900">{certificate.duration}</span>
          </div>

          {certificate.certificateId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">ID:</span>
              <span className="text-gray-900 font-mono">{certificate.certificateId}</span>
            </div>
          )}
        </div>

        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Habilidades:</p>
            <div className="flex flex-wrap gap-1">
              {certificate.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {showActions && (
          <div className="mt-6 flex items-center justify-between">
            {certificate.status === 'pending' && onGenerate ? (
              <button 
                onClick={() => onGenerate(certificate)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircleIcon className="w-4 h-4" />
                <span>Generar</span>
              </button>
            ) : certificate.status === 'issued' ? (
              <div className="flex items-center space-x-2">
                {onView && (
                  <button 
                    onClick={() => onView(certificate)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                )}
                {onDownload && (
                  <button 
                    onClick={() => onDownload(certificate)}
                    className="flex items-center space-x-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span>Descargar</span>
                  </button>
                )}
              </div>
            ) : null}
            
            {certificate.status === 'issued' && onShare && (
              <button 
                onClick={() => onShare(certificate)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
              >
                <ShareIcon className="w-4 h-4" />
                <span>Compartir</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;
