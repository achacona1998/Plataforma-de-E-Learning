import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InstructorLayout from '../../layout/InstructorLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useApi } from '../../hooks/useApi';
import { API_ROUTES } from '../../utils/constants';
import {
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CreateCourse = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [courseData, setCourseData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    nivel: 'principiante',
    precio: 0,
    duracion: 0,
    imagen: '',
    requisitos: [''],
    objetivos: [''],
    modulos: [{
      titulo: '',
      descripcion: '',
      lecciones: [{
        titulo: '',
        tipo: 'video',
        contenido: '',
        duracion: 0
      }]
    }]
  });
  // Usar hook personalizado para obtener categorías
  const { data: categoriesData, loading: categoriesLoading } = useApi(
    API_ROUTES.CATEGORIES,
    [
      'Programación',
      'Diseño',
      'Marketing',
      'Negocios',
      'Idiomas',
      'Música',
      'Fotografía',
      'Cocina'
    ]
  );

  const categories = Array.isArray(categoriesData) 
    ? categoriesData.map(cat => cat.nombre || cat)
    : categoriesData;

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      modulos: prev.modulos.map((module, i) => 
        i === moduleIndex ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      modulos: prev.modulos.map((module, i) => 
        i === moduleIndex ? {
          ...module,
          lecciones: module.lecciones.map((lesson, j) => 
            j === lessonIndex ? { ...lesson, [field]: value } : lesson
          )
        } : module
      )
    }));
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modulos: [...prev.modulos, {
        titulo: '',
        descripcion: '',
        lecciones: [{
          titulo: '',
          tipo: 'video',
          contenido: '',
          duracion: 0
        }]
      }]
    }));
  };

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      modulos: prev.modulos.filter((_, i) => i !== index)
    }));
  };

  const addLesson = (moduleIndex) => {
    setCourseData(prev => ({
      ...prev,
      modulos: prev.modulos.map((module, i) => 
        i === moduleIndex ? {
          ...module,
          lecciones: [...module.lecciones, {
            titulo: '',
            tipo: 'video',
            contenido: '',
            duracion: 0
          }]
        } : module
      )
    }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    setCourseData(prev => ({
      ...prev,
      modulos: prev.modulos.map((module, i) => 
        i === moduleIndex ? {
          ...module,
          lecciones: module.lecciones.filter((_, j) => j !== lessonIndex)
        } : module
      )
    }));
  };

  const saveCourse = async () => {
    try {
      setLoading(true);
      setSaveStatus('');
      
      const coursePayload = {
        ...courseData,
        instructor_id: user.id,
        estado: 'borrador'
      };

      // Simular llamada a API - en producción usar useApi hook
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('');
        // Reset form
        setCourseData({
          titulo: '',
          descripcion: '',
          categoria: '',
          nivel: 'principiante',
          precio: 0,
          duracion: 0,
          imagen: '',
          requisitos: [''],
          objetivos: [''],
          modulos: [{
            titulo: '',
            descripcion: '',
            lecciones: [{
              titulo: '',
              tipo: 'video',
              contenido: '',
              duracion: 0
            }]
          }]
        });
      }, 3000);
    } catch (error) {
      console.error('Error saving course:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', name: 'Información Básica' },
    { id: 'content', name: 'Contenido' },
    { id: 'settings', name: 'Configuración' }
  ];

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Título del Curso</label>
          <input
            type="text"
            value={courseData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Ej: Introducción a React"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Categoría</label>
          <select
            value={courseData.categoria}
            onChange={(e) => handleInputChange('categoria', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={courseData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          rows={4}
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Describe de qué trata tu curso..."
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Nivel</label>
          <select
            value={courseData.nivel}
            onChange={(e) => handleInputChange('nivel', e.target.value)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Precio ($)</label>
          <input
            type="number"
            value={courseData.precio}
            onChange={(e) => handleInputChange('precio', parseFloat(e.target.value) || 0)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Duración (horas)</label>
          <input
            type="number"
            value={courseData.duracion}
            onChange={(e) => handleInputChange('duracion', parseInt(e.target.value) || 0)}
            className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
          />
        </div>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">URL de Imagen</label>
        <input
          type="url"
          value={courseData.imagen}
          onChange={(e) => handleInputChange('imagen', e.target.value)}
          className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Requisitos</label>
        {courseData.requisitos.map((req, index) => (
          <div key={index} className="flex items-center mb-2 space-x-2">
            <input
              type="text"
              value={req}
              onChange={(e) => handleArrayChange('requisitos', index, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Ej: Conocimientos básicos de HTML"
            />
            {courseData.requisitos.length > 1 && (
              <button
                onClick={() => removeArrayItem('requisitos', index)}
                className="p-2 text-red-600 rounded-lg hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('requisitos')}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Agregar requisito</span>
        </button>
      </div>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Objetivos de Aprendizaje</label>
        {courseData.objetivos.map((obj, index) => (
          <div key={index} className="flex items-center mb-2 space-x-2">
            <input
              type="text"
              value={obj}
              onChange={(e) => handleArrayChange('objetivos', index, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Ej: Crear aplicaciones web con React"
            />
            {courseData.objetivos.length > 1 && (
              <button
                onClick={() => removeArrayItem('objetivos', index)}
                className="p-2 text-red-600 rounded-lg hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => addArrayItem('objetivos')}
          className="flex items-center space-x-2 text-teal-600 hover:text-teal-700"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Agregar objetivo</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Módulos del Curso</h3>
        <button
          onClick={addModule}
          className="flex items-center px-4 py-2 space-x-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Agregar Módulo</span>
        </button>
      </div>
      
      {courseData.modulos.map((module, moduleIndex) => (
        <div key={moduleIndex} className="p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900 text-md">Módulo {moduleIndex + 1}</h4>
            {courseData.modulos.length > 1 && (
              <button
                onClick={() => removeModule(moduleIndex)}
                className="p-1 text-red-600 rounded hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Título del Módulo</label>
              <input
                type="text"
                value={module.titulo}
                onChange={(e) => handleModuleChange(moduleIndex, 'titulo', e.target.value)}
                className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Ej: Fundamentos de React"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Descripción del Módulo</label>
              <textarea
                value={module.descripcion}
                onChange={(e) => handleModuleChange(moduleIndex, 'descripcion', e.target.value)}
                rows={2}
                className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Describe el contenido de este módulo..."
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Lecciones</label>
                <button
                  onClick={() => addLesson(moduleIndex)}
                  className="flex items-center space-x-1 text-sm text-teal-600 hover:text-teal-700"
                >
                  <PlusIcon className="w-3 h-3" />
                  <span>Agregar Lección</span>
                </button>
              </div>
              
              {module.lecciones.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="p-4 mb-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Lección {lessonIndex + 1}</span>
                    {module.lecciones.length > 1 && (
                      <button
                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        className="p-1 text-red-600 rounded hover:bg-red-100"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        value={lesson.titulo}
                        onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'titulo', e.target.value)}
                        className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Título de la lección"
                      />
                    </div>
                    <div>
                      <select
                        value={lesson.tipo}
                        onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'tipo', e.target.value)}
                        className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="video">Video</option>
                        <option value="texto">Texto</option>
                        <option value="quiz">Quiz</option>
                        <option value="archivo">Archivo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <textarea
                      value={lesson.contenido}
                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'contenido', e.target.value)}
                      rows={2}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="URL del contenido o descripción..."
                    />
                  </div>
                  
                  <div className="mt-3">
                    <input
                      type="number"
                      value={lesson.duracion}
                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'duracion', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Duración en minutos"
                      min="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="mb-2 text-lg font-medium text-yellow-800">Estado del Curso</h3>
        <p className="text-yellow-700">El curso se guardará como borrador. Podrás publicarlo más tarde desde tu panel de instructor.</p>
      </div>
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="mb-2 text-lg font-medium text-blue-800">Próximos Pasos</h3>
        <ul className="space-y-1 text-blue-700">
          <li>• Revisa toda la información del curso</li>
          <li>• Asegúrate de que todos los módulos y lecciones estén completos</li>
          <li>• Sube el contenido multimedia (videos, archivos)</li>
          <li>• Publica el curso cuando esté listo</li>
        </ul>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'content':
        return renderContent();
      case 'settings':
        return renderSettings();
      default:
        return renderBasicInfo();
    }
  };

  if (categoriesLoading) {
    return <LoadingSpinner message="Cargando categorías..." />;
  }

  return (
    <InstructorLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <PlusIcon className="w-8 h-8 text-teal-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Curso</h1>
                  <p className="text-gray-600">Comparte tu conocimiento con el mundo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {saveStatus && (
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    saveStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {saveStatus === 'success' ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <XMarkIcon className="w-5 h-5" />
                    )}
                    <span>{saveStatus === 'success' ? 'Curso guardado' : 'Error al guardar'}</span>
                  </div>
                )}
                <button
                  onClick={saveCourse}
                  disabled={loading || !courseData.titulo || !courseData.descripcion}
                  className="flex items-center px-6 py-2 space-x-2 text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <CheckIcon className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Guardando...' : 'Guardar Curso'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 bg-white rounded-lg shadow">
          {renderTabContent()}
        </div>
      </div>
    </div>
    </InstructorLayout>
  );
};

export default CreateCourse;
