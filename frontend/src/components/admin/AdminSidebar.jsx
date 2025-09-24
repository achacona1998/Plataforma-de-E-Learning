import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import {
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    { icon: BookOpenIcon, label: " Inicio", path: "/admin/dashboard" },
    { icon: BookOpenIcon, label: " Cursos", path: "/admin/courses" },
    { icon: UserGroupIcon, label: " Usuarios", path: "/admin/students" },
    { icon: ChartBarIcon, label: " Estadísticas", path: "/admin/statistics" },
    { icon: CurrencyDollarIcon, label: " Pagos", path: "/admin/payments" },
    {
      icon: AcademicCapIcon,
      label: " Certificados",
      path: "/admin/certificates",
    },
    { icon: DocumentTextIcon, label: " Reportes", path: "/admin/reports" },
    { icon: CogIcon, label: " Configuración", path: "/admin/settings" },
  ];

  return (
    <aside className="flex flex-col w-64 h-full bg-gradient-to-b from-white via-blue-50 to-indigo-100 border-r border-gray-200 shadow-2xl">
      {/* Logo */}
      <header className="flex flex-shrink-0 justify-center items-center h-16 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 shadow-lg">
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="w-8 h-8 text-white drop-shadow-lg" />
          <span className="text-xl font-bold text-white drop-shadow-lg">
            {" "}
            EduUnify
          </span>
        </div>
      </header>

      {/* User Info */}
      <div className="flex-shrink-0 p-4">
        <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full shadow-md">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.nombre || "Administrador"}
              </p>
              <p className="text-xs font-medium text-teal-700">
                ⚡ Admin Activo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Badge */}
      <div className="flex-shrink-0 px-4 mb-4">
        <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-200 shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-teal-700">
              💬 3 nuevos mensajes
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="overflow-y-auto flex-1 px-3">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <a
              key={index}
              href={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? "text-white bg-gradient-to-r from-teal-500 to-blue-600 border-l-4 border-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:shadow-md"
              }`}>
              <Icon
                className={`mr-3 w-5 h-5 ${
                  isActive ? "text-white" : "text-teal-600"
                }`}
              />
              <span className={`font-medium ${isActive ? "text-white" : ""}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 p-4 space-y-3 border-t border-teal-200">
        <button
          onClick={() => (window.location.href = "/help")}
          className="flex items-center px-4 py-3 w-full text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 transition-all duration-300 transform hover:from-blue-100 hover:to-indigo-100 hover:shadow-md hover:scale-105">
          <QuestionMarkCircleIcon className="mr-3 w-5 h-5 text-blue-600" />
          <span className="font-medium">❓ Ayuda</span>
        </button>
        <button
          onClick={logout}
          className="flex items-center px-4 py-3 w-full text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg transition-all duration-300 transform hover:from-red-600 hover:to-pink-700 hover:shadow-xl hover:scale-105">
          <ArrowRightOnRectangleIcon className="mr-3 w-5 h-5" />
          <span className="font-medium">🚪 Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
