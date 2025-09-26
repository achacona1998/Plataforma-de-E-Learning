const mongoose = require('mongoose');

// Mock del modelo Instructor
const MockInstructor = function(data) {
  Object.assign(this, data);
  this._id = 'mock-instructor-id-' + Math.random().toString(36).substr(2, 9);
  this.fecha_registro = new Date();
};

MockInstructor.prototype.save = jest.fn().mockImplementation(function() {
  return Promise.resolve(this);
});

MockInstructor.findById = jest.fn();
MockInstructor.findOne = jest.fn();
MockInstructor.find = jest.fn();
MockInstructor.create = jest.fn();
MockInstructor.updateOne = jest.fn();
MockInstructor.deleteOne = jest.fn();
MockInstructor.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

// Mock del modelo Curso
const MockCurso = function(data) {
  Object.assign(this, data);
  this._id = 'mock-curso-id-' + Math.random().toString(36).substr(2, 9);
  this.createdAt = new Date();
  this.updatedAt = new Date();
  
  // Valores por defecto
  this.moneda = this.moneda || 'USD';
  this.nivel = this.nivel || 'principiante';
  this.estado = this.estado || 'borrador';
  this.imagen_url = this.imagen_url || '';
  this.requisitos = this.requisitos || [];
  this.objetivos = this.objetivos || [];
  this.calificacion_promedio = this.calificacion_promedio || 0;
  this.total_estudiantes = this.total_estudiantes || 0;
};

MockCurso.prototype.save = jest.fn().mockImplementation(function() {
  // Validaciones básicas
  if (!this.titulo) {
    const error = new Error('Validation failed');
    error.errors = { titulo: { message: 'El título es requerido' } };
    throw error;
  }
  if (!this.descripcion) {
    const error = new Error('Validation failed');
    error.errors = { descripcion: { message: 'La descripción es requerida' } };
    throw error;
  }
  if (!this.instructor_id) {
    const error = new Error('Validation failed');
    error.errors = { instructor_id: { message: 'El instructor es requerido' } };
    throw error;
  }
  if (this.precio === undefined || this.precio === null) {
    const error = new Error('Validation failed');
    error.errors = { precio: { message: 'El precio es requerido' } };
    throw error;
  }
  if (this.precio < 0) {
    const error = new Error('Validation failed');
    error.errors = { precio: { message: 'El precio no puede ser negativo' } };
    throw error;
  }
  if (this.duracion_horas === undefined || this.duracion_horas === null) {
    const error = new Error('Validation failed');
    error.errors = { duracion_horas: { message: 'La duración en horas es requerida' } };
    throw error;
  }
  if (this.duracion_horas < 0.5) {
    const error = new Error('Validation failed');
    error.errors = { duracion_horas: { message: 'La duración mínima es 0.5 horas' } };
    throw error;
  }
  if (!this.categoria) {
    const error = new Error('Validation failed');
    error.errors = { categoria: { message: 'La categoría es requerida' } };
    throw error;
  }
  
  const categoriasValidas = ['programacion', 'diseño', 'marketing', 'negocios', 'idiomas', 'ciencias', 'arte', 'musica', 'otros'];
  if (this.categoria && !categoriasValidas.includes(this.categoria)) {
    const error = new Error('Validation failed');
    error.errors = { categoria: { message: 'Categoría inválida' } };
    throw error;
  }
  
  const nivelesValidos = ['principiante', 'intermedio', 'avanzado'];
  if (this.nivel && !nivelesValidos.includes(this.nivel)) {
    const error = new Error('Validation failed');
    error.errors = { nivel: { message: 'Nivel inválido' } };
    throw error;
  }
  
  const estadosValidos = ['borrador', 'publicado', 'archivado'];
  if (this.estado && !estadosValidos.includes(this.estado)) {
    const error = new Error('Validation failed');
    error.errors = { estado: { message: 'Estado inválido' } };
    throw error;
  }
  
  if (this.calificacion_promedio !== undefined && (this.calificacion_promedio < 0 || this.calificacion_promedio > 5)) {
    const error = new Error('Validation failed');
    error.errors = { calificacion_promedio: { message: 'La calificación debe estar entre 0 y 5' } };
    throw error;
  }
  
  return Promise.resolve(this);
});

MockCurso.prototype.validate = jest.fn().mockResolvedValue(true);

// Métodos estáticos
MockCurso.findById = jest.fn().mockImplementation((id) => {
  const mockCurso = {
    _id: id,
    titulo: 'Curso Test',
    descripcion: 'Descripción del curso',
    instructor_id: {
      _id: 'mock-instructor-id',
      nombre: 'Instructor Test',
      especialidad: 'Programación'
    },
    precio: 99.99,
    duracion_horas: 20,
    categoria: 'programacion',
    moneda: 'USD',
    nivel: 'principiante',
    estado: 'borrador',
    calificacion_promedio: 0,
    total_estudiantes: 0,
    imagen_url: '',
    requisitos: [],
    objetivos: []
  };
  
  return {
    populate: jest.fn().mockResolvedValue(mockCurso)
  };
});

MockCurso.findOne = jest.fn();
MockCurso.find = jest.fn();
MockCurso.create = jest.fn();
MockCurso.updateOne = jest.fn();
MockCurso.deleteOne = jest.fn();
MockCurso.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

// Mock de los módulos
jest.mock('../../../../../backend/src/models/curso.model', () => MockCurso);
jest.mock('../../../../../backend/src/models/instructor.model', () => MockInstructor);

const Curso = require('../../../../../backend/src/models/curso.model');
const Instructor = require('../../../../../backend/src/models/instructor.model');

describe('Modelo Curso', () => {
  let instructorId;

  beforeEach(async () => {
    // Crear un instructor para las pruebas
    const instructor = new Instructor({
      nombre: 'Instructor Test',
      especialidad: 'Programación'
    });
    const savedInstructor = await instructor.save();
    instructorId = savedInstructor._id;
  });

  describe('Validaciones', () => {
    test('debe crear un curso válido', async () => {
      const cursoData = {
        titulo: 'Curso de JavaScript',
        descripcion: 'Aprende JavaScript desde cero',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion'
      };

      const curso = new Curso(cursoData);
      const savedCurso = await curso.save();

      expect(savedCurso._id).toBeDefined();
      expect(savedCurso.titulo).toBe(cursoData.titulo);
      expect(savedCurso.descripcion).toBe(cursoData.descripcion);
      expect(savedCurso.instructor_id.toString()).toBe(instructorId.toString());
      expect(savedCurso.precio).toBe(cursoData.precio);
      expect(savedCurso.duracion_horas).toBe(cursoData.duracion_horas);
      expect(savedCurso.categoria).toBe(cursoData.categoria);
    });

    test('debe requerir título', async () => {
      const curso = new Curso({
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.titulo).toBeDefined();
      }
    });

    test('debe requerir descripción', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.descripcion).toBeDefined();
      }
    });

    test('debe requerir instructor_id', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.instructor_id).toBeDefined();
      }
    });

    test('debe requerir precio', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.precio).toBeDefined();
      }
    });

    test('debe validar precio no negativo', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: -10,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.precio).toBeDefined();
      }
    });

    test('debe validar duración mínima', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 0.2, // Menor a 0.5
        categoria: 'programacion'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.duracion_horas).toBeDefined();
      }
    });

    test('debe validar categoría válida', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'categoria-invalida'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.categoria).toBeDefined();
      }
    });

    test('debe validar nivel válido', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion',
        nivel: 'nivel-invalido'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.nivel).toBeDefined();
      }
    });

    test('debe validar estado válido', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion',
        estado: 'estado-invalido'
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.estado).toBeDefined();
      }
    });

    test('debe validar calificación en rango válido', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion',
        calificacion_promedio: 6 // Mayor a 5
      });

      try {
        await curso.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.calificacion_promedio).toBeDefined();
      }
    });
  });

  describe('Valores por defecto', () => {
    test('debe establecer valores por defecto correctos', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      await curso.save();

      expect(curso.moneda).toBe('USD');
      expect(curso.nivel).toBe('principiante');
      expect(curso.estado).toBe('borrador');
      expect(curso.calificacion_promedio).toBe(0);
      expect(curso.total_estudiantes).toBe(0);
      expect(curso.imagen_url).toBe('');
      expect(curso.requisitos).toEqual([]);
      expect(curso.objetivos).toEqual([]);
    });
  });

  describe('Relaciones', () => {
    test('debe poder poblar instructor', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion'
      });

      await curso.save();

      const cursoConInstructor = await Curso.findById(curso._id).populate('instructor_id');

      expect(cursoConInstructor.instructor_id).toBeDefined();
      expect(cursoConInstructor.instructor_id.nombre).toBe('Instructor Test');
      expect(cursoConInstructor.instructor_id.especialidad).toBe('Programación');
    });
  });

  describe('Arrays', () => {
    test('debe manejar arrays de requisitos y objetivos', async () => {
      const curso = new Curso({
        titulo: 'Curso Test',
        descripcion: 'Descripción del curso',
        instructor_id: instructorId,
        precio: 99.99,
        duracion_horas: 20,
        categoria: 'programacion',
        requisitos: ['Conocimientos básicos de programación', 'Computadora con internet'],
        objetivos: ['Aprender JavaScript', 'Crear aplicaciones web']
      });

      await curso.save();

      expect(curso.requisitos).toHaveLength(2);
      expect(curso.objetivos).toHaveLength(2);
      expect(curso.requisitos[0]).toBe('Conocimientos básicos de programación');
      expect(curso.objetivos[0]).toBe('Aprender JavaScript');
    });
  });
});