import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import {
  BookOpenIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const CourseCreate = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'principiante',
    duration: '',
    price: '',
    instructor: '',
    requirements: [''],
    objectives: [''],
    thumbnail: null
  });

  const categories = [
    'Desarrollo Web',
    'Desarrollo Móvil',
    'Ciencia de Datos',
    'Inteligencia Artificial',
    'Ciberseguridad',
    'Diseño UX/UI',
    'Marketing Digital',
    'Gestión de Proyectos',
    'Idiomas',
    'Otros'
  ];

  const levels = ['principiante', 'intermedio', 'avanzado'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validar campos requeridos
      if (!formData.title || !formData.description || !formData.category) {
        alert('Por favor completa todos los campos requeridos');
        setSaving(false);
        return;
      }

      const courseData = {
        titulo: formData.title,
        descripcion: formData.description,
        categoria: formData.category,
        nivel: formData.level.toLowerCase(),
        duracion_horas: parseFloat(formData.duration) || 0,
        precio: parseFloat(formData.price) || 0,
        requisitos: formData.requirements.filter(req => req.trim() !== ''),
        objetivos: formData.objectives.filter(obj => obj.trim() !== ''),
        estado: 'borrador'
      };

      const token = localStorage.getItem('token');
      const response = await fetch('/api/cursos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el curso');
      }
      
      alert('Curso creado exitosamente');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error al crear curso:', error);
      alert('Error al crear el curso');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Curso</h1>
              <p className="text-gray-600">Completa la información para crear un nuevo curso</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BookOpenIcon className="h-6 w-6 text-teal-600 mr-2" />
                  Información Básica
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Curso *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Ej: Fundamentos de React"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel *
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duración
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Ej: 8 semanas"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Precio (USD)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="99.99"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Describe el contenido y objetivos del curso..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Requisitos */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Requisitos</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ej: Conocimientos básicos de HTML"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'requirements')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    + Agregar requisito
                  </button>
                </div>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Objetivos de Aprendizaje</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {formData.objectives.map((obj, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={obj}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'objectives')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ej: Crear componentes React reutilizables"
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'objectives')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('objectives')}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    + Agregar objetivo
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckIcon className="h-4 w-4" />
                <span>{saving ? 'Creando...' : 'Crear Curso'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseCreate;
