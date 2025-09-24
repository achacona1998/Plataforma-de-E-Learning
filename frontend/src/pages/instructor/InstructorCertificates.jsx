import React, { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import InstructorLayout from "../../layout/InstructorLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SearchAndFilter from "../../components/ui/SearchAndFilter";
import CertificateStats from "../../components/certificates/CertificateStats";
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
  PlusIcon,
} from "@heroicons/react/24/outline";

const InstructorCertificates = () => {
  const { user } = useAuth();

  // Usar hooks personalizados para la gestión de datos
  const {
    data: certificatesData = [],
    loading,
    error,
    refetch,
  } = useApi(`${API_ROUTES.CERTIFICATES}/instructor`);
  const { data: statsData = {} } = useApi(
    `${API_ROUTES.CERTIFICATES}/instructor/stats`
  );

  // Hook para búsqueda y filtros
  const searchConfig = useMemo(() => ({
    searchFields: ["studentName", "courseName", "certificateId"],
    filterFields: {
      status: "all",
      course: "all",
    },
  }), []);
  
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
    filteredData: filteredCertificates,
  } = useSearch(certificatesData, searchConfig);

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
          new Set(certificatesData.map((cert) => cert.courseName))
        ).map((course) => ({ value: course, label: course })),
      ],
    },
  ];

  // Datos de ejemplo realistas para instructor (esto se reemplazará con datos reales del API)
  const mockCertificates = [
    {
      id: 1,
      studentName: "Ana García Martínez",
      studentEmail: "ana.garcia@email.com",
      courseName: "Desarrollo Web Full Stack",
      instructor: user?.name || "Instructor",
      completionDate: "2024-01-15",
      issueDate: "2024-01-16",
      certificateId: "CERT-2024-001",
      grade: 95,
      duration: "120 horas",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      status: "issued",
      downloadUrl: "/certificates/cert-001.pdf",
      verificationUrl: "https://eduunify.com/verify/CERT-2024-001",
      progress: 100,
    },
    {
      id: 2,
      studentName: "Carlos Ruiz López",
      studentEmail: "carlos.ruiz@email.com",
      courseName: "Desarrollo Web Full Stack",
      instructor: user?.name || "Instructor",
      completionDate: "2024-02-20",
      issueDate: "2024-02-21",
      certificateId: "CERT-2024-002",
      grade: 88,
      duration: "120 horas",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      status: "issued",
      downloadUrl: "/certificates/cert-002.pdf",
      verificationUrl: "https://eduunify.com/verify/CERT-2024-002",
      progress: 100,
    },
    {
      id: 3,
      studentName: "Laura Fernández",
      studentEmail: "laura.fernandez@email.com",
      courseName: "Desarrollo Web Full Stack",
      instructor: user?.name || "Instructor",
      completionDate: "2024-03-10",
      issueDate: null,
      certificateId: "CERT-2024-003",
      grade: 92,
      duration: "120 horas",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      status: "pending",
      downloadUrl: null,
      verificationUrl: null,
      progress: 100,
    },
    {
      id: 4,
      studentName: "Miguel Torres",
      studentEmail: "miguel.torres@email.com",
      courseName: "Diseño UX/UI Avanzado",
      instructor: user?.name || "Instructor",
      completionDate: "2024-03-15",
      issueDate: "2024-03-16",
      certificateId: "CERT-2024-004",
      grade: 91,
      duration: "80 horas",
      skills: ["Figma", "Adobe XD", "Prototipado", "Research"],
      status: "issued",
      downloadUrl: "/certificates/cert-004.pdf",
      verificationUrl: "https://eduunify.com/verify/CERT-2024-004",
      progress: 100,
    },
  ];

  // Funciones de manejo de acciones
  const handleApproveCertificate = async (certificateId) => {
    try {
      // Simular aprobación de certificado
      await new Promise((resolve) => setTimeout(resolve, 1000));
      refetch(); // Recargar datos después de aprobar
      alert("Certificado aprobado exitosamente");
    } catch (error) {
      console.error("Error approving certificate:", error);
      alert("Error al aprobar el certificado");
    }
  };

  const handleGenerateCertificate = async (certificateId) => {
    try {
      // Simular generación de certificado
      await new Promise((resolve) => setTimeout(resolve, 1000));
      refetch(); // Recargar datos después de generar
      alert("Certificado generado exitosamente");
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Error al generar el certificado");
    }
  };

  const handleBulkGenerate = async () => {
    const pendingCertificates = filteredCertificates.filter(
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
        // Simular generación masiva
        await new Promise((resolve) => setTimeout(resolve, 3000));
        refetch(); // Recargar datos después de la generación masiva
        alert(
          `${pendingCertificates.length} certificados generados exitosamente`
        );
      } catch (error) {
        console.error("Error in bulk generation:", error);
        alert("Error en la generación masiva de certificados");
      }
    }
  };

  const handleViewCertificate = (certificate) => {
    // Abrir modal o nueva ventana para ver el certificado
    window.open(`/certificates/view/${certificate.certificateId}`, "_blank");
  };

  const handleDownloadCertificate = (certificate) => {
    // Descargar el certificado
    const link = document.createElement("a");
    link.href = certificate.downloadUrl || "#";
    link.download = `certificado-${certificate.certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareCertificate = (certificate) => {
    // Copiar enlace de verificación al portapapeles
    if (certificate.verificationUrl) {
      navigator.clipboard
        .writeText(certificate.verificationUrl)
        .then(() => {
          alert("Enlace de verificación copiado al portapapeles");
        })
        .catch(() => {
          alert("Error al copiar el enlace");
        });
    }
  };

  // Configuración de columnas para la tabla
  const certificateColumns = [
    {
      key: "studentName",
      label: "Estudiante",
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: "courseName",
      label: "Curso",
      render: (value) => <div className="text-sm text-gray-900">{value}</div>,
    },
    {
      key: "grade",
      label: "Calificación",
      render: (value) => (
        <span
          className={`text-sm font-medium ${
            value >= 90
              ? "text-green-600"
              : value >= 80
              ? "text-yellow-600"
              : "text-red-600"
          }`}>
          {value}%
        </span>
      ),
    },
    {
      key: "completionDate",
      label: "Fecha Completado",
      render: (value) => formatDate(value),
    },
    {
      key: "status",
      label: "Estado",
      render: (value) => {
        const statusConfig = {
          [CERTIFICATE_STATUS.ISSUED]: {
            color: "bg-green-100 text-green-800",
            text: "Emitido",
          },
          [CERTIFICATE_STATUS.PENDING]: {
            color: "bg-yellow-100 text-yellow-800",
            text: "Pendiente",
          },
          [CERTIFICATE_STATUS.REJECTED]: {
            color: "bg-red-100 text-red-800",
            text: "Rechazado",
          },
        };

        const config =
          statusConfig[value] || statusConfig[CERTIFICATE_STATUS.PENDING];
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
            {config.text}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSpinner />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Certificados de Mis Cursos
            </h1>
            <p className="mt-2 text-gray-600">
              Gestiona los certificados de tus estudiantes
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBulkGenerate}
              className="flex items-center px-4 py-2 space-x-2 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700">
              <CheckCircleIcon className="w-4 h-4" />
              <span>Generar Pendientes</span>
            </button>
            <button
              onClick={() => (window.location.href = "/instructor/courses")}
              className="flex items-center px-6 py-3 space-x-2 text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700">
              <PlusIcon className="w-5 h-5" />
              <span>Mis Cursos</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <CertificateStats stats={stats} />

        {/* Filters and Search */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={setFilters}
          filterOptions={filterOptions}
          placeholder="Buscar por estudiante, curso o ID..."
        />

        {/* Certificates Table */}
        <DataTable
          columns={certificateColumns}
          data={filteredData}
          onRowClick={(certificate) => handleViewCertificate(certificate)}
          actions={(certificate) => (
            <div className="flex items-center space-x-2">
              {certificate.status === CERTIFICATE_STATUS.PENDING && (
                <button
                  onClick={() => handleGenerateCertificate(certificate.id)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-900"
                  title="Generar certificado">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Generar</span>
                </button>
              )}
              {certificate.status === CERTIFICATE_STATUS.ISSUED && (
                <>
                  <button
                    onClick={() => handleViewCertificate(certificate)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Ver certificado">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadCertificate(certificate)}
                    className="text-green-600 hover:text-green-900"
                    title="Descargar certificado">
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShareCertificate(certificate)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Compartir certificado">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
          emptyMessage="No se encontraron certificados"
          emptyIcon={AcademicCapIcon}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center mb-4 space-x-3">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Criterios de Certificación
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Configura los requisitos para emitir certificados en tus cursos
            </p>
            <button className="px-4 py-2 w-full text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Configurar Criterios
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center mb-4 space-x-3">
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Plantillas Personalizadas
              </h3>
            </div>
            <p className="mb-4 text-gray-600">
              Crea plantillas personalizadas para los certificados de tus cursos
            </p>
            <button className="px-4 py-2 w-full text-white bg-green-600 rounded-lg hover:bg-green-700">
              Crear Plantilla
            </button>
          </div>
        </div>
      </div>
    </InstructorLayout>
  );
};

export default InstructorCertificates;
