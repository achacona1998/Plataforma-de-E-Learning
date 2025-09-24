import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import InstructorLayout from '../../layout/InstructorLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import { API_ROUTES } from '../../utils/constants';
import { Plus, Edit, Trash2, Eye, BarChart3, Clock, Users } from 'lucide-react';

const QuizManager = () => {
  const { cursoId } = useParams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tiempoLimite: '',
    puntuacionMinima: 70,
    intentosPermitidos: 3,
    activo: true,
    preguntas: []
  });
  const [newPregunta, setNewPregunta] = useState({
    pregunta: '',
    opciones: ['', '', '', ''],
    respuestaCorrecta: 0
  });

  // Usar hooks personalizados para obtener datos
  const { data: curso, loading: cursoLoading } = useApi(
    cursoId ? `${API_ROUTES.COURSES}/${cursoId}` : null,
    null
  );
  
  const { data: quizzes, loading: quizzesLoading, refetch: refetchQuizzes } = useApi(
    cursoId ? `${API_ROUTES.QUIZZES}/curso/${cursoId}` : null,
    []
  );
  
  const loading = cursoLoading || quizzesLoading;



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.preguntas.length === 0) {
      toast.error('Debe agregar al menos una pregunta');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const quizData = {
        ...formData,
        curso: cursoId,
        tiempoLimite: formData.tiempoLimite ? parseInt(formData.tiempoLimite) : null
      };

      if (editingQuiz) {
        await axios.patch(`/api/quizzes/${editingQuiz._id}`, quizData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Quiz actualizado exitosamente');
      } else {
        await axios.post('/api/quizzes', quizData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Quiz creado exitosamente');
      }

      resetForm();
      refetchQuizzes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el quiz');
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este quiz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Quiz eliminado exitosamente');
      refetchQuizzes();
    } catch (error) {
      toast.error('Error al eliminar el quiz');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tiempoLimite: '',
      puntuacionMinima: 70,
      intentosPermitidos: 3,
      activo: true,
      preguntas: []
    });
    setNewPregunta({
      pregunta: '',
      opciones: ['', '', '', ''],
      respuestaCorrecta: 0
    });
    setEditingQuiz(null);
    setShowCreateForm(false);
  };

  const startEdit = (quiz) => {
    setFormData({
      titulo: quiz.titulo,
      descripcion: quiz.descripcion || '',
      tiempoLimite: quiz.tiempoLimite || '',
      puntuacionMinima: quiz.puntuacionMinima,
      intentosPermitidos: quiz.intentosPermitidos,
      activo: quiz.activo,
      preguntas: quiz.preguntas
    });
    setEditingQuiz(quiz);
    setShowCreateForm(true);
  };

  const addPregunta = () => {
    if (!newPregunta.pregunta.trim()) {
      toast.error('La pregunta no puede estar vacía');
      return;
    }

    if (newPregunta.opciones.some(opcion => !opcion.trim())) {
      toast.error('Todas las opciones deben tener contenido');
      return;
    }

    setFormData(prev => ({
      ...prev,
      preguntas: [...prev.preguntas, { ...newPregunta }]
    }));

    setNewPregunta({
      pregunta: '',
      opciones: ['', '', '', ''],
      respuestaCorrecta: 0
    });
  };

  const removePregunta = (index) => {
    setFormData(prev => ({
      ...prev,
      preguntas: prev.preguntas.filter((_, i) => i !== index)
    }));
  };

  const updatePreguntaOpcion = (index, value) => {
    setNewPregunta(prev => ({
      ...prev,
      opciones: prev.opciones.map((opcion, i) => i === index ? value : opcion)
    }));
  };

  if (loading) {
    return (
      <InstructorLayout>
        <LoadingSpinner message="Cargando quizzes..." />
      </InstructorLayout>
    );
  }

  return (
    <InstructorLayout>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Quizzes</h1>
              {curso && (
                <p className="text-gray-600 mt-2">Curso: {curso.titulo}</p>
              )}
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Quiz</span>
            </button>
          </div>
        </div>

        {/* Lista de Quizzes */}
        {!showCreateForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{quiz.titulo}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quiz.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {quiz.descripcion && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{quiz.descripcion}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{quiz.preguntas.length} preguntas</span>
                  </div>
                  {quiz.tiempoLimite && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{quiz.tiempoLimite} minutos</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>Mín: {quiz.puntuacionMinima}%</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/quiz/${quiz._id}`}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-center hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </Link>
                  <button
                    onClick={() => startEdit(quiz)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}

            {quizzes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BarChart3 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay quizzes</h3>
                <p className="text-gray-600 mb-4">Crea tu primer quiz para evaluar a los estudiantes</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* Formulario de Creación/Edición */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingQuiz ? 'Editar Quiz' : 'Crear Nuevo Quiz'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo Límite (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.tiempoLimite}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiempoLimite: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Puntuación Mínima (%)
                  </label>
                  <input
                    type="number"
                    value={formData.puntuacionMinima}
                    onChange={(e) => setFormData(prev => ({ ...prev, puntuacionMinima: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intentos Permitidos
                  </label>
                  <input
                    type="number"
                    value={formData.intentosPermitidos}
                    onChange={(e) => setFormData(prev => ({ ...prev, intentosPermitidos: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Quiz activo
                </label>
              </div>

              {/* Sección de Preguntas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas</h3>
                
                {/* Lista de preguntas existentes */}
                {formData.preguntas.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {formData.preguntas.map((pregunta, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {index + 1}. {pregunta.pregunta}
                            </h4>
                            <div className="space-y-1">
                              {pregunta.opciones.map((opcion, opcionIndex) => (
                                <div key={opcionIndex} className={`text-sm ${
                                  opcionIndex === pregunta.respuestaCorrecta 
                                    ? 'text-green-600 font-medium' 
                                    : 'text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + opcionIndex)}. {opcion}
                                  {opcionIndex === pregunta.respuestaCorrecta && ' ✓'}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePregunta(index)}
                            className="text-red-600 hover:text-red-800 ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario para nueva pregunta */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-4">Agregar Nueva Pregunta</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Pregunta
                      </label>
                      <input
                        type="text"
                        value={newPregunta.pregunta}
                        onChange={(e) => setNewPregunta(prev => ({ ...prev, pregunta: e.target.value }))}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Escribe la pregunta..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Opciones de Respuesta
                      </label>
                      <div className="space-y-2">
                        {newPregunta.opciones.map((opcion, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="respuesta-correcta"
                              checked={newPregunta.respuestaCorrecta === index}
                              onChange={() => setNewPregunta(prev => ({ ...prev, respuestaCorrecta: index }))}
                              className="text-blue-600"
                            />
                            <span className="text-sm font-medium text-blue-800 w-6">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                              type="text"
                              value={opcion}
                              onChange={(e) => updatePreguntaOpcion(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        Selecciona la opción correcta marcando el círculo correspondiente
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addPregunta}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Agregar Pregunta
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingQuiz ? 'Actualizar Quiz' : 'Crear Quiz'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
    </InstructorLayout>
  );
};

export default QuizManager;
