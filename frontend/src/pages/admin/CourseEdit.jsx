import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layout/AdminLayout';
import { useApi } from '../../hooks/useApi';
import {
  BookOpenIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const CourseEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saving, setSaving] = useState(false);
  
  // Usar useApi para obtener los datos del curso
  const { data: courseData, loading, error, refetch } = useApi(`/api/cursos/${id}`);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Principiante',
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

  const levels = ['Principiante', 'Intermedio', 'Avanzado'];

  // Cargar datos del curso cuando useApi obtiene los datos
  useEffect(() => {
    if (courseData && !loading) {
      // Acceder a los datos del curso, puede estar en courseData.data o directamente en courseData
      const curso = courseData.data || courseData;
      setFormData({
        title: curso.titulo || '',
        description: curso.descripcion || '',
        category: curso.categoria || '',
        level: curso.nivel || 'Principiante',
        duration: curso.duracion_horas || '',
        price: curso.precio || '',
        instructor: curso.instructor_id?.nombre || '',
        requirements: curso.requisitos && curso.requisitos.length > 0 ? curso.requisitos : [''],
        objectives: curso.objetivos && curso.objetivos.length > 0 ? curso.objetivos : [''],
        thumbnail: null
      });
    }
    
    if (error) {
      console.error('Error al cargar el curso:', error);
      alert('Error al cargar los datos del curso');
      navigate('/admin/courses');
    }
  }, [courseData, loading, error, navigate]);

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
      const courseData = {
        titulo: formData.title,
        descripcion: formData.description,
        categoria: formData.category,
        nivel: formData.level,
        duracion_horas: parseFloat(formData.duration) || 0,
        precio: parseFloat(formData.price) || 0,
        requisitos: formData.requirements.filter(req => req.trim() !== ''),
        objetivos: formData.objectives.filter(obj => obj.trim() !== '')
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el curso');
      }
      
      alert('Curso actualizado exitosamente');
      refetch(); // Actualizar los datos del curso
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      alert('Error al actualizar el curso. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 rounded-full border-b-2 border-teal-600 animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
              <p className="text-gray-600">Modifica la información del curso</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <BookOpenIcon className="mr-2 w-6 h-6 text-teal-600" />
                  Información Básica
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                      Título del Curso *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Ej: Fundamentos de React"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                      Categoría *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="level" className="block mb-2 text-sm font-medium text-gray-700">
                      Nivel *
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-700">
                      Duración
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Ej: 8 semanas"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
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
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="99.99"
                    />
                  </div>
                  <div>
                    <label htmlFor="instructor" className="block mb-2 text-sm font-medium text-gray-700">
                      Instructor
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Nombre del instructor"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                      Descripción *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Describe el contenido y objetivos del curso..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Requisitos */}
            <div className="bg-white rounded-lg border shadow-sm">
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
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ej: Conocimientos básicos de HTML"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'requirements')}
                          className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    + Agregar requisito
                  </button>
                </div>
              </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-lg border shadow-sm">
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
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ej: Crear aplicaciones web interactivas"
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'objectives')}
                          className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('objectives')}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    + Agregar objetivo
                  </button>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="mr-2 w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 w-4 h-4" />
                    Actualizar Curso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseEdit;
