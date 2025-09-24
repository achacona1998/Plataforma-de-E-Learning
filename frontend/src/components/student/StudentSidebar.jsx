import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import {
  BookOpenIcon,
  UserIcon,
  ChartBarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const StudentSidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    { icon: HomeIcon, label: " Inicio", path: "/student/dashboard" },
    { icon: BookOpenIcon, label: " Mis Cursos", path: "/student/courses" },
    { icon: ChartBarIcon, label: " Mi Progreso", path: "/student/analytics" },
    {
      icon: AcademicCapIcon,
      label: " Certificados",
      path: "/student/certificates",
    },
    { icon: DocumentTextIcon, label: " Recursos", path: "/student/resources" },
    { icon: CogIcon, label: " Configuración", path: "/student/settings" },
  ];

  return (
    <aside className="flex flex-col w-64 h-full bg-gradient-to-b from-white via-emerald-50 to-green-100 border-r border-gray-200 shadow-2xl">
      {/* Logo */}
      <header className="flex flex-shrink-0 justify-center items-center h-[68px] bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 shadow-lg">
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="w-8 h-8 text-white drop-shadow-lg" />
          <span className="text-xl font-bold text-white drop-shadow-lg">
            EduUnify
          </span>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="flex-shrink-0 px-4 mt-4 mb-4">
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              📊 Progreso del 75% completado
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
                  ? "text-white bg-gradient-to-r from-emerald-500 to-green-600 border-l-4 border-white shadow-lg"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:shadow-md"
              }`}>
              <Icon
                className={`mr-3 w-5 h-5 ${
                  isActive ? "text-white" : "text-emerald-600"
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
      <div className="flex-shrink-0 p-4 space-y-3 border-t border-emerald-200">
        <button
          onClick={() => (window.location.href = "/student/help")}
          className="flex items-center px-4 py-3 w-full text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 transition-all duration-300 transform hover:from-green-100 hover:to-emerald-100 hover:shadow-md hover:scale-105">
          <QuestionMarkCircleIcon className="mr-3 w-5 h-5 text-green-600" />
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

export default StudentSidebar;
