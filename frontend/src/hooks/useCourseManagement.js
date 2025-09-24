import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./useApi";
import axios from "axios";

/**
 * Hook personalizado para manejar la gestión de cursos
 * @returns {object} - Estados y funciones para gestionar cursos
 */
export const useCourseManagement = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Usar hook useApi para obtener los cursos
  const { data: cursosData, loading, error, refetch } = useApi("/api/cursos");

  // Procesar los datos de cursos cuando estén disponibles
  useEffect(() => {
    if (cursosData?.data) {
      const coursesData = cursosData.data || [];

      // Process courses data
      const processedCourses = coursesData.map((course) => ({
        id: course._id,
        title: course.titulo,
        description: course.descripcion,
        instructor: course.instructor_id?.nombre || "Sin instructor",
        total_estudiantes: course.total_estudiantes || 0,
        duracion_horas: course.duracion_horas || 0,
        estado: course.estado || "borrador",
        precio: course.precio || 0,
        categoria: course.categoria || "otros",
        createdAt: new Date(
          course.createdAt || course.fecha_publicacion
        ).toLocaleDateString(),
        imagen_url: course.imagen_url || "/placeholder-course.svg",
        // Mantener propiedades originales para compatibilidad
        students: course.total_estudiantes || 0,
        duration: `${course.duracion_horas || 0}h`,
        status: course.estado || "borrador",
        price: course.precio || 0,
        category: course.categoria || "otros",
        image: course.imagen_url || "/placeholder-course.svg",
      }));

      setCourses(processedCourses);
    } else if (cursosData && !cursosData.data) {
      // Si cursosData no tiene la estructura esperada, usar directamente
      setCourses([]);
    }
  }, [cursosData]);

  // Filtrar cursos basado en búsqueda y estado
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || course.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Función para eliminar curso
  const deleteCourse = async (courseId) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:5000/api/cursos/${courseId}`,
        config
      );
      await refetch(); // Refresh the list using useApi refetch
      return { success: true };
    } catch (error) {
      console.error("Error deleting course:", error);
      return { success: false, error: error.message };
    } finally {
      setDeleting(false);
    }
  };

  // Función para navegar a crear curso
  const handleCreateCourse = () => {
    navigate("/admin/courses/create");
  };

  // Función para navegar a editar curso
  const handleEditCourse = (courseId) => {
    navigate(`/admin/courses/edit/${courseId}`);
  };

  // Función para seleccionar curso
  const selectCourse = (course) => {
    setSelectedCourse(course);
  };

  // Función para limpiar selección
  const clearSelection = () => {
    setSelectedCourse(null);
  };

  // Función para actualizar el estado de un curso
  const updateCourseStatus = async (courseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.patch(
        `http://localhost:5000/api/cursos/${courseId}`,
        { estado: newStatus },
        config
      );
      
      await refetch(); // Refresh the list using useApi refetch
      return { success: true };
    } catch (error) {
      console.error('Error updating course status:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    // Estados
    courses,
    filteredCourses,
    loading,
    error,
    searchTerm,
    filterStatus,
    selectedCourse,
    deleting,

    // Funciones de búsqueda y filtrado
    setSearchTerm,
    setFilterStatus,

    // Funciones de gestión de cursos
    deleteCourse,
    updateCourseStatus,
    handleCreateCourse,
    handleEditCourse,
    selectCourse,
    clearSelection,
    refetch,
  };
};
