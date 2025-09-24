import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  StarIcon,
  TrophyIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const StudentCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0
  });

  // Datos de ejemplo realistas
  const mockCertificates = [
    {
      id: 1,
      courseName: 'Desarrollo Web Full Stack',
      instructor: 'María González',
      completionDate: '2024-01-15',
      issueDate: '2024-01-16',
      certificateId: 'CERT-2024-001',
      grade: 95,
      duration: '120 horas',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      status: 'issued',
      downloadUrl: '/certificates/cert-001.pdf',
      verificationUrl: 'https://eduunify.com/verify/CERT-2024-001',
      category: 'Desarrollo',
      level: 'Avanzado',
      creditsEarned: 12
    },
    {
      id: 2,
      courseName: 'Diseño UX/UI Avanzado',
      instructor: 'Carlos Ruiz',
      completionDate: '2024-02-20',
      issueDate: '2024-02-21',
      certificateId: 'CERT-2024-002',
      grade: 88,
      duration: '80 horas',
      skills: ['Figma', 'Adobe XD', 'Prototipado', 'Research'],
      status: 'issued',
      downloadUrl: '/certificates/cert-002.pdf',
      verificationUrl: 'https://eduunify.com/verify/CERT-2024-002',
      category: 'Diseño',
      level: 'Intermedio',
      creditsEarned: 8
    },
    {
      id: 3,
      courseName: 'Marketing Digital',
      instructor: 'Ana López',
      completionDate: '2024-03-10',
      issueDate: null,
      certificateId: 'CERT-2024-003',
      grade: 92,
      duration: '60 horas',
      skills: ['SEO', 'SEM', 'Analytics', 'Social Media'],
      status: 'pending',
      downloadUrl: null,
      verificationUrl: null,
      category: 'Marketing',
      level: 'Intermedio',
      creditsEarned: 6
    },
    {
      id: 4,
      courseName: 'Ciencia de Datos con Python',
      instructor: 'Dr. Roberto Silva',
      completionDate: '2024-03-25',
      issueDate: '2024-03-26',
      certificateId: 'CERT-2024-004',
      grade: 97,
      duration: '150 horas',
      skills: ['Python', 'Pandas', 'Machine Learning', 'Visualization'],
      status: 'issued',
      downloadUrl: '/certificates/cert-004.pdf',
      verificationUrl: 'https://eduunify.com/verify/CERT-2024-004',
      category: 'Data Science',
      level: 'Avanzado',
      creditsEarned: 15
    },
    {
      id: 5,
      courseName: 'Ciberseguridad Básica',
      instructor: 'Elena Martínez',
      completionDate: '2024-04-05',
      issueDate: '2024-04-06',
      certificateId: 'CERT-2024-005',
      grade: 85,
      duration: '40 horas',
      skills: ['Seguridad', 'Ethical Hacking', 'Firewalls', 'Encryption'],
      status: 'issued',
      downloadUrl: '/certificates/cert-005.pdf',
      verificationUrl: 'https://eduunify.com/verify/CERT-2024-005',
      category: 'Seguridad',
      level: 'Básico',
      creditsEarned: 4
    }
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      // Simular llamada a API
      setTimeout(() => {
        setCertificates(mockCertificates);
        setStats({
          total: mockCertificates.length,
          completed: mockCertificates.filter(cert => cert.status === 'issued').length,
          inProgress: mockCertificates.filter(cert => cert.status === 'pending').length
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setLoading(false);
    }
  };

  const handleDownload = (certificate) => {
    if (certificate.downloadUrl) {
      // Simular descarga
      const link = document.createElement('a');
      link.href = certificate.downloadUrl;
      link.download = `certificado-${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`📥 Descargando certificado: ${certificate.courseName}`);
    }
  };

  const handleShare = (certificate) => {
    if (navigator.share && certificate.verificationUrl) {
      navigator.share({
        title: `🎓 Certificado - ${certificate.courseName}`,
        text: `¡He completado el curso ${certificate.courseName} en EduUnify! 🚀`,
        url: certificate.verificationUrl
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(certificate.verificationUrl || 'URL no disponible');
      alert('🔗 Enlace copiado al portapapeles');
    }
  };

  const handleView = (certificate) => {
    // Abrir modal o nueva ventana para ver el certificado
    window.open(`/certificate-preview/${certificate.id}`, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'issued':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            ✅ Emitido
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200">
            <ClockIcon className="w-3 h-3 mr-1" />
            ⏳ Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  const getLevelBadge = (level) => {
    const levelConfig = {
      'Básico': { color: 'from-blue-100 to-cyan-100', textColor: 'text-blue-700', emoji: '🌱' },
      'Intermedio': { color: 'from-green-100 to-emerald-100', textColor: 'text-green-700', emoji: '🌿' },
      'Avanzado': { color: 'from-purple-100 to-indigo-100', textColor: 'text-purple-700', emoji: '🌳' }
    };
    
    const config = levelConfig[level] || levelConfig['Básico'];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${config.color} ${config.textColor} border border-opacity-20`}>
        {config.emoji} {level}
      </span>
    );
  };

  const getGradeColor = (grade) => {
    if (grade >= 95) return 'text-emerald-600';
    if (grade >= 90) return 'text-green-600';
    if (grade >= 85) return 'text-yellow-600';
    if (grade >= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || cert.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, emoji }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl">{emoji}</span>
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-green-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="mt-6 text-emerald-600 font-bold text-lg">🎓 Cargando tus certificados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              🎓 Mis Certificados
            </h1>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            ✨ Tus logros académicos y certificaciones obtenidas
          </p>
        </div>

        {/* Achievement Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">🏆 ¡Felicitaciones!</h3>
                <p className="text-white/90">Has obtenido {stats.completed} certificados de {stats.total} cursos</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                ))}
              </div>
              <p className="text-sm text-white/80">Estudiante Certificado</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={AcademicCapIcon}
            title="Total de Certificados"
            value={stats.total}
            subtitle="Cursos completados"
            emoji="🎓"
            gradient="from-emerald-500 to-green-600"
          />
          <StatCard
            icon={CheckCircleIcon}
            title="Certificados Emitidos"
            value={stats.completed}
            subtitle="Listos para descargar"
            emoji="✅"
            gradient="from-green-500 to-teal-600"
          />
          <StatCard
            icon={ClockIcon}
            title="En Proceso"
            value={stats.inProgress}
            subtitle="Pendientes de emisión"
            emoji="⏳"
            gradient="from-teal-500 to-cyan-600"
          />
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="🔍 Buscar por curso, instructor o habilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                📋 Todos
              </button>
              <button
                onClick={() => setSelectedFilter('issued')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedFilter === 'issued'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                ✅ Emitidos
              </button>
              <button
                onClick={() => setSelectedFilter('pending')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedFilter === 'pending'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                ⏳ Pendientes
              </button>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCertificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Certificate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AcademicCapIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{certificate.courseName}</h3>
                    <p className="text-sm text-gray-600">👨‍🏫 {certificate.instructor}</p>
                  </div>
                </div>
                {getStatusBadge(certificate.status)}
              </div>

              {/* Certificate Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-600">
                      📅 Completado: {new Date(certificate.completionDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {getLevelBadge(certificate.level)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">⏱️ Duración: {certificate.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className={`text-sm font-bold ${getGradeColor(certificate.grade)}`}>
                      ⭐ {certificate.grade}/100
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="w-4 h-4 text-teal-600" />
                  <span className="text-sm text-gray-600">🎯 Créditos: {certificate.creditsEarned}</span>
                </div>

                {certificate.certificateId && (
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600 font-mono">🔐 ID: {certificate.certificateId}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-2">🛠️ Habilidades Adquiridas:</h4>
                <div className="flex flex-wrap gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {certificate.status === 'issued' && (
                  <>
                    <button
                      onClick={() => handleView(certificate)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>👁️ Ver</span>
                    </button>
                    <button
                      onClick={() => handleDownload(certificate)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      <span>📥 Descargar</span>
                    </button>
                    <button
                      onClick={() => handleShare(certificate)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span>🔗 Compartir</span>
                    </button>
                  </>
                )}
                {certificate.status === 'pending' && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-xl border border-yellow-200">
                    <ClockIcon className="w-4 h-4" />
                    <span>⏳ Procesando certificado...</span>
                  </div>
                )}
                {certificate.verificationUrl && (
                  <button
                    onClick={() => window.open(certificate.verificationUrl, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                    <span>🌐 Verificar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AcademicCapIcon className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 No se encontraron certificados</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Intenta ajustar tus filtros de búsqueda' 
                : 'Completa tus primeros cursos para obtener certificados'}
            </p>
            {(!searchTerm && selectedFilter === 'all') && (
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                🚀 Explorar Cursos
              </button>
            )}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-br from-white via-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">💡 Información Importante</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">✅ Certificados Verificables</h4>
                  <p className="text-sm text-gray-600">Todos nuestros certificados incluyen un código único de verificación</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <LinkIcon className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">🔗 Compartir en LinkedIn</h4>
                  <p className="text-sm text-gray-600">Agrega tus certificados directamente a tu perfil profesional</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ArrowDownTrayIcon className="w-5 h-5 text-teal-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">📥 Descarga Ilimitada</h4>
                  <p className="text-sm text-gray-600">Descarga tus certificados en formato PDF las veces que necesites</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <GlobeAltIcon className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900">🌐 Reconocimiento Global</h4>
                  <p className="text-sm text-gray-600">Certificados reconocidos por empresas e instituciones internacionales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentCertificates;
