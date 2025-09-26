import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { vi } from 'vitest';

// Mock del contexto de autenticación para tests
const MockAuthProvider = ({ children, value = {} }) => {
  const defaultValue = {
    user: null,
    token: null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    ...value
  };

  return (
    <AuthProvider value={defaultValue}>
      {children}
    </AuthProvider>
  );
};

// Wrapper personalizado para renderizar componentes con providers
const AllTheProviders = ({ children, authValue = {} }) => {
  return (
    <BrowserRouter>
      <MockAuthProvider value={authValue}>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  );
};

// Función de render personalizada
const customRender = (ui, options = {}) => {
  const { authValue, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders authValue={authValue}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Datos de prueba comunes
export const mockCourse = {
  _id: '507f1f77bcf86cd799439013',
  titulo: 'Curso de JavaScript',
  descripcion: 'Aprende JavaScript desde cero con ejemplos prácticos y proyectos reales',
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
    nombre: 'Ana García',
    especialidad: 'Desarrollo Web'
  }
};

export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  nombre: 'Juan',
  apellido: 'Pérez',
  correo: 'juan.perez@test.com',
  rol: 'estudiante'
};

export const mockInstructor = {
  _id: '507f1f77bcf86cd799439014',
  nombre: 'Ana',
  apellido: 'García',
  correo: 'ana.garcia@test.com',
  rol: 'instructor',
  especialidad: 'Desarrollo Web'
};

export const mockStudent = {
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
  estado: 'activo'
};

// Re-exportar todo de testing-library
export * from '@testing-library/react';

// Sobrescribir render con nuestro render personalizado
export { customRender as render };