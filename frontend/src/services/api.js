import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:5000';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Log del error para debugging
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

// Funciones helper para diferentes tipos de requests
export const apiHelpers = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // Upload file
  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Endpoints específicos de la aplicación
export const endpoints = {
  // Autenticación
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
    refresh: '/api/auth/refresh',
  },
  
  // Usuarios
  users: {
    list: '/api/usuarios',
    create: '/api/usuarios',
    update: (id) => `/api/usuarios/${id}`,
    delete: (id) => `/api/usuarios/${id}`,
    profile: '/api/usuarios/perfil',
  },
  
  // Cursos
  courses: {
    list: '/api/cursos',
    create: '/api/cursos',
    update: (id) => `/api/cursos/${id}`,
    delete: (id) => `/api/cursos/${id}`,
    byId: (id) => `/api/cursos/${id}`,
  },
  
  // Inscripciones
  enrollments: {
    list: '/api/inscripciones',
    create: '/api/inscripciones',
    update: (id) => `/api/inscripciones/${id}`,
    delete: (id) => `/api/inscripciones/${id}`,
    byStudent: (studentId) => `/api/inscripciones/estudiante/${studentId}`,
  },
  
  // Certificados
  certificates: {
    list: '/api/certificados',
    admin: '/api/certificados/admin/todos',
    create: '/api/certificados',
    verify: (code) => `/api/certificados/verificar/${code}`,
    byStudent: (studentId) => `/api/certificados/estudiante/${studentId}`,
  },
  
  // Progreso
  progress: {
    list: '/api/progresos',
    create: '/api/progresos',
    update: (id) => `/api/progresos/${id}`,
    byStudent: (studentId) => `/api/progresos/estudiante/${studentId}`,
  },
  
  // Contenidos
  content: {
    list: '/api/contenidos',
    create: '/api/contenidos',
    update: (id) => `/api/contenidos/${id}`,
    delete: (id) => `/api/contenidos/${id}`,
    byCourse: (courseId) => `/api/contenidos/curso/${courseId}`,
  },
  
  // Pagos
  payments: {
    list: '/api/pagos',
    admin: '/api/pagos/admin/todos',
    create: '/api/pagos',
    update: (id) => `/api/pagos/${id}`,
  },
};

export default api;