import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AddContent from "../../components/content/Contenido";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función memoizada para navegar a cursos
  const handleBackToCourses = useCallback(() => {
    navigate('/student/courses');
  }, [navigate]);

  // Función memoizada para navegar a breadcrumb
  const handleBreadcrumbClick = useCallback(() => {
    navigate('/student/courses');
  }, [navigate]);

  // Memoizar el cálculo de estadísticas del contenido
  const contentStats = useMemo(() => {
    if (!content || content.length === 0) return null;
    
    const stats = content.reduce((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + 1;
      if (item.duracion) {
        acc.totalDuration = (acc.totalDuration || 0) + parseInt(item.duracion);
      }
      return acc;
    }, {});
    
    return stats;
  }, [content]);

  // Fetch curso y su contenido
  useEffect(() => {
    const fetchData = async () => {
      // Validar que el ID del curso existe
      if (!id) {
        setError('ID del curso no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener curso
        const courseRes = await fetch(`http://localhost:5000/api/cursos/${id}`);
        if (!courseRes.ok) {
          if (courseRes.status === 404) {
            throw new Error('Curso no encontrado');
          } else if (courseRes.status >= 500) {
            throw new Error('Error del servidor. Intenta más tarde');
          } else {
            throw new Error('Error al cargar el curso');
          }
        }
        const courseData = await courseRes.json();
        
        // Validar que los datos del curso existen
        if (!courseData || !courseData.data) {
          throw new Error('Datos del curso no válidos');
        }
        setCourse(courseData.data);

        // Obtener contenido
        const contentRes = await fetch(
          `http://localhost:5000/api/contenidos/curso/${id}`
        );
        if (!contentRes.ok) {
          // El contenido puede no existir, no es un error crítico
          console.warn('No se pudo cargar el contenido del curso');
          setContent([]);
        } else {
          const contentData = await contentRes.json();
          setContent(Array.isArray(contentData.data) ? contentData.data : []);
        }

        // Verificar si el usuario está inscrito
        if (user && localStorage.getItem('token')) {
          try {
            const enrollmentRes = await fetch(
              `http://localhost:5000/api/inscripciones/verificar/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            if (enrollmentRes.ok) {
              const enrollmentData = await enrollmentRes.json();
              setIsEnrolled(Boolean(enrollmentData.inscrito));
            } else {
              // Si no se puede verificar la inscripción, asumir que no está inscrito
              setIsEnrolled(false);
            }
          } catch (enrollmentError) {
            console.error('Error checking enrollment:', enrollmentError);
            setIsEnrolled(false);
          }
        } else {
          setIsEnrolled(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || 'Error desconocido al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBackToCourses}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={handleBreadcrumbClick}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              📚 Cursos
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{course?.titulo}</span>
          </nav>
        </div>

        {/* Header del curso */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  {course?.titulo}
                </h1>
              </div>
              <p className="text-lg text-gray-600 mb-4">{course?.descripcion}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {course?.instructor_id?.nombre || "Por asignar"}
                  </span>
                </div>
                
                {course?.duracion && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">{course.duracion}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm font-medium">{content.length} lecciones</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              {course?.precio && (
                <div className="text-right bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600">
                    ${course.precio}
                  </div>
                  <div className="text-sm text-gray-500">Precio del curso</div>
                </div>
              )}
              
              {user && !isEnrolled && course?.precio && (
                <Link
                  to={`/checkout/${id}`}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  💳 Comprar Curso
                </Link>
              )}
              
              {user && isEnrolled && (
                <div className="px-8 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 font-medium rounded-xl border border-green-200">
                  ✅ Ya estás inscrito
                </div>
              )}
              
              {!user && (
                <Link
                  to="/login"
                  className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
                >
                  🔐 Inicia sesión para comprar
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">📚 Contenido del Curso</h2>
          </div>
          
          {content.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin contenido disponible</h3>
              <p className="text-gray-500">Este curso aún no tiene lecciones publicadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {content.map((item, index) => (
                <div key={item._id} className="group p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md bg-gradient-to-r ${
                        item.tipo === "video" ? "from-blue-500 to-blue-600" : 
                        item.tipo === "documento" ? "from-green-500 to-green-600" : 
                        item.tipo === "quiz" ? "from-yellow-500 to-yellow-600" : 
                        "from-purple-500 to-purple-600"
                      }`}>
                        {item.tipo === "video" && "🎥"}
                        {item.tipo === "documento" && "📄"}
                        {item.tipo === "quiz" && "❓"}
                        {item.tipo === "tarea" && "✏️"}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-500">Lección {index + 1}</span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                          item.tipo === "video" ? "bg-blue-100 text-blue-800" : 
                          item.tipo === "documento" ? "bg-green-100 text-green-800" : 
                          item.tipo === "quiz" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-purple-100 text-purple-800"
                        }`}>
                          {item.tipo}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {item.titulo || `${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)} ${index + 1}`}
                      </h3>
                      
                      {item.duracion && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{item.duracion} minutos</span>
                        </div>
                      )}
                    </div>
                    
                    {item.url && (
                      <div className="flex-shrink-0">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Acceder
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario para añadir contenido (solo para instructores) */}
        {user?.rol === 'instructor' && (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">➕ Añadir Contenido</h2>
            </div>
            <AddContent courseId={id} />
          </div>
        )}
      </div>
    </div>
  );
};
export default CourseDetail;
