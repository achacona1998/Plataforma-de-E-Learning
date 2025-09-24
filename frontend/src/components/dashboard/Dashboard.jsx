import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpen, 
  Award, 
  CreditCard, 
  FileCheck, 
  Search, 
  TrendingUp, 
  Clock, 
  Target,
  Play,
  ChevronRight,
  Star,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    coursesInProgress: 0,
    coursesCompleted: 0,
    totalTime: 0,
    certificates: 0
  });

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
      fetchUserStats();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inscripciones/usuario', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch enrolled courses');
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/usuarios/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 text-center h-64">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">¡Bienvenido de vuelta, {user?.nombre}!</h1>
            <p className="text-blue-100 text-lg">Continúa tu viaje de aprendizaje y alcanza tus metas</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-24 translate-y-24"></div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Link
                to="/courses"
                className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-blue-900">Explorar Cursos</h3>
                  <p className="text-blue-700 text-sm">Descubre nuevas oportunidades</p>
                </div>
              </Link>
              
              <Link
                to="/certificates"
                className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-green-900">Mis Certificados</h3>
                  <p className="text-green-700 text-sm">Ver logros obtenidos</p>
                </div>
              </Link>
              
              <Link
                to="/payment-history"
                className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="bg-purple-600 p-2 rounded-lg group-hover:bg-purple-700 transition-colors">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-purple-900">Historial de Pagos</h3>
                  <p className="text-purple-700 text-sm">Ver transacciones</p>
                </div>
              </Link>
              
              <Link
                to="/certificate-generator"
                className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="bg-yellow-600 p-2 rounded-lg group-hover:bg-yellow-700 transition-colors">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-yellow-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-yellow-900">Generar Certificados</h3>
                  <p className="text-yellow-700 text-sm">Descargar certificados</p>
                </div>
              </Link>
              
              <Link
                to="/verify-certificate"
                className="group relative overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 hover:from-teal-100 hover:to-teal-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <div className="bg-teal-600 p-2 rounded-lg group-hover:bg-teal-700 transition-colors">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-teal-600 ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold text-teal-900">Verificar Certificado</h3>
                  <p className="text-teal-700 text-sm">Validar autenticidad</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{stats.coursesInProgress}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cursos en Progreso</h3>
            <p className="text-gray-600 text-sm">Continúa aprendiendo</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">{stats.coursesCompleted}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cursos Completados</h3>
            <p className="text-gray-600 text-sm">¡Excelente progreso!</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-600">{stats.totalTime}h</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Tiempo de Estudio</h3>
            <p className="text-gray-600 text-sm">Horas invertidas</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">{stats.certificates}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Certificados Obtenidos</h3>
            <p className="text-gray-600 text-sm">Logros desbloqueados</p>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
              Tus Cursos Recientes
            </h2>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Comienza tu viaje de aprendizaje!</h3>
                <p className="text-gray-600 mb-6">Aún no te has inscrito en ningún curso. Explora nuestra amplia selección.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explorar Cursos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                  <div key={course._id} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
                    <div className="relative overflow-hidden">
                      <img
                        src={course.imagen || '/placeholder-course.svg'}
                        alt={course.titulo}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {course.progreso}%
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{course.titulo}</h3>
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progreso}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{course.progreso}% completado</span>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-gray-600">4.8</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${course._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-1 transition-all duration-300"
                      >
                        Continuar Aprendiendo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
