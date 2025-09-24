import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SearchAndFilter from "../../components/ui/SearchAndFilter";
import UserViewModal from "../../components/admin/UserViewModal";
import UserDeleteModal from "../../components/admin/UserDeleteModal";
import UserStatusModal from "../../components/admin/UserStatusModal";
import { useUserManagement } from "../../hooks/useUserManagement";
import { USER_ROLES, USER_STATUS } from "../../utils/constants";
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const AdminUsers = () => {
  const navigate = useNavigate();
  
  // Usar el hook personalizado para gestión de usuarios
  const {
    // Estados
    users: processedUsers,
    filteredUsers,
    loading,
    error,
    searchTerm,
    filters,
    filterCount,

    // Estados de modales
    viewModalOpen,
    setViewModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    statusModalOpen,
    setStatusModalOpen,
    selectedUser,
    setSelectedUser,
    isDeleting,
    isUpdatingStatus,

    // Funciones de búsqueda y filtrado
    setSearchTerm,
    updateFilter,
    clearFilters,

    // Funciones de navegación
    handleEditUser,

    // Funciones de modales
    handleViewUser,
    handleDeleteUser,
    handleToggleStatus,
    confirmDeleteUser,
    confirmToggleStatus,

    // Funciones de utilidad
    getRoleColor,
  } = useUserManagement();

  // Funciones de manejo con alertas mejoradas
  const handleDeleteUserWithAlert = async (userId, userName) => {
    handleDeleteUser(userId, userName);
  };

  const handleConfirmDeleteUser = async () => {
    const result = await confirmDeleteUser();
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Error al eliminar el usuario: ${result.error}`);
    }
  };

  const handleConfirmToggleStatus = async () => {
    const result = await confirmToggleStatus();
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Error al cambiar el estado: ${result.error}`);
    }
  };

  // Función para obtener iconos de rol con componentes de Heroicons
  const getRoleIconComponent = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <ShieldCheckIcon className="w-4 h-4" />;
      case USER_ROLES.INSTRUCTOR:
        return <AcademicCapIcon className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <LoadingSpinner size="large" fullScreen text="Cargando usuarios..." />
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <UserGroupIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    👥 Gestión de Usuarios
                  </h1>
                  <p className="text-lg text-gray-600">
                    Administra todos los usuarios de la plataforma
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">
                      Última actualización: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/admin/students/create")}
                  className="flex items-center px-6 py-3 space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <PlusIcon className="w-5 h-5" />
                  <span className="font-semibold">Crear Usuario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar usuarios por nombre o email..."
          filters={[
            {
              key: "role",
              label: "Rol",
              options: [
                { value: "all", label: "Todos los roles" },
                { value: USER_ROLES.STUDENT, label: "Estudiantes" },
                { value: USER_ROLES.INSTRUCTOR, label: "Instructores" },
                { value: USER_ROLES.ADMIN, label: "Administradores" },
              ],
            },
            {
              key: "status",
              label: "Estado",
              options: [
                { value: "all", label: "Todos los estados" },
                { value: USER_STATUS.ACTIVE, label: "Activos" },
                { value: USER_STATUS.INACTIVE, label: "Inactivos" },
              ],
            },
          ]}
          activeFilters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          filterCount={filterCount}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-600">
                    👥 Total Usuarios
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {processedUsers.length}
                  </p>
                </div>
              </div>
              <div className="text-2xl text-blue-500">📊</div>
            </div>
            <div className="p-2 mt-4 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-700">Usuarios registrados</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-600">
                    🎓 Estudiantes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {
                      processedUsers.filter((u) => u.role === USER_ROLES.STUDENT)
                        .length
                    }
                  </p>
                </div>
              </div>
              <div className="text-2xl text-green-500">📚</div>
            </div>
            <div className="p-2 mt-4 bg-green-50 rounded-lg">
              <p className="text-xs font-medium text-green-700">Aprendices activos</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-600">
                    👨‍🏫 Instructores
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {
                      processedUsers.filter(
                        (u) => u.role === USER_ROLES.INSTRUCTOR
                      ).length
                    }
                  </p>
                </div>
              </div>
              <div className="text-2xl text-yellow-500">🏆</div>
            </div>
            <div className="p-2 mt-4 bg-yellow-50 rounded-lg">
              <p className="text-xs font-medium text-yellow-700">Educadores certificados</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl group">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-gradient-to-br from-red-400 to-pink-600 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-gray-600">
                    🛡️ Administradores
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {
                      processedUsers.filter((u) => u.role === USER_ROLES.ADMIN)
                        .length
                    }
                  </p>
                </div>
              </div>
              <div className="text-2xl text-red-500">⚡</div>
            </div>
            <div className="p-2 mt-4 bg-red-50 rounded-lg">
              <p className="text-xs font-medium text-red-700">Gestores del sistema</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-lg">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h3 className="flex items-center text-lg font-semibold text-gray-900">
              <UserGroupIcon className="mr-2 w-5 h-5 text-blue-600" />
              📋 Lista de Usuarios
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {filteredUsers.length} usuarios encontrados
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    👤 Usuario
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    🏷️ Rol
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    📊 Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    📚 Cursos
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    🕒 Último Acceso
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    ⚙️ Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((userData, index) => (
                  <tr key={userData.id} className="transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            className="w-12 h-12 rounded-xl border-2 border-white shadow-md transition-transform duration-200 group-hover:scale-110"
                            src={userData.avatar || "../placeholder-avatar.svg"}
                            alt={userData.name}
                          />
                          <div className="flex absolute -top-1 -right-1 justify-center items-center w-4 h-4 text-xs font-bold text-white bg-gradient-to-br from-blue-400 to-blue-600 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
                            {userData.name}
                          </div>
                          <div className="px-2 py-1 mt-1 text-sm text-gray-500 bg-gray-100 rounded-md">
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-2 px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${getRoleColor(
                          userData.role
                        )}`}>
                        {getRoleIconComponent(userData.role)}
                        <span className="capitalize">{userData.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-sm ${
                          userData.status === USER_STATUS.ACTIVE
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                            : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800"
                        }`}>
                        {userData.status === USER_STATUS.ACTIVE ? "✅ Activo" : "❌ Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-2 text-sm font-bold text-blue-800 bg-blue-100 rounded-xl">
                          {userData.coursesCount}
                        </div>
                        <span className="text-xs text-gray-500">cursos</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                        {userData.lastLogin}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(userData.id, userData.name)}
                          className="p-2 text-blue-600 bg-blue-100 rounded-lg shadow-sm transition-all duration-200 hover:bg-blue-200 hover:scale-110 hover:shadow-md"
                          title={`👁️ Ver detalles de ${userData.name}`}>
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(userData.id, userData.name)}
                          className="p-2 text-green-600 bg-green-100 rounded-lg shadow-sm transition-all duration-200 hover:bg-green-200 hover:scale-110 hover:shadow-md"
                          title={`✏️ Editar información de ${userData.name}`}>
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(userData.id, userData.status, userData.name)
                          }
                          className={`p-2 rounded-lg hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md ${
                            userData.status === USER_STATUS.ACTIVE
                              ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
                              : "text-green-600 bg-green-100 hover:bg-green-200"
                          }`}
                          title={`${userData.status === USER_STATUS.ACTIVE ? "🔒 Desactivar" : "🔓 Activar"} a ${userData.name}`}>
                          {userData.status === USER_STATUS.ACTIVE ? "🔒" : "🔓"}
                        </button>
                        <button
                          onClick={() => handleDeleteUserWithAlert(userData.id, userData.name)}
                          className="p-2 text-red-600 bg-red-100 rounded-lg shadow-sm transition-all duration-200 hover:bg-red-200 hover:scale-110 hover:shadow-md"
                          title={`🗑️ Eliminar a ${userData.name} (PERMANENTE)`}>
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-16 text-center">
            <div className="flex flex-col justify-center items-center space-y-6">
              <div className="flex justify-center items-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full shadow-lg">
                <UserGroupIcon className="w-10 h-10 text-gray-400" />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  👥 No se encontraron usuarios
                </h3>
                <p className="text-lg text-gray-500">
                  {searchTerm || filters.role !== "all" || filters.status !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Comienza creando tu primer usuario"}
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/students/create")}
                className="flex items-center px-6 py-3 space-x-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                <PlusIcon className="w-5 h-5" />
                <span className="font-semibold">Crear Primer Usuario</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <UserViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={(userId) => {
          setViewModalOpen(false);
          handleEditUser(userId);
        }}
      />

      <UserDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDeleteUser}
        user={selectedUser}
        isDeleting={isDeleting}
      />

      <UserStatusModal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmToggleStatus}
        user={selectedUser}
        isUpdating={isUpdatingStatus}
      />
    </AdminLayout>
  );
};

export default AdminUsers;
