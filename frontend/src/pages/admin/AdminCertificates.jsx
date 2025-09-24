import React, { useState, useMemo } from "react";
import AdminLayout from "../../layout/AdminLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SearchAndFilter from "../../components/ui/SearchAndFilter";
import CertificateStats from "../../components/certificates/CertificateStats";
import DataTable from "../../components/ui/DataTable";
import { useApi } from "../../hooks/useApi";
import { useSearch } from "../../hooks/useSearch";
import { API_ROUTES, CERTIFICATE_STATUS } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import {
  AcademicCapIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  CheckCircleIcon,
  ClockIcon,
  BellIcon,
  CogIcon,
  PlusIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const AdminCertificates = () => {

  // Usar hooks personalizados para la gestión de datos
  const {
    data: certificatesResponse = {},
    loading,
    error,
    refetch,
  } = useApi(`${API_ROUTES.CERTIFICATES}/admin/todos`);
  const { data: statsData = {} } = useApi(
    `${API_ROUTES.CERTIFICATES}/admin/stats`
  );

  // Extraer los certificados de la respuesta y mapear los datos
  const certificatesData = useMemo(() => {
    if (!certificatesResponse || !certificatesResponse.data || !Array.isArray(certificatesResponse.data)) return [];

    return certificatesResponse.data.map((cert) => {
      if (!cert) return null;
      
      return {
        id: cert._id || '',
        studentName: cert.estudiante_id?.nombre || "N/A",
        studentEmail: cert.estudiante_id?.correo || "N/A",
        courseName: cert.curso_id?.titulo || "N/A",
        certificateId: cert.codigo_verificacion || '',
        status:
          cert.estado === "activo"
            ? "issued"
            : cert.estado === "revocado"
            ? "revoked"
            : "pending",
        issueDate: cert.fecha_emision || '',
        grade: cert.calificacion_final || 0,
        downloadUrl: cert.url_certificado || '',
        verificationUrl: `/verify/${cert.codigo_verificacion || ''}`,
        metadata: cert.metadata || {},
      };
    }).filter(Boolean);
  }, [certificatesResponse]);

  // Mapear las estadísticas del backend al formato esperado por CertificateStats
  const mappedStatsData = useMemo(() => {
    if (!statsData || !statsData.data) return {};
    
    const stats = statsData.data;
    return {
      issued: stats.activos || 0,
      pending: 0, // No hay estado pendiente en el backend actual
      students: stats.activos || 0, // Aproximación: cada certificado activo = 1 estudiante
      courses: stats.porCurso?.length || 0,
      total: stats.total || 0,
      revoked: stats.revocados || 0,
      recent: stats.recientes || 0,
      averageGrade: stats.calificacionPromedio || 0
    };
  }, [statsData]);

  // Hook para búsqueda y filtros
  const searchConfig = useMemo(
    () => ({
      searchFields: ["studentName", "courseName", "certificateId"],
      filterFields: {
        status: "all",
        course: "all",
      },
    }),
    []
  );

  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
    filteredData: filteredCertificates,
  } = useSearch(certificatesData, searchConfig);

  // Estados para modales y loading local
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    layout: "classic",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    logoPosition: "top-left",
    includeQR: true,
    includeSignature: true,
  });
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Plantilla Clásica",
      description: "Diseño tradicional y elegante",
      layout: "classic",
      createdAt: "2024-01-15",
      isActive: true,
    },
    {
      id: 2,
      name: "Plantilla Moderna",
      description: "Diseño contemporáneo y minimalista",
      layout: "modern",
      createdAt: "2024-02-10",
      isActive: true,
    },
    {
      id: 3,
      name: "Plantilla Corporativa",
      description: "Diseño profesional para empresas",
      layout: "elegant",
      createdAt: "2024-03-05",
      isActive: false,
    },
  ]);
  const [alertsConfig, setAlertsConfig] = useState({
    emailNotifications: true,
    smsNotifications: false,
    expirationReminder: {
      enabled: true,
      daysBefore: 30,
    },
    completionNotification: {
      enabled: true,
      sendToStudent: true,
      sendToInstructor: true,
    },
    bulkIssuance: {
      enabled: false,
      batchSize: 50,
    },
  });
  const [systemConfig, setSystemConfig] = useState({
    autoIssuance: {
      enabled: true,
      requiresApproval: false,
    },
    issuanceCriteria: {
      minimumScore: 80,
      completionRequired: true,
      attendanceRequired: 90,
    },
    certificateValidity: {
      hasExpiration: true,
      validityPeriod: 365,
      renewalAllowed: true,
    },
    securitySettings: {
      digitalSignature: true,
      blockchainVerification: false,
      qrCodeVerification: true,
    },
    branding: {
      institutionName: "Academia Digital",
      logoUrl: "",
      primaryColor: "#1f2937",
      secondaryColor: "#3b82f6",
    },
  });

  // Configuración de columnas para la tabla de certificados
  const certificateColumns = [
    {
      key: "studentName",
      label: "Estudiante",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10">
            <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {value.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.studentEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: "courseName",
      label: "Curso",
      sortable: true,
    },
    {
      key: "certificateId",
      label: "ID Certificado",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === CERTIFICATE_STATUS.ISSUED
              ? "bg-green-100 text-green-800"
              : value === CERTIFICATE_STATUS.PENDING
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}>
          {value === CERTIFICATE_STATUS.ISSUED
            ? "Emitido"
            : value === CERTIFICATE_STATUS.PENDING
            ? "Pendiente"
            : "Revocado"}
        </span>
      ),
    },
    {
      key: "issueDate",
      label: "Fecha Emisión",
      sortable: true,
      render: (value) => (value ? formatDate(value) : "Pendiente"),
    },
    {
      key: "grade",
      label: "Calificación",
      sortable: true,
      render: (value) => (
        <span
          className={`font-semibold ${
            value >= 90
              ? "text-green-600"
              : value >= 80
              ? "text-blue-600"
              : value >= 70
              ? "text-yellow-600"
              : "text-red-600"
          }`}>
          {value}%
        </span>
      ),
    },
  ];

  // Los datos se cargan automáticamente desde la API a través del hook useApi

  // Funciones de manejo de acciones
  const handleGenerateCertificate = async (certificate) => {
    try {
      // Simular generación de certificado
      await new Promise((resolve) => setTimeout(resolve, 2000));
      refetch(); // Recargar datos después de generar
      alert(
        `Certificado generado exitosamente para ${certificate.studentName}`
      );
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error al generar el certificado");
    }
  };

  const handleShareCertificate = (certificate) => {
    if (certificate.status === CERTIFICATE_STATUS.ISSUED) {
      const shareData = {
        title: `Certificado de ${certificate.courseName}`,
        text: `${certificate.studentName} ha completado exitosamente el curso ${certificate.courseName}`,
        url: certificate.verificationUrl,
      };

      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(certificate.verificationUrl);
        alert("Enlace de verificación copiado al portapapeles");
      }
    } else {
      alert("El certificado aún no ha sido generado");
    }
  };

  const handleDownloadCertificate = (certificate) => {
    if (certificate.downloadUrl) {
      // Simular descarga
      const link = document.createElement("a");
      link.href = certificate.downloadUrl;
      link.download = `certificado-${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert(`Descargando certificado de ${certificate.studentName}`);
    } else {
      alert("El certificado aún no está disponible para descarga");
    }
  };

  const handleViewCertificate = (certificate) => {
    // Abrir modal o nueva ventana para ver el certificado
    if (certificate.status === "issued") {
      window.open(`/certificate-preview/${certificate.id}`, "_blank");
    } else {
      alert("El certificado aún no ha sido generado");
    }
  };

  const handleDeleteCertificate = async (certificate) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el certificado de ${certificate.studentName}?`
      )
    ) {
      try {
        setIsProcessing(true);
        // Simular eliminación
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Actualizar datos desde la API después de eliminar
        refetch();
        alert(
          `Certificado de ${certificate.studentName} eliminado exitosamente`
        );
      } catch (error) {
        console.error("Error deleting certificate:", error);
        alert("Error al eliminar el certificado");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSendEmail = async (certificate) => {
    if (certificate.status !== "issued") {
      alert("El certificado debe estar generado antes de enviarlo por email");
      return;
    }

    try {
      setIsProcessing(true);
      // Simular envío de email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`Certificado enviado por email a ${certificate.studentEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error al enviar el certificado por email");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkGenerate = async () => {
    const pendingCertificates = (certificatesData || []).filter(
      (cert) => cert.status === "pending"
    );

    if (pendingCertificates.length === 0) {
      alert("No hay certificados pendientes para generar");
      return;
    }

    if (
      window.confirm(
        `¿Generar ${pendingCertificates.length} certificados pendientes?`
      )
    ) {
      try {
        setIsProcessing(true);
        // Simular generación masiva
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Actualizar datos desde la API después de la generación masiva
        refetch();
        alert(
          `${pendingCertificates.length} certificados generados exitosamente`
        );
      } catch (error) {
        console.error("Error in bulk generation:", error);
        alert("Error en la generación masiva de certificados");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCreateTemplate = () => {
    setShowCreateModal(true);
  };

  const handleManageTemplates = () => {
    setShowTemplatesModal(true);
  };

  const handleConfigureAlerts = () => {
    setShowAlertsModal(true);
  };

  const handleConfigureSystem = () => {
    setShowSystemModal(true);
  };

  const handleTemplateFormChange = (field, value) => {
    setTemplateForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateTemplateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Aquí se enviaría la plantilla al backend
      console.log("Creating template:", templateForm);
      alert("Plantilla creada exitosamente");
      setShowCreateModal(false);
      setTemplateForm({
        name: "",
        description: "",
        layout: "classic",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        logoPosition: "top-left",
        includeQR: true,
        includeSignature: true,
      });
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Error al crear la plantilla");
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta plantilla?")
    ) {
      setTemplates((prev) =>
        prev.filter((template) => template.id !== templateId)
      );
      alert("Plantilla eliminada exitosamente");
    }
  };

  const handleToggleTemplate = (templateId) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const handleAlertsConfigChange = (field, value) => {
    setAlertsConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedAlertsConfigChange = (section, field, value) => {
    setAlertsConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveAlertsConfig = () => {
    try {
      console.log("Saving alerts configuration:", alertsConfig);
      alert("Configuración de alertas guardada exitosamente");
      setShowAlertsModal(false);
    } catch (error) {
      console.error("Error saving alerts config:", error);
      alert("Error al guardar la configuración de alertas");
    }
  };

  const handleSystemConfigChange = (field, value) => {
    setSystemConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedSystemConfigChange = (section, field, value) => {
    setSystemConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveSystemConfig = () => {
    try {
      console.log("Saving system configuration:", systemConfig);
      alert("Configuración del sistema guardada exitosamente");
      setShowSystemModal(false);
    } catch (error) {
      console.error("Error saving system config:", error);
      alert("Error al guardar la configuración del sistema");
    }
  };

  // Configuración de filtros para SearchAndFilter
  const filterOptions = [
    {
      key: "status",
      label: "Estado",
      options: [
        { value: "all", label: "Todos" },
        { value: CERTIFICATE_STATUS.ISSUED, label: "Emitidos" },
        { value: CERTIFICATE_STATUS.PENDING, label: "Pendientes" },
        { value: CERTIFICATE_STATUS.REVOKED, label: "Revocados" },
      ],
    },
    {
      key: "course",
      label: "Curso",
      options: [
        { value: "all", label: "Todos los cursos" },
        ...Array.from(
          new Set((certificatesData || []).map((cert) => cert.courseName))
        ).map((course) => ({ value: course, label: course })),
      ],
    },
  ];

  if (loading || isProcessing) {
    return (
      <AdminLayout>
        <LoadingSpinner
          size="large"
          fullScreen
          text={loading ? "Cargando certificados..." : "Procesando..."}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="relative p-8 mb-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 rounded-2xl border border-purple-100 shadow-lg">
          <div className="absolute top-4 right-4 opacity-10">
            <AcademicCapIcon className="w-32 h-32 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex justify-center items-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
                    📜 Gestión de Certificados
                  </h1>
                  <p className="mt-2 text-lg font-medium text-gray-600">
                    Administra y supervisa todos los certificados de la
                    plataforma
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <ClockIcon className="mr-1 w-4 h-4" />
                    <span>
                      Última actualización: {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => refetch()}
                  className="flex justify-center items-center px-6 py-3 space-x-2 font-semibold text-purple-700 bg-white rounded-xl border-2 border-purple-200 transition-all duration-200 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md">
                  <ClockIcon className="w-5 h-5" />
                  <span>Actualizar</span>
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="flex items-center justify-center px-6 py-3 space-x-2 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5">
                  <PlusIcon className="w-5 h-5" />
                  <span>Crear Plantilla</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <CertificateStats stats={mappedStatsData} variant="admin" />

        {/* Filters and Search */}
        <div className="relative p-6 mb-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl border border-gray-200 shadow-lg">
          <div className="absolute top-4 right-4 opacity-5">
            <DocumentTextIcon className="w-24 h-24 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                🔍 Filtros y Búsqueda
              </h3>
            </div>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <SearchAndFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="🔍 Buscar por estudiante, curso o ID..."
                filters={filterOptions}
                activeFilters={filters}
                onFilterChange={setFilter}
                onClearFilters={clearFilters}
                filterCount={
                  Object.values(filters).filter((f) => f !== "all").length
                }
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBulkGenerate}
                  className="flex items-center px-6 py-3 space-x-2 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl transform hover:-translate-y-0.5">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>✨ Generar Pendientes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Table */}
        <DataTable
          columns={certificateColumns}
          data={filteredCertificates}
          actions={[
            {
              icon: EyeIcon,
              label: "Ver",
              onClick: (certificate) => handleViewCertificate(certificate),
              className: "text-blue-600 hover:text-blue-900",
            },
            {
              icon: ArrowDownTrayIcon,
              label: "Descargar",
              onClick: (certificate) => handleDownloadCertificate(certificate),
              className: "text-green-600 hover:text-green-900",
              show: (certificate) =>
                certificate.status === CERTIFICATE_STATUS.ISSUED,
            },
            {
              icon: CheckCircleIcon,
              label: "Generar",
              onClick: (certificate) => handleGenerateCertificate(certificate),
              className: "text-yellow-600 hover:text-yellow-900",
              show: (certificate) =>
                certificate.status === CERTIFICATE_STATUS.PENDING,
            },
            {
              icon: ShareIcon,
              label: "Compartir",
              onClick: (certificate) => handleShareCertificate(certificate),
              className: "text-purple-600 hover:text-purple-900",
            },
          ]}
          emptyMessage="No se encontraron certificados"
          emptyIcon={AcademicCapIcon}
        />

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="flex items-center mb-6">
            <div className="flex justify-center items-center mr-3 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <CogIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              ⚡ Acciones Rápidas
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-100 shadow-lg transition-all duration-300 group hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-4 right-4 opacity-10 transition-opacity group-hover:opacity-20">
                <DocumentTextIcon className="w-16 h-16 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4 space-x-3">
                  <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    📄 Plantillas
                  </h3>
                </div>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Gestiona las plantillas de certificados disponibles y crea
                  nuevos diseños personalizados
                </p>
                <button
                  onClick={handleManageTemplates}
                  className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5">
                  Gestionar Plantillas
                </button>
              </div>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-yellow-50 via-white to-orange-50 rounded-2xl border border-yellow-100 shadow-lg transition-all duration-300 group hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-4 right-4 opacity-10 transition-opacity group-hover:opacity-20">
                <BellIcon className="w-16 h-16 text-yellow-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4 space-x-3">
                  <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                    <BellIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    🔔 Notificaciones
                  </h3>
                </div>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Configura notificaciones automáticas para certificados y
                  alertas de vencimiento
                </p>
                <button
                  onClick={handleConfigureAlerts}
                  className="w-full px-6 py-3 text-white bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-yellow-600 hover:to-orange-700 hover:shadow-xl transform hover:-translate-y-0.5">
                  Configurar Alertas
                </button>
              </div>
            </div>

            <div className="relative p-6 bg-gradient-to-br from-gray-50 via-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 group to-slate-50 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-4 right-4 opacity-10 transition-opacity group-hover:opacity-20">
                <CogIcon className="w-16 h-16 text-gray-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4 space-x-3">
                  <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-gray-500 rounded-xl shadow-lg to-slate-600">
                    <CogIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    ⚙️ Configuración
                  </h3>
                </div>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Ajusta los criterios de emisión de certificados y
                  configuraciones del sistema
                </p>
                <button
                  onClick={handleConfigureSystem}
                  className="w-full px-6 py-3 text-white bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:from-gray-600 hover:to-slate-700 hover:shadow-xl transform hover:-translate-y-0.5">
                  Configurar Sistema
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Crear Plantilla */}
        {showCreateModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Crear Nueva Plantilla
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateTemplateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Nombre de la Plantilla
                    </label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) =>
                        handleTemplateFormChange("name", e.target.value)
                      }
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Diseño
                    </label>
                    <select
                      value={templateForm.layout}
                      onChange={(e) =>
                        handleTemplateFormChange("layout", e.target.value)
                      }
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="classic">Clásico</option>
                      <option value="modern">Moderno</option>
                      <option value="elegant">Elegante</option>
                      <option value="minimal">Minimalista</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={templateForm.description}
                    onChange={(e) =>
                      handleTemplateFormChange("description", e.target.value)
                    }
                    rows={3}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Color de Fondo
                    </label>
                    <input
                      type="color"
                      value={templateForm.backgroundColor}
                      onChange={(e) =>
                        handleTemplateFormChange(
                          "backgroundColor",
                          e.target.value
                        )
                      }
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Color de Texto
                    </label>
                    <input
                      type="color"
                      value={templateForm.textColor}
                      onChange={(e) =>
                        handleTemplateFormChange("textColor", e.target.value)
                      }
                      className="w-full h-10 rounded-lg border border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Posición del Logo
                  </label>
                  <select
                    value={templateForm.logoPosition}
                    onChange={(e) =>
                      handleTemplateFormChange("logoPosition", e.target.value)
                    }
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="top-left">Superior Izquierda</option>
                    <option value="top-center">Superior Centro</option>
                    <option value="top-right">Superior Derecha</option>
                    <option value="center">Centro</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeQR"
                      checked={templateForm.includeQR}
                      onChange={(e) =>
                        handleTemplateFormChange("includeQR", e.target.checked)
                      }
                      className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="includeQR"
                      className="block ml-2 text-sm text-gray-900">
                      Incluir código QR de verificación
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeSignature"
                      checked={templateForm.includeSignature}
                      onChange={(e) =>
                        handleTemplateFormChange(
                          "includeSignature",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="includeSignature"
                      className="block ml-2 text-sm text-gray-900">
                      Incluir firma digital
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                    Crear Plantilla
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Gestión de Plantillas */}
        {showTemplatesModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestionar Plantillas
                </h2>
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex gap-3 items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {template.name}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              template.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                            {template.isActive ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                        <p className="mb-2 text-gray-600">
                          {template.description}
                        </p>
                        <div className="flex gap-4 items-center text-sm text-gray-500">
                          <span>Diseño: {template.layout}</span>
                          <span>Creada: {template.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center ml-4">
                        <button
                          onClick={() => handleToggleTemplate(template.id)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            template.isActive
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          }`}>
                          {template.isActive ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-md transition-colors hover:bg-red-200">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowTemplatesModal(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-md transition-colors hover:bg-gray-600">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configuración de Alertas */}
        {showAlertsModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Configurar Alertas
                </h2>
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Notificaciones Generales */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Notificaciones Generales
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Notificaciones por Email
                      </label>
                      <input
                        type="checkbox"
                        checked={alertsConfig.emailNotifications}
                        onChange={(e) =>
                          handleAlertsConfigChange(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Notificaciones por SMS
                      </label>
                      <input
                        type="checkbox"
                        checked={alertsConfig.smsNotifications}
                        onChange={(e) =>
                          handleAlertsConfigChange(
                            "smsNotifications",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Recordatorios de Expiración */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Recordatorios de Expiración
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Habilitar Recordatorios
                      </label>
                      <input
                        type="checkbox"
                        checked={alertsConfig.expirationReminder.enabled}
                        onChange={(e) =>
                          handleNestedAlertsConfigChange(
                            "expirationReminder",
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    {alertsConfig.expirationReminder.enabled && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Días antes de expiración
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={alertsConfig.expirationReminder.daysBefore}
                          onChange={(e) =>
                            handleNestedAlertsConfigChange(
                              "expirationReminder",
                              "daysBefore",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Notificaciones de Finalización */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Notificaciones de Finalización
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Habilitar Notificaciones
                      </label>
                      <input
                        type="checkbox"
                        checked={alertsConfig.completionNotification.enabled}
                        onChange={(e) =>
                          handleNestedAlertsConfigChange(
                            "completionNotification",
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    {alertsConfig.completionNotification.enabled && (
                      <>
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            Notificar al Estudiante
                          </label>
                          <input
                            type="checkbox"
                            checked={
                              alertsConfig.completionNotification.sendToStudent
                            }
                            onChange={(e) =>
                              handleNestedAlertsConfigChange(
                                "completionNotification",
                                "sendToStudent",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-gray-700">
                            Notificar al Instructor
                          </label>
                          <input
                            type="checkbox"
                            checked={
                              alertsConfig.completionNotification
                                .sendToInstructor
                            }
                            onChange={(e) =>
                              handleNestedAlertsConfigChange(
                                "completionNotification",
                                "sendToInstructor",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Emisión Masiva */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Emisión Masiva
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Habilitar Emisión Masiva
                      </label>
                      <input
                        type="checkbox"
                        checked={alertsConfig.bulkIssuance.enabled}
                        onChange={(e) =>
                          handleNestedAlertsConfigChange(
                            "bulkIssuance",
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    {alertsConfig.bulkIssuance.enabled && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Tamaño del lote
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={alertsConfig.bulkIssuance.batchSize}
                          onChange={(e) =>
                            handleNestedAlertsConfigChange(
                              "bulkIssuance",
                              "batchSize",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowAlertsModal(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-md transition-colors hover:bg-gray-600">
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAlertsConfig}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700">
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Configuración del Sistema */}
        {showSystemModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Configuración del Sistema
                </h2>
                <button
                  onClick={() => setShowSystemModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Emisión Automática */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Emisión Automática
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Habilitar Emisión Automática
                      </label>
                      <input
                        type="checkbox"
                        checked={systemConfig.autoIssuance.enabled}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "autoIssuance",
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Requiere Aprobación Manual
                      </label>
                      <input
                        type="checkbox"
                        checked={systemConfig.autoIssuance.requiresApproval}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "autoIssuance",
                            "requiresApproval",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Criterios de Emisión */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Criterios de Emisión
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Puntuación Mínima (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={systemConfig.issuanceCriteria.minimumScore}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "issuanceCriteria",
                            "minimumScore",
                            parseInt(e.target.value)
                          )
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Asistencia Mínima (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={systemConfig.issuanceCriteria.attendanceRequired}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "issuanceCriteria",
                            "attendanceRequired",
                            parseInt(e.target.value)
                          )
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">
                          Completación del Curso Requerida
                        </label>
                        <input
                          type="checkbox"
                          checked={
                            systemConfig.issuanceCriteria.completionRequired
                          }
                          onChange={(e) =>
                            handleNestedSystemConfigChange(
                              "issuanceCriteria",
                              "completionRequired",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validez del Certificado */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Validez del Certificado
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Certificados con Expiración
                      </label>
                      <input
                        type="checkbox"
                        checked={systemConfig.certificateValidity.hasExpiration}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "certificateValidity",
                            "hasExpiration",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    {systemConfig.certificateValidity.hasExpiration && (
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Período de Validez (días)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={
                            systemConfig.certificateValidity.validityPeriod
                          }
                          onChange={(e) =>
                            handleNestedSystemConfigChange(
                              "certificateValidity",
                              "validityPeriod",
                              parseInt(e.target.value)
                            )
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Permitir Renovación
                      </label>
                      <input
                        type="checkbox"
                        checked={
                          systemConfig.certificateValidity.renewalAllowed
                        }
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "certificateValidity",
                            "renewalAllowed",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración de Seguridad */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Configuración de Seguridad
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Firma Digital
                      </label>
                      <input
                        type="checkbox"
                        checked={systemConfig.securitySettings.digitalSignature}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "securitySettings",
                            "digitalSignature",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Verificación Blockchain
                      </label>
                      <input
                        type="checkbox"
                        checked={
                          systemConfig.securitySettings.blockchainVerification
                        }
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "securitySettings",
                            "blockchainVerification",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-gray-700">
                        Verificación por Código QR
                      </label>
                      <input
                        type="checkbox"
                        checked={
                          systemConfig.securitySettings.qrCodeVerification
                        }
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "securitySettings",
                            "qrCodeVerification",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración de Marca */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Configuración de Marca
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nombre de la Institución
                      </label>
                      <input
                        type="text"
                        value={systemConfig.branding.institutionName}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "branding",
                            "institutionName",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        URL del Logo
                      </label>
                      <input
                        type="url"
                        value={systemConfig.branding.logoUrl}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "branding",
                            "logoUrl",
                            e.target.value
                          )
                        }
                        placeholder="https://ejemplo.com/logo.png"
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Color Primario
                      </label>
                      <input
                        type="color"
                        value={systemConfig.branding.primaryColor}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "branding",
                            "primaryColor",
                            e.target.value
                          )
                        }
                        className="w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Color Secundario
                      </label>
                      <input
                        type="color"
                        value={systemConfig.branding.secondaryColor}
                        onChange={(e) =>
                          handleNestedSystemConfigChange(
                            "branding",
                            "secondaryColor",
                            e.target.value
                          )
                        }
                        className="w-full h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowSystemModal(false)}
                  className="px-4 py-2 text-white bg-gray-500 rounded-md transition-colors hover:bg-gray-600">
                  Cancelar
                </button>
                <button
                  onClick={handleSaveSystemConfig}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700">
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCertificates;
