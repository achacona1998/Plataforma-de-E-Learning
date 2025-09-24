import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  BookOpen, 
  User, 
  Settings, 
  LogOut, 
  GraduationCap,
  Menu,
  X,
  Shield,
  Home
} from 'lucide-react';

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  return (
    <nav className="relative border-b shadow-lg backdrop-blur-md bg-white/80 border-white/20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                EduPlatform
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-xl transition-all duration-300 group hover:bg-blue-50 hover:text-blue-600">
                <Home className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
                Inicio
              </Link>
              <Link
                to="/courses"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-xl transition-all duration-300 group hover:bg-blue-50 hover:text-blue-600">
                <BookOpen className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
                Cursos
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-learning"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-xl transition-all duration-300 group hover:bg-blue-50 hover:text-blue-600">
                    <GraduationCap className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
                    Mi Aprendizaje
                  </Link>
                  {user.rol === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-xl transition-all duration-300 group hover:bg-purple-50 hover:text-purple-600">
                      <Shield className="mr-2 w-4 h-4 transition-transform group-hover:scale-110" />
                      Panel Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 rounded-xl border border-gray-200 transition-all duration-300 transform hover:bg-gray-50 hover:scale-105">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 transform hover:from-blue-700 hover:to-purple-700 hover:scale-105">
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center p-2 space-x-2 rounded-xl transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <div className="flex justify-center items-center w-10 h-10 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    {user?.nombre?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <span className="hidden text-sm font-medium text-gray-700 sm:block">
                    {user?.nombre || "Usuario"}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border shadow-xl backdrop-blur-md origin-top-right bg-white/90 border-white/20 focus:outline-none">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.nombre || "Usuario"}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                        {user?.rol || "estudiante"}
                      </span>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-2 w-full text-sm text-gray-700 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsProfileMenuOpen(false)}>
                        <User className="mr-3 w-4 h-4" />
                        Mi Perfil
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-3 py-2 w-full text-sm text-gray-700 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsProfileMenuOpen(false)}>
                        <Settings className="mr-3 w-4 h-4" />
                        Configuración
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center px-3 py-2 w-full text-sm text-red-600 rounded-xl transition-all duration-300 hover:bg-red-50">
                        <LogOut className="mr-3 w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl transition-colors duration-300 md:hidden hover:bg-gray-50">
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 backdrop-blur-md md:hidden bg-white/90">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}>
                <Home className="mr-3 w-5 h-5" />
                Inicio
              </Link>
              <Link
                to="/courses"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}>
                <BookOpen className="mr-3 w-5 h-5" />
                Cursos
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-learning"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <GraduationCap className="mr-3 w-5 h-5" />
                    Mi Aprendizaje
                  </Link>
                  {user.rol === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-xl transition-all duration-300 hover:bg-purple-50 hover:text-purple-600"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      <Shield className="mr-3 w-5 h-5" />
                      Panel Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
