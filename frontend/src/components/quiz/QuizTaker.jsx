import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { toast } from 'react-toastify';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const QuizTaker = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [respuestaQuizId, setRespuestaQuizId] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [quizIniciado, setQuizIniciado] = useState(false);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [resultados, setResultados] = useState(null);
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  // Usar useApi para obtener el quiz
  const { data: quizData, loading, error } = useApi(`/api/quizzes/${quizId}`);
  const quiz = quizData?.data;

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar el quiz');
      navigate(-1);
    }
  }, [error, navigate]);

  useEffect(() => {
    let interval;
    if (quizIniciado && tiempoRestante > 0 && !quizFinalizado) {
      interval = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            finalizarQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizIniciado, tiempoRestante, quizFinalizado]);



  const iniciarQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/respuestas-quiz/quiz/${quizId}/iniciar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al iniciar el quiz');
      }
      
      const data = await response.json();
      setRespuestaQuizId(data.data._id);
      setQuizIniciado(true);
      if (quiz.tiempoLimite) {
        setTiempoRestante(quiz.tiempoLimite * 60); // Convertir minutos a segundos
      }
      toast.success('Quiz iniciado');
    } catch (error) {
      toast.error(error.message || 'Error al iniciar el quiz');
    }
  };

  const enviarRespuesta = async (preguntaId, respuestaSeleccionada) => {
    if (enviandoRespuesta) return;
    
    setEnviandoRespuesta(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/respuestas-quiz/${respuestaQuizId}/responder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          preguntaId,
          respuestaSeleccionada
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar respuesta');
      }
      
      setRespuestas(prev => ({
        ...prev,
        [preguntaId]: respuestaSeleccionada
      }));
    } catch (error) {
      toast.error('Error al enviar respuesta');
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const finalizarQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/respuestas-quiz/${respuestaQuizId}/finalizar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      
      if (!response.ok) {
        throw new Error('Error al finalizar el quiz');
      }
      
      const data = await response.json();
      setQuizFinalizado(true);
      setResultados(data.data);
      toast.success('Quiz finalizado');
    } catch (error) {
      toast.error('Error al finalizar el quiz');
    }
  };

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const siguientePregunta = () => {
    if (preguntaActual < quiz.preguntas.length - 1) {
      setPreguntaActual(prev => prev + 1);
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    }
  };

  const irAPregunta = (index) => {
    setPreguntaActual(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz no encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (quizFinalizado && resultados) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                resultados.aprobado ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {resultados.aprobado ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {resultados.aprobado ? '¡Felicitaciones!' : 'Quiz Completado'}
              </h1>
              <p className="text-gray-600">
                {resultados.aprobado ? 'Has aprobado el quiz' : 'No has alcanzado la puntuación mínima'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Puntuación</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {resultados.puntuacion}/{quiz.preguntas.length}
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Porcentaje</h3>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round((resultados.puntuacion / quiz.preguntas.length) * 100)}%
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Tiempo</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(resultados.tiempoTranscurrido / 60)} min
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver al Curso
              </button>
              {!resultados.aprobado && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Intentar de Nuevo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizIniciado) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{quiz.titulo}</h1>
            
            {quiz.descripcion && (
              <p className="text-gray-600 mb-6">{quiz.descripcion}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Información del Quiz</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• {quiz.preguntas.length} preguntas</li>
                  <li>• Puntuación mínima: {quiz.puntuacionMinima}%</li>
                  {quiz.tiempoLimite && (
                    <li>• Tiempo límite: {quiz.tiempoLimite} minutos</li>
                  )}
                  <li>• Intentos permitidos: {quiz.intentosPermitidos}</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Instrucciones
                </h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Lee cada pregunta cuidadosamente</li>
                  <li>• Puedes navegar entre preguntas</li>
                  <li>• Tus respuestas se guardan automáticamente</li>
                  <li>• Finaliza el quiz cuando termines</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={iniciarQuiz}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                Iniciar Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pregunta = quiz.preguntas[preguntaActual];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header con información del quiz */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.titulo}</h1>
              <p className="text-gray-600">
                Pregunta {preguntaActual + 1} de {quiz.preguntas.length}
              </p>
            </div>
            {tiempoRestante !== null && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                tiempoRestante < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatearTiempo(tiempoRestante)}</span>
              </div>
            )}
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((preguntaActual + 1) / quiz.preguntas.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navegación de preguntas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {quiz.preguntas.map((_, index) => (
              <button
                key={index}
                onClick={() => irAPregunta(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                  index === preguntaActual
                    ? 'bg-blue-600 text-white'
                    : respuestas[quiz.preguntas[index]._id]
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Pregunta actual */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {pregunta.pregunta}
          </h2>

          <div className="space-y-4">
            {pregunta.opciones.map((opcion, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  respuestas[pregunta._id] === opcion
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`pregunta-${pregunta._id}`}
                  value={opcion}
                  checked={respuestas[pregunta._id] === opcion}
                  onChange={() => enviarRespuesta(pregunta._id, opcion)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                  respuestas[pregunta._id] === opcion
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {respuestas[pregunta._id] === opcion && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-900">{opcion}</span>
              </label>
            ))}
          </div>

          {/* Navegación entre preguntas */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={preguntaAnterior}
              disabled={preguntaActual === 0}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            <div className="flex space-x-4">
              {preguntaActual === quiz.preguntas.length - 1 ? (
                <button
                  onClick={finalizarQuiz}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Finalizar Quiz
                </button>
              ) : (
                <button
                  onClick={siguientePregunta}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;
