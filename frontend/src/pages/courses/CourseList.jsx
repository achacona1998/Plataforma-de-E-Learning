import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CourseCard from "../../components/ui/CourseCard";

const CourseList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cursos");
        if (!response.ok) throw new Error("Error al cargar cursos");

        const { data } = await response.json();
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    // Aquí deberías agregar lógica para otros filtros si es necesario
    return matchesSearch;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-indigo-600 animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );

  const handleCourseClick = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              📚 Catálogo de Cursos
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Descubre y explora nuestros cursos disponibles</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl border border-emerald-100 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="🔍 Buscar cursos por título o descripción..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-3 w-full rounded-xl border border-gray-300 sm:w-48 focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
              <option value="all">📋 Todos los cursos</option>
              <option value="inProgress">⏳ En progreso</option>
              <option value="completed">✅ Completados</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredCourses.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl shadow-xl border border-emerald-100">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron cursos</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                className="cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        {/* Course Count */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Mostrando <span className="font-bold text-emerald-600">{filteredCourses.length}</span> de{" "}
            <span className="font-bold text-emerald-600">{courses.length}</span> cursos
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
