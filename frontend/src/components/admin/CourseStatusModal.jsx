import React, { useState } from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

const CourseStatusModal = ({ isOpen, onClose, course, onConfirm, isUpdating }) => {
  const [selectedStatus, setSelectedStatus] = useState(course?.estado || 'borrador');

  // Actualizar el estado seleccionado cuando cambie el curso
  React.useEffect(() => {
    if (course?.estado) {
      setSelectedStatus(course.estado);
    }
  }, [course?.estado]);

  const statusOptions = [
    {
      value: 'borrador',
      label: 'Borrador',
      description: 'El curso está en desarrollo y no es visible para los estudiantes',
      icon: DocumentTextIcon,
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      value: 'publicado',
      label: 'Publicado',
      description: 'El curso está activo y disponible para inscripciones',
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      value: 'archivado',
      label: 'Archivado',
      description: 'El curso no está disponible para nuevas inscripciones',
      icon: ArchiveBoxIcon,
      color: 'text-gray-600 bg-gray-100',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(course.id, selectedStatus);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Cambiar Estado del Curso
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Course info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">{course?.title || 'Curso sin título'}</h4>
                <p className="text-sm text-gray-600">Instructor: {course?.instructor || 'No asignado'}</p>
                <div className="mt-3 flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">Estado actual:</span>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                    course?.estado === 'publicado'
                      ? 'bg-green-100 text-green-800'
                      : course?.estado === 'archivado'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {(() => {
                      const currentStatus = statusOptions.find(option => option.value === course?.estado);
                      const IconComponent = currentStatus?.icon || DocumentTextIcon;
                      return (
                        <>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {currentStatus?.label || 'Borrador'}
                        </>
                      );
                    })()}
                  </span>
                </div>
              </div>

              {/* Status options */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Seleccionar nuevo estado:
                </label>
                {statusOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                        selectedStatus === option.value
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleStatusChange(option.value)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={selectedStatus === option.value}
                          onChange={() => handleStatusChange(option.value)}
                          className="h-4 w-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <div className={`p-1 rounded-full ${option.color} mr-2`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="block text-sm font-medium text-gray-900">
                            {option.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={isUpdating || selectedStatus === course?.estado}
                className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                  isUpdating || selectedStatus === course?.estado
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  'Cambiar Estado'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseStatusModal;