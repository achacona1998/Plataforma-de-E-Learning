import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        usuario: {
          _id: '507f1f77bcf86cd799439011',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@test.com',
          rol: 'estudiante'
        },
        token: 'mock-jwt-token'
      }
    });
  }),

  http.post(`${API_URL}/auth/registro`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        usuario: {
          _id: '507f1f77bcf86cd799439012',
          nombre: 'María',
          apellido: 'García',
          correo: 'maria.garcia@test.com',
          rol: 'instructor'
        },
        token: 'mock-jwt-token'
      }
    }, { status: 201 });
  }),

  http.get(`${API_URL}/auth/perfil`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        usuario: {
          _id: '507f1f77bcf86cd799439011',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@test.com',
          rol: 'estudiante'
        }
      }
    });
  }),

  // Courses endpoints
  http.get(`${API_URL}/cursos`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        cursos: [
          {
            _id: '507f1f77bcf86cd799439013',
            titulo: 'Curso de JavaScript',
            descripcion: 'Aprende JavaScript desde cero',
            precio: 99.99,
            moneda: 'USD',
            duracion_horas: 40,
            categoria: 'programacion',
            nivel: 'principiante',
            imagen_url: 'https://example.com/image.jpg',
            estado: 'publicado',
            calificacion_promedio: 4.5,
            total_estudiantes: 150,
            instructor_id: {
              _id: '507f1f77bcf86cd799439014',
              nombre: 'Ana',
              especialidad: 'Desarrollo Web'
            }
          },
          {
            _id: '507f1f77bcf86cd799439015',
            titulo: 'Curso de React',
            descripcion: 'Domina React y sus ecosistema',
            precio: 149.99,
            moneda: 'USD',
            duracion_horas: 60,
            categoria: 'programacion',
            nivel: 'intermedio',
            imagen_url: 'https://example.com/react.jpg',
            estado: 'publicado',
            calificacion_promedio: 4.8,
            total_estudiantes: 200,
            instructor_id: {
              _id: '507f1f77bcf86cd799439016',
              nombre: 'Carlos',
              especialidad: 'Frontend Development'
            }
          }
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCourses: 2,
          limit: 10
        }
      }
    });
  }),

  http.get(`${API_URL}/cursos/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      data: {
        curso: {
          _id: id,
          titulo: 'Curso de JavaScript',
          descripcion: 'Aprende JavaScript desde cero con ejemplos prácticos',
          precio: 99.99,
          moneda: 'USD',
          duracion_horas: 40,
          categoria: 'programacion',
          nivel: 'principiante',
          imagen_url: 'https://example.com/image.jpg',
          estado: 'publicado',
          requisitos: ['Conocimientos básicos de HTML', 'Conocimientos básicos de CSS'],
          objetivos: ['Dominar JavaScript', 'Crear aplicaciones web interactivas'],
          calificacion_promedio: 4.5,
          total_estudiantes: 150,
          fecha_publicacion: '2024-01-15T00:00:00.000Z',
          instructor_id: {
            _id: '507f1f77bcf86cd799439014',
            nombre: 'Ana',
            especialidad: 'Desarrollo Web'
          }
        }
      }
    });
  }),

  http.post(`${API_URL}/cursos`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        curso: {
          _id: '507f1f77bcf86cd799439017',
          titulo: 'Nuevo Curso',
          descripcion: 'Descripción del nuevo curso',
          precio: 79.99,
          moneda: 'USD',
          duracion_horas: 30,
          categoria: 'programacion',
          nivel: 'principiante',
          estado: 'borrador',
          instructor_id: '507f1f77bcf86cd799439014'
        }
      }
    }, { status: 201 });
  }),

  // Students endpoints
  http.get(`${API_URL}/estudiantes/perfil`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        estudiante: {
          _id: '507f1f77bcf86cd799439018',
          nombre: 'Juan',
          apellido: 'Pérez',
          correo: 'juan.perez@test.com',
          telefono: '123456789',
          fecha_nacimiento: '1990-01-01T00:00:00.000Z',
          genero: 'masculino',
          pais: 'México',
          ciudad: 'Ciudad de México',
          nivel_educacion: 'universitario',
          ocupacion: 'Desarrollador',
          intereses: ['programacion', 'tecnologia'],
          biografia: 'Desarrollador apasionado por la tecnología',
          estado: 'activo',
          fecha_registro: '2024-01-01T00:00:00.000Z'
        }
      }
    });
  }),

  // Enrollments endpoints
  http.get(`${API_URL}/inscripciones/estudiante/:id`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        inscripciones: [
          {
            _id: '507f1f77bcf86cd799439019',
            curso_id: {
              _id: '507f1f77bcf86cd799439013',
              titulo: 'Curso de JavaScript',
              imagen_url: 'https://example.com/image.jpg'
            },
            estudiante_id: '507f1f77bcf86cd799439018',
            fecha_inscripcion: '2024-01-15T00:00:00.000Z'
          }
        ]
      }
    });
  }),

  // Error handlers
  http.get(`${API_URL}/cursos/nonexistent`, () => {
    return HttpResponse.json({
      success: false,
      message: 'Curso no encontrado'
    }, { status: 404 });
  }),

  http.post(`${API_URL}/auth/login-error`, () => {
    return HttpResponse.json({
      success: false,
      message: 'Credenciales inválidas'
    }, { status: 401 });
  })
];