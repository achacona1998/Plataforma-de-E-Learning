import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const InstructorSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    { icon: HomeIcon, label: 'Inicio', path: '/instructor/dashboard' },
    { icon: PlusIcon, label: 'Crear Curso', path: '/instructor/create-course' },
    { icon: BookOpenIcon, label: 'Mis Cursos', path: '/instructor/courses' },
    { icon: UserGroupIcon, label: 'Mis Estudiantes', path: '/instructor/my-students' },
    { icon: ChartBarIcon, label: 'Analíticas', path: '/instructor/analytics' },
    { icon: AcademicCapIcon, label: 'Certificados', path: '/instructor/certificates' },
    { icon: DocumentTextIcon, label: 'Recursos', path: '/instructor/resources' },
    { icon: CogIcon, label: 'Configuración', path: '/instructor/settings' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-teal-600">
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="h-8 w-8 text-white" />
          <span className="text-white text-xl font-bold">EduUnify</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Instructor'}</p>
              <p className="text-xs text-teal-700">Instructor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <a
              key={index}
              href={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-gray-100 border-r-4 border-teal-600 text-teal-600' : ''
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 w-64 p-4 space-y-2">
        <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors">
          <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
          <span>Ayuda</span>
        </button>
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default InstructorSidebar;
