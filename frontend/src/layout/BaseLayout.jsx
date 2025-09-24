import React from "react";
import { useAuth } from "../contexts/AuthContext";

const BaseLayout = ({
  children,
  SidebarComponent,
  headerContent = null,
  showSearch = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  actionButton = null,
}) => {
  const { user } = useAuth();

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "instructor":
        return "Instructor";
      case "estudiante":
        return "Estudiante";
      default:
        return "Usuario";
    }
  };



  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <SidebarComponent />

      {/* Main Content */}
      <div className="flex overflow-hidden flex-col flex-1">
        {/* Header */}
        <header className="flex-shrink-0 bg-gradient-to-r from-white via-blue-50 to-indigo-50 border-b border-gray-200 shadow-lg backdrop-blur-sm">
          <div className="flex justify-end items-center px-6 py-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">
                {user?.nombre || "Usuario"}
              </span>
              <span className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105">
                {getRoleLabel(user?.rol)}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="overflow-y-auto flex-1 bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-indigo-100/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
