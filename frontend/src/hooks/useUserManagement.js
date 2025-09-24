import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./useApi";
import { useSearch } from "./useSearch";
import { API_BASE_URL, API_ROUTES, USER_ROLES, USER_STATUS } from "../utils/constants";
import { formatDate } from "../utils/helpers";

/**
 * Hook personalizado para manejar la gestión de usuarios
 * @returns {object} - Estados y funciones para gestionar usuarios
 */
export const useUserManagement = () => {
  const navigate = useNavigate();
  
  // Estados para los modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Usar hook useApi para obtener los usuarios
  const { data: apiResponse, loading, error, refetch } = useApi("/api/usuarios");

  // Procesar los datos de usuarios cuando estén disponibles
  const processedUsers = useMemo(() => {
    const users = (apiResponse && apiResponse.data) || [];
    return users.map((userData) => ({
      id: userData._id,
      name: userData.nombre,
      email: userData.email,
      role: userData.rol,
      status: userData.estado || USER_STATUS.ACTIVE,
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.nombre
        )}&background=0d9488&color=fff`,
      createdAt: formatDate(userData.fecha_registro),
      lastLogin: userData.ultimo_acceso
        ? formatDate(userData.ultimo_acceso)
        : "Nunca",
      coursesCount: userData.cursos_inscritos?.length || 0,
      phone: userData.telefono || "No especificado",
      // Datos adicionales para los modales
      telefono: userData.telefono,
      fecha_nacimiento: userData.fecha_nacimiento,
      biografia: userData.biografia,
      fecha_registro: userData.fecha_registro,
      updated_at: userData.updated_at,
      rol: userData.rol,
      estado: userData.estado,
      nombre: userData.nombre
    }));
  }, [apiResponse]);

  // Usar el hook personalizado para búsqueda y filtros con datos procesados
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData: filteredUsers,
    filterCount,
  } = useSearch(processedUsers, ["name", "email"], {
    role: "all",
    status: "all",
  });

  // Función para eliminar usuario
  const deleteUser = async (userId) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No tienes autorización. Por favor, inicia sesión nuevamente.");
      }

      const response = await fetch(`${API_BASE_URL}${API_ROUTES.USERS}/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await refetch(); // Refresh the list
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para actualizar el estado de un usuario
  const updateUserStatus = async (userId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No tienes autorización. Por favor, inicia sesión nuevamente.");
      }

      const response = await fetch(`${API_BASE_URL}${API_ROUTES.USERS}/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (response.ok) {
        await refetch(); // Refresh the list
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar estado del usuario");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      return { success: false, error: error.message };
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Función para navegar a crear usuario
  const handleCreateUser = () => {
    navigate("/admin/students/create");
  };

  // Función para navegar a editar usuario
  const handleEditUser = (userId) => {
    if (!userId) {
      throw new Error("ID de usuario no válido");
    }
    navigate(`/admin/students/edit/${userId}`);
  };

  // Función para navegar a ver usuario
  const handleViewUserPage = (userId) => {
    if (!userId) {
      throw new Error("ID de usuario no válido");
    }
    navigate(`/admin/students/view/${userId}`);
  };

  // Función para abrir modal de vista
  const handleViewUser = (userId, userName) => {
    const user = processedUsers.find(u => u.id === userId);
    if (user) {
      // Buscar datos completos del usuario desde la API
      const fullUser = apiResponse?.data?.find(u => u._id === userId);
      if (fullUser) {
        setSelectedUser({
          ...user,
          nombre: fullUser.nombre,
          email: fullUser.email,
          telefono: fullUser.telefono,
          fecha_nacimiento: fullUser.fecha_nacimiento,
          biografia: fullUser.biografia,
          fecha_registro: fullUser.fecha_registro,
          updated_at: fullUser.updated_at,
          rol: fullUser.rol,
          estado: fullUser.estado
        });
        setViewModalOpen(true);
      }
    }
  };

  // Función para abrir modal de eliminación
  const handleDeleteUser = (userId, userName) => {
    const user = processedUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser({ ...user, nombre: userName });
      setDeleteModalOpen(true);
    }
  };

  // Función para abrir modal de cambio de estado
  const handleToggleStatus = (userId, currentStatus, userName) => {
    const user = processedUsers.find(u => u.id === userId);
    if (user) {
      setSelectedUser({ ...user, nombre: userName, estado: currentStatus });
      setStatusModalOpen(true);
    }
  };

  // Función para confirmar eliminación
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      setDeleteModalOpen(false);
      setSelectedUser(null);
      return { success: true, message: `Usuario "${selectedUser.nombre}" eliminado exitosamente` };
    } else {
      return { success: false, error: result.error };
    }
  };

  // Función para confirmar cambio de estado
  const confirmToggleStatus = async () => {
    if (!selectedUser) return;
    
    const newStatus = selectedUser.estado === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE;
    const action = newStatus === USER_STATUS.ACTIVE ? "activar" : "desactivar";
    
    const result = await updateUserStatus(selectedUser.id, newStatus);
    if (result.success) {
      setStatusModalOpen(false);
      setSelectedUser(null);
      return { success: true, message: `Usuario "${selectedUser.nombre}" ${action}do exitosamente` };
    } else {
      return { success: false, error: result.error };
    }
  };

  // Función para cerrar modales
  const closeModals = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setStatusModalOpen(false);
    setSelectedUser(null);
  };

  // Función para seleccionar usuario
  const selectUser = (user) => {
    setSelectedUser(user);
  };

  // Función para limpiar selección
  const clearSelection = () => {
    setSelectedUser(null);
  };

  // Funciones de utilidad para roles
  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "🛡️";
      case USER_ROLES.INSTRUCTOR:
        return "👨‍🏫";
      default:
        return "🎓";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "bg-red-100 text-red-800";
      case USER_ROLES.INSTRUCTOR:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  // Estadísticas de usuarios
  const userStats = useMemo(() => ({
    total: processedUsers.length,
    students: processedUsers.filter(u => u.role === USER_ROLES.STUDENT).length,
    instructors: processedUsers.filter(u => u.role === USER_ROLES.INSTRUCTOR).length,
    admins: processedUsers.filter(u => u.role === USER_ROLES.ADMIN).length,
    active: processedUsers.filter(u => u.status === USER_STATUS.ACTIVE).length,
    inactive: processedUsers.filter(u => u.status === USER_STATUS.INACTIVE).length,
  }), [processedUsers]);

  return {
    // Estados
    users: processedUsers,
    filteredUsers,
    loading,
    error,
    searchTerm,
    filters,
    filterCount,
    userStats,

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
    setIsDeleting,
    isUpdatingStatus,
    setIsUpdatingStatus,

    // Funciones de búsqueda y filtrado
    setSearchTerm,
    updateFilter,
    clearFilters,

    // Funciones de navegación
    handleCreateUser,
    handleEditUser,
    handleViewUserPage,

    // Funciones de modales
    handleViewUser,
    handleDeleteUser,
    handleToggleStatus,
    confirmDeleteUser,
    confirmToggleStatus,
    closeModals,

    // Funciones de gestión
    deleteUser,
    updateUserStatus,
    selectUser,
    clearSelection,
    refetch,

    // Funciones de utilidad
    getRoleIcon,
    getRoleColor,
  };
};