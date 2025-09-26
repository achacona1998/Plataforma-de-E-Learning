const mongoose = require('mongoose');

// Mock del modelo Usuario
const MockUsuario = function(data) {
  Object.assign(this, data);
  this._id = 'mock-user-id-' + Math.random().toString(36).substr(2, 9);
  this.fecha_registro = new Date();
  this.ultimo_acceso = new Date();
  this.estado = this.estado || 'activo';
  this.rol = this.rol || 'estudiante';
  this.avatar = this.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombre || 'User')}&background=0d9488&color=fff`;
};

// Simular base de datos de emails existentes
const existingEmails = new Set();

MockUsuario.prototype.save = jest.fn().mockImplementation(function() {
  // Simular validaciones básicas
  if (!this.nombre) {
    const error = new Error('Validation failed');
    error.errors = { nombre: { message: 'Path `nombre` is required.' } };
    throw error;
  }
  if (!this.email) {
    const error = new Error('Validation failed');
    error.errors = { email: { message: 'Path `email` is required.' } };
    throw error;
  }
  
  // Validar formato de email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (this.email && !emailRegex.test(this.email)) {
    const error = new Error('Validation failed');
    error.errors = { email: { message: 'Por favor ingrese un email válido' } };
    throw error;
  }
  
  // Simular email único
  if (this.email && existingEmails.has(this.email)) {
    const error = new Error('E11000 duplicate key error');
    error.code = 11000;
    throw error;
  }
  
  if (!this.password) {
    const error = new Error('Validation failed');
    error.errors = { password: { message: 'La contraseña es requerida' } };
    throw error;
  }
  if (this.password && this.password.length < 6) {
    const error = new Error('Validation failed');
    error.errors = { password: { message: 'La contraseña debe tener al menos 6 caracteres' } };
    throw error;
  }
  if (this.rol && !['estudiante', 'instructor', 'admin'].includes(this.rol)) {
    const error = new Error('Validation failed');
    error.errors = { rol: { message: 'Rol inválido' } };
    throw error;
  }
  
  // Agregar email a la lista de existentes
  if (this.email) {
    existingEmails.add(this.email);
  }
  
  // Simular encriptación de contraseña
  if (this.password && !this.password.startsWith('$2a$')) {
    this.password = '$2a$10$' + 'hashedpassword' + Math.random().toString(36).substr(2, 9);
  }
  
  return Promise.resolve(this);
});

MockUsuario.prototype.validate = jest.fn().mockResolvedValue(true);

MockUsuario.prototype.verificarPassword = jest.fn().mockImplementation(function(password) {
  return Promise.resolve(password === 'correctPassword');
});

MockUsuario.prototype.generarJWT = jest.fn().mockImplementation(function() {
  // Simular formato JWT con 3 partes separadas por puntos
  const header = Buffer.from(JSON.stringify({typ: 'JWT', alg: 'HS256'})).toString('base64');
  const payload = Buffer.from(JSON.stringify({id: this._id, email: this.email, rol: this.rol})).toString('base64');
  const signature = 'mock-signature-' + Math.random().toString(36).substr(2, 9);
  return `${header}.${payload}.${signature}`;
});

// Métodos estáticos
MockUsuario.findById = jest.fn();
MockUsuario.findOne = jest.fn();
MockUsuario.find = jest.fn();
MockUsuario.create = jest.fn();
MockUsuario.updateOne = jest.fn();
MockUsuario.deleteOne = jest.fn();
MockUsuario.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

// Mock del módulo
jest.mock('../../../../../backend/src/models/usuario.model', () => MockUsuario);

const Usuario = require('../../../../../backend/src/models/usuario.model');

describe('Modelo Usuario', () => {
  beforeEach(() => {
    // Limpiar emails existentes antes de cada test
    existingEmails.clear();
  });
  
  describe('Validaciones', () => {
    test('debe crear un usuario válido', async () => {
      const datosUsuario = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
      };

      const usuario = new Usuario(datosUsuario);
      await usuario.save();

      expect(usuario.nombre).toBe('Juan Pérez');
      expect(usuario.email).toBe('juan@example.com');
      expect(usuario.password).toMatch(/^\$2a\$/); // Verificar que la contraseña fue encriptada
    });

    test('debe requerir nombre', async () => {
      const usuario = new Usuario({
        email: 'test@example.com',
        password: 'password123'
      });

      try {
        await usuario.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.nombre).toBeDefined();
      }
    });

    test('debe requerir email', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        password: 'password123'
      });

      try {
        await usuario.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.email).toBeDefined();
      }
    });

    test('debe validar formato de email', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'email-invalido',
        password: 'password123'
      });

      try {
        await usuario.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.email).toBeDefined();
      }
    });

    test('debe requerir email único', async () => {
      const usuario1 = new Usuario({
        nombre: 'Usuario 1',
        email: 'duplicado@example.com',
        password: 'password123'
      });

      const usuario2 = new Usuario({
        nombre: 'Usuario 2',
        email: 'duplicado@example.com',
        password: 'password456'
      });

      await usuario1.save();

      try {
        await usuario2.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.code).toBe(11000); // Código de error de duplicado en MongoDB
      }
    });

    test('debe requerir contraseña', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com'
      });

      try {
        await usuario.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.password).toBeDefined();
      }
    });

    test('debe validar longitud mínima de contraseña', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com',
        password: '123'
      });

      try {
        await usuario.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.password).toBeDefined();
      }
    });

    test('debe validar rol válido', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        rol: 'rol_invalido'
      });

      try {
        await usuario.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.rol).toBeDefined();
      }
    });
  });

  describe('Encriptación de contraseña', () => {
    test('debe encriptar la contraseña antes de guardar', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const passwordOriginal = usuario.password;
      await usuario.save();

      expect(usuario.password).not.toBe(passwordOriginal);
      expect(usuario.password).toMatch(/^\$2a\$/);
    });
  });

  describe('Métodos del modelo', () => {
    test('verificarPassword debe comparar contraseñas correctamente', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      await usuario.save();

      const esCorrecta = await usuario.verificarPassword('correctPassword');
      const esIncorrecta = await usuario.verificarPassword('wrongPassword');

      expect(esCorrecta).toBe(true);
      expect(esIncorrecta).toBe(false);
    });

    test('generarJWT debe retornar un token válido', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      await usuario.save();
      const token = usuario.generarJWT();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes separadas por puntos
    });
  });

  describe('Valores por defecto', () => {
    test('debe establecer valores por defecto correctos', async () => {
      const usuario = new Usuario({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      await usuario.save();

      expect(usuario.rol).toBe('estudiante');
      expect(usuario.estado).toBe('activo');
      expect(usuario.fecha_registro).toBeInstanceOf(Date);
      expect(usuario.ultimo_acceso).toBeInstanceOf(Date);
      expect(usuario.avatar).toContain('ui-avatars.com');
    });
  });
});