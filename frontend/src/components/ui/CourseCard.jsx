import { Link } from "react-router-dom";
import { BookOpen, Star, Clock, Users, ChevronRight } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { _id, titulo, descripcion, instructor_id, precio, duracion, nivel } = course;

  return (
    <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      {/* Header with gradient background */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
          {nivel || 'Intermedio'}
        </div>
        
        {precio && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full px-3 py-1 text-sm font-bold">
            ${precio}
          </div>
        )}
        
        {/* Decorative circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {titulo}
        </h3>
        
        <p className="mb-4 text-sm text-gray-600 line-clamp-3 leading-relaxed">
          {descripcion}
        </p>

        {/* Course stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          {duracion && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{duracion}h</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>1.2k estudiantes</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>

        {/* Instructor info */}
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white font-semibold">
              {instructor_id?.nombre?.charAt(0) || "I"}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-900">
              {instructor_id?.nombre || "Instructor"}
            </p>
            <p className="text-xs text-gray-500">Instructor certificado</p>
          </div>
        </div>

        {/* Action button */}
        <Link
          to={`/courses/${_id}`}
          className="group/btn inline-flex justify-center items-center px-6 py-3 w-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl border border-transparent transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105">
          Ver detalles del curso
          <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
export default CourseCard;
