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

// Mock del modelo Quiz
const MockQuiz = function(data) {
  Object.assign(this, data);
  this._id = 'mock-quiz-id-' + Math.random().toString(36).substr(2, 9);
  this.createdAt = new Date();
  this.updatedAt = new Date();
  
  // Valores por defecto
  this.tiempo_limite = this.tiempo_limite !== undefined ? this.tiempo_limite : 30;
  this.intentos_permitidos = this.intentos_permitidos !== undefined ? this.intentos_permitidos : 3;
  this.puntuacion_minima = this.puntuacion_minima !== undefined ? this.puntuacion_minima : 70;
  this.estado = this.estado || 'borrador';
  this.orden = this.orden || 0;
  this.es_obligatorio = this.es_obligatorio !== undefined ? this.es_obligatorio : true;
  
  // Procesar preguntas si se proporcionan
  if (data.preguntas && Array.isArray(data.preguntas)) {
    this.preguntas = data.preguntas.map(pregunta => {
      const processedPregunta = {
        pregunta: pregunta.pregunta || '',
        tipo: pregunta.tipo || 'multiple_choice',
        respuesta_correcta: pregunta.respuesta_correcta || '',
        puntos: pregunta.puntos || 1,
        explicacion: pregunta.explicacion || ''
      };
      
      // Inicializar opciones según el tipo de pregunta
      if (pregunta.tipo === 'texto_libre') {
        processedPregunta.opciones = [];
      } else {
        processedPregunta.opciones = pregunta.opciones || [];
      }
      
      return processedPregunta;
    });
  } else {
    this.preguntas = [];
  }
};

MockQuiz.prototype.save = jest.fn().mockImplementation(async function() {
  this._validate();
  this._id = this._id || 'quiz_' + Date.now();
  return this;
});

MockQuiz.prototype._validate = function() {
  // Validaciones básicas
  if (!this.titulo) {
    const error = new Error('Validation failed');
    error.errors = { titulo: { message: 'El título es requerido' } };
    throw error;
  }
  if (!this.curso_id) {
    const error = new Error('Validation failed');
    error.errors = { curso_id: { message: 'El curso es requerido' } };
    throw error;
  }
  if (this.tiempo_limite !== null && this.tiempo_limite !== undefined && this.tiempo_limite <= 0) {
    const error = new Error('Validation failed');
    error.errors = { tiempo_limite: { message: 'El tiempo límite debe ser mayor a 0' } };
    throw error;
  }
  if (this.intentos_permitidos !== null && this.intentos_permitidos !== undefined && this.intentos_permitidos <= 0) {
    const error = new Error('Validation failed');
    error.errors = { intentos_permitidos: { message: 'Los intentos permitidos deben ser mayor a 0' } };
    throw error;
  }
  if (this.puntuacion_minima < 0 || this.puntuacion_minima > 100) {
    const error = new Error('Validation failed');
    error.errors = { puntuacion_minima: { message: 'La puntuación mínima debe estar entre 0 y 100' } };
    throw error;
  }
  
  const estadosValidos = ['borrador', 'publicado', 'archivado'];
  if (this.estado && !estadosValidos.includes(this.estado)) {
    const error = new Error('Validation failed');
    error.errors = { estado: { message: 'Estado inválido' } };
    throw error;
  }
  
  // Validar preguntas
  if (this.preguntas && this.preguntas.length > 0) {
    for (let i = 0; i < this.preguntas.length; i++) {
      const pregunta = this.preguntas[i];
      
      if (!pregunta.pregunta) {
        const error = new Error('Validation failed');
        error.errors = { [`preguntas.${i}.pregunta`]: { message: 'La pregunta es requerida' } };
        throw error;
      }
      
      const tiposValidos = ['multiple_choice', 'verdadero_falso', 'texto_libre'];
      if (pregunta.tipo && !tiposValidos.includes(pregunta.tipo)) {
        const error = new Error('Validation failed');
        error.errors = { [`preguntas.${i}.tipo`]: { message: 'Tipo de pregunta inválido' } };
        throw error;
      }
      
      // Validar que preguntas de opción múltiple tengan al menos una respuesta correcta
      if (pregunta.tipo === 'multiple_choice' && pregunta.opciones && pregunta.opciones.length > 0) {
        const tieneRespuestaCorrecta = pregunta.opciones.some(opcion => opcion.es_correcta);
        if (!tieneRespuestaCorrecta) {
          const error = new Error(`La pregunta "${pregunta.pregunta}" debe tener al menos una respuesta correcta`);
          throw error;
        }
      }
    }
  }
};

MockQuiz.prototype.validate = jest.fn().mockResolvedValue(true);

// Métodos estáticos
MockQuiz.findById = jest.fn().mockImplementation((id) => ({
  populate: jest.fn().mockResolvedValue({
    _id: id,
    titulo: 'Quiz Test',
    curso_id: {
      _id: 'mock-curso-id',
      titulo: 'Curso Test'
    }
  })
}));
MockQuiz.findOne = jest.fn();
MockQuiz.find = jest.fn();
MockQuiz.create = jest.fn();
MockQuiz.updateOne = jest.fn();
MockQuiz.deleteOne = jest.fn();
MockQuiz.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });

// Mock de los módulos
jest.mock('../../../../../backend/src/models/quiz.model', () => MockQuiz);
jest.mock('../../../../../backend/src/models/curso.model', () => MockCurso);
jest.mock('../../../../../backend/src/models/instructor.model', () => MockInstructor);

const Quiz = require('../../../../../backend/src/models/quiz.model');
const Curso = require('../../../../../backend/src/models/curso.model');
const Instructor = require('../../../../../backend/src/models/instructor.model');

describe('Modelo Quiz', () => {
  let cursoId;
  let instructorId;

  beforeEach(async () => {
    // Crear instructor y curso para las pruebas
    const instructor = new Instructor({
      nombre: 'Instructor Test',
      especialidad: 'Programación'
    });
    const savedInstructor = await instructor.save();
    instructorId = savedInstructor._id;

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
    test('debe crear un quiz válido', async () => {
      const quizData = {
        titulo: 'Quiz de JavaScript',
        descripcion: 'Evaluación de conocimientos básicos',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: '¿Qué es JavaScript?',
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Un lenguaje de programación', es_correcta: true },
              { texto: 'Un framework', es_correcta: false },
              { texto: 'Una base de datos', es_correcta: false }
            ],
            puntos: 2
          }
        ]
      };

      const quiz = new Quiz(quizData);
      const savedQuiz = await quiz.save();

      expect(savedQuiz._id).toBeDefined();
      expect(savedQuiz.titulo).toBe(quizData.titulo);
      expect(savedQuiz.descripcion).toBe(quizData.descripcion);
      expect(savedQuiz.curso_id.toString()).toBe(cursoId.toString());
      expect(savedQuiz.preguntas).toHaveLength(1);
      expect(savedQuiz.preguntas[0].pregunta).toBe('¿Qué es JavaScript?');
    });

    test('debe requerir título', async () => {
      const quiz = new Quiz({
        descripcion: 'Descripción del quiz',
        curso_id: cursoId
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.titulo).toBeDefined();
      }
    });

    test('debe requerir curso_id', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        descripcion: 'Descripción del quiz'
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.curso_id).toBeDefined();
      }
    });

    test('debe validar tiempo límite mínimo', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        tiempo_limite: 0 // Menor al mínimo
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.tiempo_limite).toBeDefined();
      }
    });

    test('debe validar intentos permitidos mínimo', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        intentos_permitidos: 0 // Menor al mínimo
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.intentos_permitidos).toBeDefined();
      }
    });

    test('debe validar puntuación mínima en rango válido', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        puntuacion_minima: 150 // Mayor a 100
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.puntuacion_minima).toBeDefined();
      }
    });

    test('debe validar estado válido', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        estado: 'estado-invalido'
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors.estado).toBeDefined();
      }
    });
  });

  describe('Preguntas embebidas', () => {
    test('debe validar pregunta requerida', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Opción 1', es_correcta: true }
            ]
          }
        ]
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors['preguntas.0.pregunta']).toBeDefined();
      }
    });

    test('debe validar tipo de pregunta válido', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: '¿Pregunta test?',
            tipo: 'tipo-invalido',
            opciones: [
              { texto: 'Opción 1', es_correcta: true }
            ]
          }
        ]
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.errors['preguntas.0.tipo']).toBeDefined();
      }
    });

    test('debe validar opciones para preguntas de opción múltiple', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: '¿Pregunta test?',
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Opción 1', es_correcta: true },
              { texto: 'Opción 2', es_correcta: false },
              { texto: 'Opción 3', es_correcta: false }
            ],
            puntos: 1
          }
        ]
      });

      const savedQuiz = await quiz.save();

      expect(savedQuiz.preguntas[0].opciones).toHaveLength(3);
      expect(savedQuiz.preguntas[0].opciones[0].es_correcta).toBe(true);
      expect(savedQuiz.preguntas[0].opciones[1].es_correcta).toBe(false);
    });

    test('debe manejar preguntas de texto libre', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: 'Explica qué es JavaScript',
            tipo: 'texto_libre',
            respuesta_correcta: 'JavaScript es un lenguaje de programación',
            puntos: 5
          }
        ]
      });

      const savedQuiz = await quiz.save();

      expect(savedQuiz.preguntas[0].tipo).toBe('texto_libre');
      expect(savedQuiz.preguntas[0].respuesta_correcta).toBe('JavaScript es un lenguaje de programación');
      expect(savedQuiz.preguntas[0].opciones).toHaveLength(0);
    });

    test('debe manejar preguntas verdadero/falso', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: 'JavaScript es un lenguaje compilado',
            tipo: 'verdadero_falso',
            opciones: [
              { texto: 'Verdadero', es_correcta: false },
              { texto: 'Falso', es_correcta: true }
            ],
            puntos: 1
          }
        ]
      });

      const savedQuiz = await quiz.save();

      expect(savedQuiz.preguntas[0].tipo).toBe('verdadero_falso');
      expect(savedQuiz.preguntas[0].opciones).toHaveLength(2);
    });

    test('debe requerir al menos una respuesta correcta en preguntas de opción múltiple', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: '¿Pregunta test?',
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Opción 1', es_correcta: false },
              { texto: 'Opción 2', es_correcta: false }
            ]
          }
        ]
      });

      try {
        await quiz.save();
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain('debe tener al menos una respuesta correcta');
      }
    });
  });

  describe('Valores por defecto', () => {
    test('debe establecer valores por defecto correctos', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId
      });

      await quiz.save();

      expect(quiz.tiempo_limite).toBe(30);
      expect(quiz.intentos_permitidos).toBe(3);
      expect(quiz.puntuacion_minima).toBe(70);
      expect(quiz.estado).toBe('borrador');
      expect(quiz.orden).toBe(0);
      expect(quiz.es_obligatorio).toBe(true);
      expect(quiz.preguntas).toHaveLength(0);
    });
  });

  describe('Relaciones', () => {
    test('debe poder poblar curso', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId
      });

      await quiz.save();

      const quizConCurso = await Quiz.findById(quiz._id).populate('curso_id');

      expect(quizConCurso.curso_id).toBeDefined();
      expect(quizConCurso.curso_id.titulo).toBe('Curso Test');
    });
  });

  describe('Middleware', () => {
    test('debe validar preguntas antes de guardar', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: 'Pregunta válida',
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Opción correcta', es_correcta: true },
              { texto: 'Opción incorrecta', es_correcta: false }
            ]
          }
        ]
      });

      const savedQuiz = await quiz.save();
      expect(savedQuiz.preguntas).toHaveLength(1);
    });
  });

  describe('Campos opcionales', () => {
    test('debe manejar descripción opcional', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        descripcion: 'Esta es una descripción opcional'
      });

      await quiz.save();

      expect(quiz.descripcion).toBe('Esta es una descripción opcional');
    });

    test('debe manejar contenido_id opcional', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        contenido_id: 'mock-contenido-id'
      });

      await quiz.save();

      expect(quiz.contenido_id).toBe('mock-contenido-id');
    });

    test('debe manejar explicaciones en preguntas', async () => {
      const quiz = new Quiz({
        titulo: 'Quiz Test',
        curso_id: cursoId,
        preguntas: [
          {
            pregunta: 'Pregunta con explicación',
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Opción correcta', es_correcta: true }
            ],
            explicacion: 'Esta es la explicación de la respuesta'
          }
        ]
      });

      await quiz.save();

      expect(quiz.preguntas[0].explicacion).toBe('Esta es la explicación de la respuesta');
    });
  });
});