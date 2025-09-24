import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CertificateGenerator = ({ courseId, courseName, onCertificateGenerated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);

  const generateCertificate = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para generar un certificado');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/certificados/generar/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setCertificate(response.data.data);
        toast.success('¡Certificado generado exitosamente!');
        if (onCertificateGenerated) {
          onCertificateGenerated(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error generando certificado:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al generar el certificado');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    if (!certificate) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/certificados/${certificate._id}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        // Crear enlace de descarga
        const downloadUrl = `http://localhost:5000${response.data.data.url_descarga}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = response.data.data.nombre_archivo || 'certificado.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Certificado descargado exitosamente');
      }
    } catch (error) {
      console.error('Error descargando certificado:', error);
      toast.error('Error al descargar el certificado');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">🎓</span>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Certificado de Finalización
          </h3>
          <p className="text-gray-600">
            {courseName}
          </p>
        </div>
      </div>

      {!certificate ? (
        <div className="space-y-4">
          <p className="text-gray-700">
            ¡Felicidades! Has completado este curso exitosamente. 
            Genera tu certificado oficial para validar tu aprendizaje.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-blue-500 text-xl mr-3">ℹ️</span>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Tu certificado incluirá:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tu nombre completo</li>
                  <li>Nombre del curso completado</li>
                  <li>Fecha de finalización</li>
                  <li>Código de verificación único</li>
                  <li>Información del instructor</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={generateCertificate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generando certificado...
              </div>
            ) : (
              'Generar Certificado'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✅</span>
              <div>
                <p className="font-medium text-green-800">
                  ¡Certificado generado exitosamente!
                </p>
                <p className="text-sm text-green-700">
                  Código de verificación: {certificate.codigo_verificacion}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={downloadCertificate}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📥 Descargar PDF
            </button>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(certificate.codigo_verificacion);
                toast.success('Código copiado al portapapeles');
              }}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              📋 Copiar Código
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Fecha de emisión:</strong> {' '}
              {new Date(certificate.fecha_emision).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
