import { useState } from 'react';
import { toast } from 'react-toastify';

const CertificateVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  const verifyCertificate = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Por favor ingresa un código de verificación');
      return;
    }

    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const response = await fetch(
        `/api/certificados/verificar/${verificationCode}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Certificado no encontrado. Verifica el código ingresado.');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al verificar el certificado');
        }
        return;
      }

      const data = await response.json();
      if (data.success) {
        setCertificate(data.data);
        toast.success('Certificado verificado exitosamente');
      }
    } catch (error) {
      console.error('Error verificando certificado:', error);
      setError('Error al verificar el certificado');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationCode('');
    setCertificate(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center">
            <span className="text-3xl mr-4">🔍</span>
            <div>
              <h1 className="text-2xl font-bold">Verificación de Certificados</h1>
              <p className="text-indigo-100 mt-1">
                Verifica la autenticidad de un certificado usando su código único
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={verifyCertificate} className="space-y-4">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificación
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="Ej: CERT-1234567890-ABC123"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !verificationCode.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verificando...
                    </div>
                  ) : (
                    'Verificar'
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">❌</span>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}
          </form>

          {/* Certificate Details */}
          {certificate && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <span className="text-green-500 text-2xl mr-3">✅</span>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Certificado Válido
                    </h3>
                    <p className="text-green-700">
                      Este certificado ha sido verificado exitosamente
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🎓</span>
                  Detalles del Certificado
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Estudiante
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {certificate.estudiante_id?.usuario_id?.nombre || 'No disponible'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Curso
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {certificate.curso_id?.titulo || 'No disponible'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Instructor
                      </label>
                      <p className="text-lg text-gray-800">
                        {certificate.curso_id?.instructor_id?.usuario_id?.nombre || 'No disponible'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Fecha de Emisión
                      </label>
                      <p className="text-lg text-gray-800">
                        {new Date(certificate.fecha_emision).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Código de Verificación
                      </label>
                      <p className="text-lg font-mono text-gray-800 bg-gray-100 px-3 py-2 rounded">
                        {certificate.codigo_verificacion}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Estado
                      </label>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        certificate.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.estado === 'activo' ? 'Activo' : 'Revocado'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {certificate.metadata && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">
                      Información Adicional
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {certificate.metadata.duracion_curso && (
                        <div>
                          <span className="font-medium text-gray-600">Duración:</span>
                          <p className="text-gray-800">{certificate.metadata.duracion_curso}</p>
                        </div>
                      )}
                      {certificate.metadata.categoria && (
                        <div>
                          <span className="font-medium text-gray-600">Categoría:</span>
                          <p className="text-gray-800">{certificate.metadata.categoria}</p>
                        </div>
                      )}
                      {certificate.calificacion_final && (
                        <div>
                          <span className="font-medium text-gray-600">Calificación:</span>
                          <p className="text-gray-800">{certificate.calificacion_final}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Verificar Otro Certificado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <span className="text-xl mr-2">ℹ️</span>
          ¿Cómo verificar un certificado?
        </h3>
        <div className="text-blue-800 space-y-2">
          <p>1. Obtén el código de verificación del certificado (formato: CERT-XXXXXXXXXX-XXXXXX)</p>
          <p>2. Ingresa el código en el campo de arriba</p>
          <p>3. Haz clic en "Verificar" para validar la autenticidad</p>
          <p>4. Si el certificado es válido, verás todos los detalles del mismo</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
