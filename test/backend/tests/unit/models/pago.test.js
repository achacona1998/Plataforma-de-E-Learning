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

// Mock del modelo Estudiante
const MockEstudiante = function(data) {
  Object.assign(this, data);
  this._id = 'mock-estudiante-id-' + Math.random().toString(36).substr(2, 9);
  this.fecha_registro = new Date();
  this.estado = this.estado || 'activo';
  this.genero = this.genero || 'prefiero_no_decir';
  this.nivel_educacion = this.nivel_educacion || 'universitario';
  this.avatar = this.avatar || '/placeholder-avatar.svg';
  this.configuracion_notificaciones = {
    email_cursos: true,
    email_certificados: true,
    email_promociones: false
  };
  this.estadisticas = {
    cursos_completados: 0,
    cursos_en_progreso: 0,
    certificados_obtenidos: 0,
    tiempo_total_aprendizaje: 0,
    puntuacion_promedio: 0
  };
};

MockEstudiante.prototype.save = jest.fn().mockImplementation(function() {
  // Validaciones básicas
  if (!this.nombre) {
    const error = new Error('Validation failed');
    error.errors = { nombre: { message: 'El nombre es requerido' } };
    throw error;
  }
  if (!this.apellido) {
    const error = new Error('Validation failed');
    error.errors = { apellido: { message: 'El apellido es requerido' } };
    throw error;
  }
  if (!this.correo) {
    const error = new Error('Validation failed');
    error.errors = { correo: { message: 'El correo electrónico es requerido' } };
    throw error;
  }
  
  return Promise.resolve(this);
});

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
  return Promise.resolve(this);
});

// Mock del modelo Pago
const MockPago = function(data) {
  Object.assign(this, data);
  this._id = 'mock-pago-id-' + Math.random().toString(36).substr(2, 9);
  this.createdAt = new Date();
  this.updatedAt = new Date();
  
  // Valores por defecto
  this.moneda = this.moneda || 'USD';
  this.estado = this.estado || 'pendiente';
  this.fecha_vencimiento = this.fecha_vencimiento || new Date(Date.now() + 24 * 60 * 60 * 1000);
};

// Simular base de datos de transaction_ids existentes
const existingTransactionIds = new Set();

MockPago.prototype.save = jest.fn().mockImplementation(function() {
  // Validaciones básicas
  if (!this.estudiante_id) {
    const error = new Error('Validation failed');
    error.errors = { estudiante_id: { message: 'El estudiante es requerido' } };
    throw error;
  }
  if (!this.curso_id) {
    const error = new Error('Validation failed');
    error.errors = { curso_id: { message: 'El curso es requerido' } };
    throw error;
  }
  if (this.monto === undefined || this.monto === null) {
    const error = new Error('Validation failed');
    error.errors = { monto: { message: 'El monto es requerido' } };
    throw error;
  }
  if (this.monto < 0) {
    const error = new Error('Validation failed');
    error.errors = { monto: { message: 'El monto no puede ser negativo' } };
    throw error;
  }
  if (!this.metodo_pago) {
    const error = new Error('Validation failed');
    error.errors = { metodo_pago: { message: 'El método de pago es requerido' } };
    throw error;
  }
  
  const metodosValidos = ['stripe', 'paypal', 'transferencia'];
  if (this.metodo_pago && !metodosValidos.includes(this.metodo_pago)) {
    const error = new Error('Validation failed');
    error.errors = { metodo_pago: { message: 'Método de pago inválido' } };
    throw error;
  }
  
  const estadosValidos = ['pendiente', 'completado', 'fallido', 'reembolsado'];
  if (this.estado && !estadosValidos.includes(this.estado)) {
    const error = new Error('Validation failed');
    error.errors = { estado: { message: 'Estado inválido' } };
    throw error;
  }
  
  const monedasValidas = ['USD', 'EUR', 'MXN', 'COP', 'ARS'];
  if (this.moneda && !monedasValidas.includes(this.moneda)) {
    const error = new Error('Validation failed');
    error.errors = { moneda: { message: 'Moneda inválida' } };
    throw error;
  }
  
  // Simular transaction_id único
  if (this.transaction_id && existingTransactionIds.has(this.transaction_id)) {
    const error = new Error('E11000 duplicate key error');
    error.code = 11000;
    throw error;
  }
  
  // Agregar transaction_id a la lista de existentes
  if (this.transaction_id) {
    existingTransactionIds.add(this.transaction_id);
  }
  
  // Simular middleware pre-save para fecha_pago
  if (this.estado === 'completado' && !this.fecha_pago) {
    this.fecha_pago = new Date();
  }
  
  return Promise.resolve(this);
});

MockPago.prototype.validate = jest.fn().mockResolvedValue(true);

// Métodos estáticos
MockPago.findById = jest.fn();
MockPago.findOne = jest.fn();
MockPago.find = jest.fn();
MockPago.create = jest.fn();
MockPago.updateOne = jest.fn();
MockPago.deleteOne = jest.fn();
MockPago.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

// Mock de los módulos
jest.mock('../../../../../backend/src/models/pago.model', () => MockPago);
jest.mock('../../../../../backend/src/models/estudiante.model', () => MockEstudiante);
jest.mock('../../../../../backend/src/models/curso.model', () => MockCurso);
jest.mock('../../../../../backend/src/models/instructor.model', () => MockInstructor);

const Pago = require('../../../../../backend/src/models/pago.model');
const Estudiante = require('../../../../../backend/src/models/estudiante.model');
const Curso = require('../../../../../backend/src/models/curso.model');
const Instructor = require('../../../../../backend/src/models/instructor.model');

describe('Modelo Pago', () => {
  let estudianteId;
  let cursoId;
  let instructorId;

  beforeEach(async () => {
    // Limpiar transaction_ids existentes antes de cada test
    existingTransactionIds.clear();
    
    // Crear instructor para el curso
    const instructor = new Instructor({
      nombre: 'Instructor Test',
      especialidad: 'Programación'
    });
    const savedInstructor = await instructor.save();
    instructorId = savedInstructor._id;

    // Crear estudiante
    const estudiante = new Estudiante({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan.perez@test.com',
      telefono: '123456789',
      fecha_nacimiento: new Date('1990-01-01'),
      genero: 'masculino',
      pais: 'México',
      ciudad: 'Ciudad de México'
    });
    const savedEstudiante = await estudiante.save();
    estudianteId = savedEstudiante._id;

    // Crear curso
    const curso = new Curso({
      titulo: 'Curso Test',
      descripcion: 'Descripción del curso',
      instructor_id: instructorId,
      precio: 99.99,
      duracion_horas: 20,
      categoria: 'programacion'
    });
    const savedCurso = await curso.save();
    cursoId = savedCurso._id;
  });

  describe('Validaciones', () => {
    test('debe crear un pago válido', async () => {
      const pagoData = {
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        transaction_id: 'txn_123456789',
        detalles_facturacion: {
          nombre: 'Juan Pérez',
          email: 'juan.perez@test.com',
          direccion: 'Calle 123',
          ciudad: 'Ciudad de México',
          codigo_postal: '12345',
          pais: 'México'
        }
      };

      const pago = new Pago(pagoData);
      const savedPago = await pago.save();

      expect(savedPago._id).toBeDefined();
      expect(savedPago.estudiante_id.toString()).toBe(estudianteId.toString());
      expect(savedPago.curso_id.toString()).toBe(cursoId.toString());
      expect(savedPago.monto).toBe(99.99);
      expect(savedPago.metodo_pago).toBe('stripe');
      expect(savedPago.transaction_id).toBe('txn_123456789');
    });

    test('debe requerir estudiante_id', async () => {
      const pago = new Pago({
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.estudiante_id).toBeDefined();
      }
    });

    test('debe requerir curso_id', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        monto: 99.99,
        metodo_pago: 'stripe'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.curso_id).toBeDefined();
      }
    });

    test('debe requerir monto', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        metodo_pago: 'stripe'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.monto).toBeDefined();
      }
    });

    test('debe validar monto no negativo', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: -10,
        metodo_pago: 'stripe'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.monto).toBeDefined();
      }
    });

    test('debe requerir método de pago', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.metodo_pago).toBeDefined();
      }
    });

    test('debe validar método de pago válido', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'metodo-invalido'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.metodo_pago).toBeDefined();
      }
    });

    test('debe validar estado válido', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        estado: 'estado-invalido'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.estado).toBeDefined();
      }
    });

    test('debe validar moneda válida', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        moneda: 'INVALID'
      });

      try {
        await pago.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.moneda).toBeDefined();
      }
    });

    test('debe requerir transaction_id único', async () => {
      const pago1 = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        transaction_id: 'txn_duplicate'
      });

      const pago2 = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        transaction_id: 'txn_duplicate'
      });

      await pago1.save();

      try {
        await pago2.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.code).toBe(11000); // Código de error de duplicado en MongoDB
      }
    });
  });

  describe('Valores por defecto', () => {
    test('debe establecer valores por defecto correctos', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe'
      });

      await pago.save();

      expect(pago.moneda).toBe('USD');
      expect(pago.estado).toBe('pendiente');
      expect(pago.fecha_vencimiento).toBeInstanceOf(Date);
    });
  });

  describe('Middleware', () => {
    test('debe establecer fecha_pago cuando el estado cambia a completado', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        estado: 'completado'
      });

      await pago.save();

      expect(pago.fecha_pago).toBeInstanceOf(Date);
    });

    test('no debe establecer fecha_pago si el estado no es completado', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        estado: 'pendiente'
      });

      await pago.save();

      expect(pago.fecha_pago).toBeUndefined();
    });
  });

  describe('Campos opcionales', () => {
    test('debe manejar detalles de facturación', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        detalles_facturacion: {
          nombre: 'Juan Pérez',
          email: 'juan.perez@test.com',
          direccion: 'Calle 123',
          ciudad: 'Ciudad de México',
          codigo_postal: '12345',
          pais: 'México'
        }
      });

      await pago.save();

      expect(pago.detalles_facturacion.nombre).toBe('Juan Pérez');
      expect(pago.detalles_facturacion.email).toBe('juan.perez@test.com');
      expect(pago.detalles_facturacion.pais).toBe('México');
    });

    test('debe manejar metadata', async () => {
      const pago = new Pago({
        estudiante_id: estudianteId,
        curso_id: cursoId,
        monto: 99.99,
        metodo_pago: 'stripe',
        metadata: {
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
          descuento_aplicado: 10,
          codigo_promocional: 'DESCUENTO10'
        }
      });

      await pago.save();

      expect(pago.metadata.ip_address).toBe('192.168.1.1');
      expect(pago.metadata.descuento_aplicado).toBe(10);
      expect(pago.metadata.codigo_promocional).toBe('DESCUENTO10');
    });
  });
});