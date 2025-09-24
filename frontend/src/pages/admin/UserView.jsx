import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import { useApi } from '../../hooks/useApi';
import {
  UserIcon,
  ArrowLeftIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  TrophyIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const UserView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Usar useApi para obtener los datos del usuario
  const { data: userData, loading, error } = useApi(`/api/usuarios/${id}`);
  const [user, setUser] = useState(null);

  // Cargar datos del usuario cuando useApi obtiene los datos
  useEffect(() => {
    if (userData && !loading) {
      // Acceder a los datos del usuario, puede estar en userData.data o directamente en userData
      const usuario = userData.data || userData;
      setUser(usuario);
    }
    
    if (error) {
      console.error('Error al cargar el usuario:', error);
      alert('❌ Error al cargar los datos del usuario');
      navigate('/admin/users');
    }
  }, [userData, loading, error, navigate]);

  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  const getRoleInfo = (rol) => {
    const roles = {
      'estudiante': { label: '👨‍🎓 Estudiante', color: 'bg-blue-100 text-blue-800', icon: '👨‍🎓' },
      'instructor': { label: '👨‍🏫 Instructor', color: 'bg-green-100 text-green-800', icon: '👨‍🏫' },
      'admin': { label: '👨‍💼 Administrador', color: 'bg-purple-100 text-purple-800', icon: '👨‍💼' }
    };
    return roles[rol] || roles['estudiante'];
  };

  const getStatusInfo = (estado) => {
    const estados = {
      'activo': { label: '✅ Activo', color: 'bg-green-100 text-green-800' },
      'inactivo': { label: '❌ Inactivo', color: 'bg-red-100 text-red-800' },
      'suspendido': { label: '⏸️ Suspendido', color: 'bg-yellow-100 text-yellow-800' }
    };
    return estados[estado] || estados['activo'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 rounded-full border-b-2 border-teal-600 animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Usuario no encontrado</h2>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const roleInfo = getRoleInfo(user.rol);
  const statusInfo = getStatusInfo(user.estado);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">👤 Detalles del Usuario</h1>
                <p className="text-gray-600">Información completa del usuario</p>
              </div>
            </div>
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PencilIcon className="mr-2 w-4 h-4" />
              ✏️ Editar Usuario
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Información Principal */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl">
                  {roleInfo.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{user.nombre}</h2>
                  <p className="text-blue-100 mt-1">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color} bg-white bg-opacity-90`}>
                      {roleInfo.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} bg-white bg-opacity-90`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <EnvelopeIcon className="mr-2 w-6 h-6 text-green-600" />
                📞 Información de Contacto
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Correo Electrónico</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Teléfono</p>
                    <p className="text-gray-900">{user.telefono || 'No especificado'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha de Nacimiento</p>
                    <p className="text-gray-900">{formatDate(user.fecha_nacimiento)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Fecha de Registro</p>
                    <p className="text-gray-900">{formatDate(user.fecha_registro)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biografía */}
          {user.biografia && (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  <UserIcon className="mr-2 w-6 h-6 text-purple-600" />
                  📝 Biografía
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{user.biografia}</p>
              </div>
            </div>
          )}

          {/* Estadísticas de Actividad */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <AcademicCapIcon className="mr-2 w-6 h-6 text-orange-600" />
                📊 Estadísticas de Actividad
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpenIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{user.cursos_inscritos || 0}</p>
                  <p className="text-sm text-gray-600">Cursos Inscritos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckBadgeIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{user.cursos_completados || 0}</p>
                  <p className="text-sm text-gray-600">Cursos Completados</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <TrophyIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{user.certificados || 0}</p>
                  <p className="text-sm text-gray-600">Certificados Obtenidos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-slate-50">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <UserIcon className="mr-2 w-6 h-6 text-gray-600" />
                ⚙️ Información del Sistema
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">ID del Usuario</p>
                  <p className="text-gray-900 font-mono">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Último Acceso</p>
                  <p className="text-gray-900">{formatDate(user.ultimo_acceso) || 'Nunca'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Fecha de Creación</p>
                  <p className="text-gray-900">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Última Actualización</p>
                  <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              ⬅️ Volver a la Lista
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PencilIcon className="mr-2 w-4 h-4" />
              ✏️ Editar Usuario
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserView;