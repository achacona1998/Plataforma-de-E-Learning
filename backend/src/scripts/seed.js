const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar modelos
const Usuario = require('../models/usuario.model');
const Estudiante = require('../models/estudiante.model');
const Instructor = require('../models/instructor.model');
const Curso = require('../models/curso.model');
const Contenido = require('../models/contenido.model');
const Inscripcion = require('../models/inscripcion.model');
const Progreso = require('../models/progreso.model');
const Certificado = require('../models/certificado.model');
const Quiz = require('../models/quiz.model');
const RespuestaQuiz = require('../models/respuesta-quiz.model');
const Pago = require('../models/pago.model');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Limpiar base de datos
const clearDatabase = async () => {
  try {
    await Usuario.deleteMany({});
    await Estudiante.deleteMany({});
    await Instructor.deleteMany({});
    await Curso.deleteMany({});
    await Contenido.deleteMany({});
    await Inscripcion.deleteMany({});
    await Progreso.deleteMany({});
    await Certificado.deleteMany({});
    await Quiz.deleteMany({});
    await RespuestaQuiz.deleteMany({});
    await Pago.deleteMany({});
    console.log('🧹 Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error);
  }
};

// Crear usuarios
const createUsers = async () => {
  try {
    const users = [
      {
        nombre: 'Admin Principal',
        email: 'admin@elearning.com',
        password: 'admin123',
        rol: 'admin',
        estado: 'activo',
        telefono: '+1-555-0001',
        biografia: 'Administrador principal del sistema de e-learning.',
        direccion: 'Oficina Central, Ciudad'
      },
      {
        nombre: 'Dr. María García',
        email: 'maria.garcia@elearning.com',
        password: 'instructor123',
        rol: 'instructor',
        estado: 'activo',
        telefono: '+1-555-0002',
        biografia: 'Doctora en Ciencias de la Computación especializada en desarrollo web.',
        direccion: 'Universidad Tecnológica, Ciudad'
      },
      {
        nombre: 'Prof. Carlos Rodríguez',
        email: 'carlos.rodriguez@elearning.com',
        password: 'instructor123',
        rol: 'instructor',
        estado: 'activo',
        telefono: '+1-555-0003',
        biografia: 'Profesor de Ciencia de Datos con 10 años de experiencia.',
        direccion: 'Instituto de Datos, Ciudad'
      },
      {
        nombre: 'Ana Martínez',
        email: 'ana.martinez@elearning.com',
        password: 'instructor123',
        rol: 'instructor',
        estado: 'activo',
        telefono: '+1-555-0004',
        biografia: 'Diseñadora UX/UI con experiencia en startups tecnológicas.',
        direccion: 'Estudio de Diseño, Ciudad'
      },
      {
        nombre: 'Juan Pérez',
        email: 'juan.perez@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1001',
        biografia: 'Estudiante de ingeniería interesado en desarrollo web.',
        direccion: 'Residencia Estudiantil, Ciudad'
      },
      {
        nombre: 'Laura Sánchez',
        email: 'laura.sanchez@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1002',
        biografia: 'Profesional en marketing buscando especializarse en marketing digital.',
        direccion: 'Barrio Norte, Ciudad'
      },
      {
        nombre: 'Miguel Torres',
        email: 'miguel.torres@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1003',
        biografia: 'Analista de datos junior interesado en machine learning.',
        direccion: 'Centro, Ciudad'
      },
      {
        nombre: 'Sofia López',
        email: 'sofia.lopez@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1004',
        biografia: 'Diseñadora gráfica explorando el diseño UX/UI.',
        direccion: 'Zona Creativa, Ciudad'
      },
      {
        nombre: 'Diego Morales',
        email: 'diego.morales@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1005',
        biografia: 'Emprendedor buscando conocimientos en gestión de startups.',
        direccion: 'Distrito Empresarial, Ciudad'
      },
      {
        nombre: 'Carmen Ruiz',
        email: 'carmen.ruiz@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1006',
        biografia: 'Fotógrafa profesional interesada en técnicas digitales.',
        direccion: 'Barrio Artístico, Ciudad'
      },
      {
        nombre: 'Roberto Silva',
        email: 'roberto.silva@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'inactivo',
        telefono: '+1-555-1007',
        biografia: 'Desarrollador junior en pausa académica.',
        direccion: 'Suburbios, Ciudad'
      },
      {
        nombre: 'Valentina Castro',
        email: 'valentina.castro@estudiante.com',
        password: 'estudiante123',
        rol: 'estudiante',
        estado: 'activo',
        telefono: '+1-555-1008',
        biografia: 'Estudiante de idiomas interesada en inglés técnico.',
        direccion: 'Campus Universitario, Ciudad'
      }
    ];

    const createdUsers = await Usuario.insertMany(users);
    console.log(`✅ ${createdUsers.length} usuarios creados`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    return [];
  }
};

// Crear estudiantes
const createStudents = async (users) => {
  try {
    const studentUsers = users.filter(user => user.rol === 'estudiante');
    const students = studentUsers.map(user => ({
      nombre: user.nombre,
      correo: user.email,
      fecha_registro: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Fecha aleatoria en el último año
    }));

    const createdStudents = await Estudiante.insertMany(students);
    
    // Actualizar usuarios con estudiante_id
    for (let i = 0; i < studentUsers.length; i++) {
      await Usuario.findByIdAndUpdate(studentUsers[i]._id, {
        estudiante_id: createdStudents[i]._id
      });
    }

    console.log(`✅ ${createdStudents.length} estudiantes creados`);
    return createdStudents;
  } catch (error) {
    console.error('❌ Error creando estudiantes:', error);
    return [];
  }
};

// Crear instructores
const createInstructors = async (users) => {
  try {
    const instructorUsers = users.filter(user => user.rol === 'instructor');
    const instructors = [
      {
        nombre: 'Dr. María García',
        especialidad: 'Desarrollo Web'
      },
      {
        nombre: 'Prof. Carlos Rodríguez',
        especialidad: 'Ciencia de Datos'
      },
      {
        nombre: 'Ana Martínez',
        especialidad: 'Diseño UX/UI'
      }
    ];

    const createdInstructors = await Instructor.insertMany(instructors);
    
    // Actualizar usuarios con instructor_id
    for (let i = 0; i < instructorUsers.length; i++) {
      await Usuario.findByIdAndUpdate(instructorUsers[i]._id, {
        instructor_id: createdInstructors[i]._id
      });
    }

    console.log(`✅ ${createdInstructors.length} instructores creados`);
    return createdInstructors;
  } catch (error) {
    console.error('❌ Error creando instructores:', error);
    return [];
  }
};

// Crear cursos
const createCourses = async (instructors) => {
  try {
    const courses = [
      {
        titulo: 'Desarrollo Web Full Stack con React y Node.js',
        descripcion: 'Aprende a crear aplicaciones web completas desde cero utilizando las tecnologías más demandadas del mercado.',
        instructor_id: instructors[0]._id,
        precio: 99.99,
        moneda: 'USD',
        duracion_horas: 40,
        categoria: 'programacion',
        nivel: 'intermedio',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Conocimientos básicos de HTML y CSS', 'Familiaridad con JavaScript'],
        objetivos: ['Crear aplicaciones web completas', 'Dominar React y Node.js', 'Implementar APIs REST'],
        calificacion_promedio: 4.8,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-01-15')
      },
      {
        titulo: 'Python para Ciencia de Datos y Machine Learning',
        descripcion: 'Domina Python y sus librerías más importantes para análisis de datos y machine learning.',
        instructor_id: instructors[1]._id,
        precio: 89.99,
        moneda: 'USD',
        duracion_horas: 35,
        categoria: 'ciencias',
        nivel: 'intermedio',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Conocimientos básicos de programación', 'Matemáticas básicas'],
        objetivos: ['Analizar datos con Python', 'Crear modelos de ML', 'Visualizar datos'],
        calificacion_promedio: 4.7,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-02-01')
      },
      {
        titulo: 'Diseño UX/UI: De Principiante a Profesional',
        descripcion: 'Aprende los fundamentos del diseño de experiencia de usuario y interfaces modernas.',
        instructor_id: instructors[2]._id,
        precio: 79.99,
        moneda: 'USD',
        duracion_horas: 30,
        categoria: 'diseño',
        nivel: 'principiante',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Creatividad y ganas de aprender', 'Acceso a herramientas de diseño'],
        objetivos: ['Crear wireframes y prototipos', 'Diseñar interfaces atractivas', 'Aplicar principios UX'],
        calificacion_promedio: 4.9,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-02-15')
      },
      {
        titulo: 'JavaScript Avanzado y Patrones de Diseño',
        descripcion: 'Profundiza en JavaScript moderno, ES6+, y patrones de diseño para desarrolladores.',
        instructor_id: instructors[0]._id,
        precio: 69.99,
        moneda: 'USD',
        duracion_horas: 25,
        categoria: 'programacion',
        nivel: 'avanzado',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Conocimientos sólidos de JavaScript', 'Experiencia en desarrollo web'],
        objetivos: ['Dominar ES6+', 'Implementar patrones de diseño', 'Optimizar código JavaScript'],
        calificacion_promedio: 4.6,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-03-01')
      },
      {
        titulo: 'Marketing Digital y Redes Sociales',
        descripcion: 'Estrategias efectivas de marketing digital para hacer crecer tu negocio online.',
        instructor_id: instructors[2]._id,
        precio: 59.99,
        moneda: 'USD',
        duracion_horas: 20,
        categoria: 'marketing',
        nivel: 'principiante',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Conocimientos básicos de internet', 'Ganas de emprender'],
        objetivos: ['Crear campañas efectivas', 'Gestionar redes sociales', 'Analizar métricas'],
        calificacion_promedio: 4.5,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-03-15')
      },
      {
        titulo: 'Inglés para Programadores',
        descripcion: 'Mejora tu inglés técnico para destacar en el mundo de la programación.',
        instructor_id: instructors[1]._id,
        precio: 49.99,
        moneda: 'USD',
        duracion_horas: 15,
        categoria: 'idiomas',
        nivel: 'intermedio',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Inglés básico', 'Conocimientos de programación'],
        objetivos: ['Comunicarse en inglés técnico', 'Leer documentación', 'Participar en equipos internacionales'],
        calificacion_promedio: 4.4,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-04-01')
      },
      {
        titulo: 'Emprendimiento y Gestión de Startups',
        descripcion: 'Aprende a crear y gestionar tu propia startup desde la idea hasta el lanzamiento.',
        instructor_id: instructors[0]._id,
        precio: 89.99,
        moneda: 'USD',
        duracion_horas: 28,
        categoria: 'negocios',
        nivel: 'intermedio',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Idea de negocio', 'Motivación emprendedora'],
        objetivos: ['Validar ideas de negocio', 'Crear plan de negocios', 'Conseguir financiación'],
        calificacion_promedio: 4.7,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-04-15')
      },
      {
        titulo: 'Fotografía Digital: Técnicas y Composición',
        descripcion: 'Domina la fotografía digital desde los conceptos básicos hasta técnicas avanzadas.',
        instructor_id: instructors[2]._id,
        precio: 65.99,
        moneda: 'USD',
        duracion_horas: 22,
        categoria: 'arte',
        nivel: 'principiante',
        imagen_url: '/placeholder-course.svg',
        estado: 'publicado',
        requisitos: ['Cámara digital o smartphone', 'Pasión por la fotografía'],
        objetivos: ['Dominar composición fotográfica', 'Usar iluminación natural', 'Editar fotos profesionalmente'],
        calificacion_promedio: 4.8,
        total_estudiantes: 0,
        fecha_publicacion: new Date('2024-05-01')
      }
    ];

    const createdCourses = await Curso.insertMany(courses);
    console.log(`✅ ${createdCourses.length} cursos creados`);
    return createdCourses;
  } catch (error) {
    console.error('❌ Error creando cursos:', error);
    return [];
  }
};

// Crear contenidos
const createContent = async (courses) => {
  try {
    const contents = [];
    
    courses.forEach((course, courseIndex) => {
      // Crear 5-8 contenidos por curso
      const numContents = 5 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < numContents; i++) {
        const types = ['video', 'documento', 'quiz'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let duration;
        switch (type) {
          case 'video':
            duration = 10 + Math.floor(Math.random() * 30); // 10-40 minutos
            break;
          case 'documento':
            duration = 5 + Math.floor(Math.random() * 15); // 5-20 minutos
            break;
          case 'quiz':
            duration = 3 + Math.floor(Math.random() * 7); // 3-10 minutos
            break;
        }
        
        contents.push({
          curso_id: course._id,
          tipo: type,
          url: `https://example.com/${type}/${courseIndex + 1}/${i + 1}`,
          duracion: duration
        });
      }
    });

    const createdContents = await Contenido.insertMany(contents);
    console.log(`✅ ${createdContents.length} contenidos creados`);
    return createdContents;
  } catch (error) {
    console.error('❌ Error creando contenidos:', error);
    return [];
  }
};

// Crear inscripciones
const createEnrollments = async (students, courses) => {
  try {
    const enrollments = [];
    
    // Cada estudiante se inscribe en 2-5 cursos aleatorios
    students.forEach(student => {
      const numEnrollments = 2 + Math.floor(Math.random() * 4);
      const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numEnrollments && i < shuffledCourses.length; i++) {
        enrollments.push({
          curso_id: shuffledCourses[i]._id,
          estudiante_id: student._id,
          fecha_inscripcion: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Últimos 6 meses
        });
      }
    });

    const createdEnrollments = await Inscripcion.insertMany(enrollments);
    
    // Actualizar total_estudiantes en cursos
    for (const course of courses) {
      const count = enrollments.filter(e => e.curso_id.toString() === course._id.toString()).length;
      await Curso.findByIdAndUpdate(course._id, { total_estudiantes: count });
    }

    console.log(`✅ ${createdEnrollments.length} inscripciones creadas`);
    return createdEnrollments;
  } catch (error) {
    console.error('❌ Error creando inscripciones:', error);
    return [];
  }
};

// Crear progreso
const createProgress = async (students, contents, enrollments) => {
  try {
    const progressRecords = [];
    
    // Para cada inscripción, crear progreso en algunos contenidos
    for (let enrollmentIndex = 0; enrollmentIndex < enrollments.length; enrollmentIndex++) {
      const enrollment = enrollments[enrollmentIndex];
      const courseContents = contents.filter(c => c.curso_id.toString() === enrollment.curso_id.toString());
      
      let completionRate;
      // Asegurar que al menos 30% de las inscripciones tengan 100% de completado
      if (enrollmentIndex < Math.floor(enrollments.length * 0.3)) {
        completionRate = 1.0; // 100% completado
      } else {
        // Completar entre 30% y 100% del curso para el resto
        completionRate = 0.3 + Math.random() * 0.7;
      }
      
      const numCompleted = Math.floor(courseContents.length * completionRate);
      
      for (let i = 0; i < numCompleted; i++) {
        const completedDate = new Date(
          enrollment.fecha_inscripcion.getTime() + 
          Math.random() * (Date.now() - enrollment.fecha_inscripcion.getTime())
        );
        
        progressRecords.push({
          estudiante_id: enrollment.estudiante_id,
          contenido_id: courseContents[i]._id,
          fecha_completado: completedDate
        });
      }
    }

    const createdProgress = await Progreso.insertMany(progressRecords);
    console.log(`✅ ${createdProgress.length} registros de progreso creados`);
    return createdProgress;
  } catch (error) {
    console.error('❌ Error creando progreso:', error);
    return [];
  }
};

// Crear certificados
const createCertificates = async (students, courses, contents, progressRecords) => {
  try {
    const certificates = [];
    
    // Verificar qué estudiantes han completado cursos al 100%
    for (const student of students) {
      for (const course of courses) {
        const courseContents = contents.filter(c => c.curso_id.toString() === course._id.toString());
        const studentProgress = progressRecords.filter(p => 
          p.estudiante_id.toString() === student._id.toString() &&
          courseContents.some(c => c._id.toString() === p.contenido_id.toString())
        );
        
        // Si completó el 100% del curso, generar certificado
        if (studentProgress.length === courseContents.length && courseContents.length > 0) {
          const completionDate = new Date(Math.max(...studentProgress.map(p => p.fecha_completado)));
          const verificationCode = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          certificates.push({
            estudiante_id: student._id,
            curso_id: course._id,
            fecha_emision: completionDate,
            codigo_verificacion: verificationCode,
            url_certificado: `/uploads/certificates/certificate_${student._id}_${course._id}.pdf`,
            calificacion_final: 80 + Math.floor(Math.random() * 20), // 80-100
            estado: 'activo',
            metadata: {
              duracion_curso: `${course.duracion_horas} horas`,
              instructor_nombre: 'Instructor',
              fecha_completado: completionDate
            }
          });
        }
      }
    }

    if (certificates.length > 0) {
      const createdCertificates = await Certificado.insertMany(certificates);
      console.log(`✅ ${createdCertificates.length} certificados creados`);
      return createdCertificates;
    } else {
      console.log('ℹ️ No se generaron certificados (ningún estudiante completó cursos al 100%)');
      return [];
    }
  } catch (error) {
    console.error('❌ Error creando certificados:', error);
    return [];
  }
};

// Crear quizzes
const createQuizzes = async (courses, contents) => {
  try {
    const quizzes = [];
    
    for (const course of courses) {
      const courseContents = contents.filter(content => content.curso_id.toString() === course._id.toString());
      
      // Quiz de evaluación final del curso
      const finalQuiz = {
        titulo: `Evaluación Final - ${course.titulo}`,
        descripcion: `Evaluación final para el curso ${course.titulo}`,
        curso_id: course._id,
        preguntas: [
          {
            pregunta: '¿Cuál es el concepto más importante del curso?',
            tipo: 'multiple_choice',
            opciones: [
              { texto: 'Fundamentos básicos', es_correcta: true },
              { texto: 'Conceptos avanzados', es_correcta: false },
              { texto: 'Práctica únicamente', es_correcta: false },
              { texto: 'Teoría únicamente', es_correcta: false }
            ],
            puntos: 2,
            explicacion: 'Los fundamentos son la base de todo aprendizaje.'
          },
          {
            pregunta: '¿Consideras que el curso cumplió tus expectativas?',
            tipo: 'verdadero_falso',
            opciones: [
              { texto: 'Verdadero', es_correcta: true },
              { texto: 'Falso', es_correcta: false }
            ],
            puntos: 1,
            explicacion: 'La satisfacción del estudiante es importante.'
          },
          {
            pregunta: '¿Qué aplicarías de este curso en tu trabajo?',
            tipo: 'texto_libre',
            respuesta_correcta: 'Cualquier respuesta constructiva',
            puntos: 2,
            explicacion: 'La aplicación práctica demuestra comprensión.'
          }
        ],
        tiempo_limite: 45,
        intentos_permitidos: 2,
        puntuacion_minima: 70,
        estado: 'publicado',
        orden: 999,
        es_obligatorio: true
      };
      
      quizzes.push(finalQuiz);
      
      // Quiz por cada contenido del curso
      courseContents.forEach((content, index) => {
        const contentQuiz = {
          titulo: `Quiz - ${content.titulo}`,
          descripcion: `Evaluación del contenido: ${content.titulo}`,
          curso_id: course._id,
          contenido_id: content._id,
          preguntas: [
            {
              pregunta: `¿Has completado el contenido "${content.titulo}"?`,
              tipo: 'verdadero_falso',
              opciones: [
                { texto: 'Verdadero', es_correcta: true },
                { texto: 'Falso', es_correcta: false }
              ],
              puntos: 1,
              explicacion: 'Es importante completar todo el contenido.'
            },
            {
              pregunta: `¿Qué tipo de contenido es "${content.titulo}"?`,
              tipo: 'multiple_choice',
              opciones: [
                { texto: content.tipo === 'video' ? 'Video' : 'Otro tipo', es_correcta: content.tipo === 'video' },
                { texto: content.tipo === 'texto' ? 'Texto' : 'Otro tipo', es_correcta: content.tipo === 'texto' },
                { texto: content.tipo === 'pdf' ? 'PDF' : 'Otro tipo', es_correcta: content.tipo === 'pdf' },
                { texto: 'No estoy seguro', es_correcta: false }
              ],
              puntos: 1,
              explicacion: 'Identificar el tipo de contenido ayuda al aprendizaje.'
            }
          ],
          tiempo_limite: 15,
          intentos_permitidos: 3,
          puntuacion_minima: 60,
          estado: 'publicado',
          orden: index + 1,
          es_obligatorio: false
        };
        
        quizzes.push(contentQuiz);
      });
    }
    
    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log(`✅ ${createdQuizzes.length} quizzes creados`);
    return createdQuizzes;
  } catch (error) {
    console.error('❌ Error creando quizzes:', error);
    return [];
  }
};

// Crear respuestas de quizzes
const createQuizResponses = async (students, quizzes) => {
  try {
    const responses = [];
    
    for (const student of students) {
      // Responder algunos quizzes aleatoriamente
      const quizzesToAnswer = quizzes.filter(() => Math.random() > 0.3); // 70% probabilidad de responder
      
      for (const quiz of quizzesToAnswer) {
        const intentos = Math.floor(Math.random() * quiz.intentos_permitidos) + 1;
        
        for (let intento = 1; intento <= intentos; intento++) {
          const respuestas = quiz.preguntas.map(pregunta => {
            let respuesta_seleccionada;
            let es_correcta = false;
            let puntos_obtenidos = 0;
            
            if (pregunta.tipo === 'texto_libre') {
              respuesta_seleccionada = 'Respuesta de ejemplo del estudiante';
              es_correcta = Math.random() > 0.2; // 80% probabilidad de ser correcta
              puntos_obtenidos = es_correcta ? pregunta.puntos : 0;
            } else {
               const opcionCorrecta = pregunta.opciones.find(op => op.es_correcta);
               const probabilidadCorrecta = Math.random();
               
               if (probabilidadCorrecta > 0.25) { // 75% probabilidad de respuesta correcta
                 respuesta_seleccionada = opcionCorrecta ? opcionCorrecta.texto : 'Respuesta correcta';
                 es_correcta = true;
                 puntos_obtenidos = pregunta.puntos;
               } else {
                 const opcionIncorrecta = pregunta.opciones.find(op => !op.es_correcta);
                 respuesta_seleccionada = opcionIncorrecta ? opcionIncorrecta.texto : 'Respuesta incorrecta';
                 es_correcta = false;
                 puntos_obtenidos = 0;
               }
             }
            
            return {
              pregunta_id: pregunta._id,
              respuesta_seleccionada,
              es_correcta,
              puntos_obtenidos
            };
          });
          
          const puntuacion_total = respuestas.reduce((sum, resp) => sum + resp.puntos_obtenidos, 0);
          const puntos_maximos = quiz.preguntas.reduce((sum, preg) => sum + preg.puntos, 0);
          const puntuacion_porcentaje = Math.round((puntuacion_total / puntos_maximos) * 100);
          
          const tiempoInicio = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Últimos 7 días
          const tiempoTranscurrido = Math.floor(Math.random() * (quiz.tiempo_limite * 60)); // En segundos
          
          const response = {
            estudiante_id: student._id,
            quiz_id: quiz._id,
            respuestas,
            puntuacion_total,
            puntuacion_porcentaje,
            tiempo_inicio: tiempoInicio,
            tiempo_finalizacion: new Date(tiempoInicio.getTime() + tiempoTranscurrido * 1000),
            tiempo_transcurrido: tiempoTranscurrido,
            intento_numero: intento,
            estado: 'completado',
            aprobado: puntuacion_porcentaje >= quiz.puntuacion_minima
          };
          
          responses.push(response);
        }
      }
    }
    
    const createdResponses = await RespuestaQuiz.insertMany(responses);
    console.log(`✅ ${createdResponses.length} respuestas de quiz creadas`);
    return createdResponses;
  } catch (error) {
    console.error('❌ Error creando respuestas de quiz:', error);
    return [];
  }
};

// Crear pagos
const createPayments = async (students, courses) => {
  try {
    const payments = [];
    
    for (const student of students) {
      // Cada estudiante paga por algunos cursos
      const cursosAPagar = courses.filter(() => Math.random() > 0.4); // 60% probabilidad de pagar
      
      for (const course of cursosAPagar) {
        const metodoPago = ['stripe', 'paypal', 'transferencia'][Math.floor(Math.random() * 3)];
        const estado = ['completado', 'pendiente', 'fallido'][Math.floor(Math.random() * 3)];
        const moneda = ['USD', 'EUR', 'MXN'][Math.floor(Math.random() * 3)];
        
        const payment = {
          estudiante_id: student._id,
          curso_id: course._id,
          monto: course.precio || Math.floor(Math.random() * 200) + 50, // Entre $50 y $250
          moneda,
          metodo_pago: metodoPago,
          estado,
          transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fecha_pago: estado === 'completado' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
          fecha_vencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000),
          detalles_facturacion: {
            nombre: student.nombre,
            email: student.correo,
            direccion: `Calle ${Math.floor(Math.random() * 999) + 1}`,
            ciudad: 'Ciudad Ejemplo',
            codigo_postal: `${Math.floor(Math.random() * 90000) + 10000}`,
            pais: 'País Ejemplo'
          },
          metadata: {
            ip_address: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            descuento_aplicado: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0,
            codigo_promocional: Math.random() > 0.8 ? 'DESCUENTO2024' : null
          }
        };
        
        if (metodoPago === 'stripe') {
          payment.stripe_payment_intent_id = `pi_${Math.random().toString(36).substr(2, 24)}`;
        } else if (metodoPago === 'paypal') {
          payment.paypal_order_id = `PAY-${Math.random().toString(36).substr(2, 17).toUpperCase()}`;
        }
        
        payments.push(payment);
      }
    }
    
    const createdPayments = await Pago.insertMany(payments);
    console.log(`✅ ${createdPayments.length} pagos creados`);
    return createdPayments;
  } catch (error) {
    console.error('❌ Error creando pagos:', error);
    return [];
  }
};

// Función principal
const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');
    
    await connectDB();
    await clearDatabase();
    
    const users = await createUsers();
    const students = await createStudents(users);
    const instructors = await createInstructors(users);
    const courses = await createCourses(instructors);
    const contents = await createContent(courses);
    const enrollments = await createEnrollments(students, courses);
    const progressRecords = await createProgress(students, contents, enrollments);
    const certificates = await createCertificates(students, courses, contents, progressRecords);
    const quizzes = await createQuizzes(courses, contents);
    const quizResponses = await createQuizResponses(students, quizzes);
    const payments = await createPayments(students, courses);
    
    console.log('\n🎉 ¡Seeding completado exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   👥 Usuarios: ${users.length}`);
    console.log(`   🎓 Estudiantes: ${students.length}`);
    console.log(`   👨‍🏫 Instructores: ${instructors.length}`);
    console.log(`   📚 Cursos: ${courses.length}`);
    console.log(`   📄 Contenidos: ${contents.length}`);
    console.log(`   📝 Inscripciones: ${enrollments.length}`);
    console.log(`   📈 Registros de progreso: ${progressRecords.length}`);
    console.log(`   🏆 Certificados: ${certificates.length}`);
    console.log(`   ❓ Quizzes: ${quizzes.length}`);
    console.log(`   📋 Respuestas de quiz: ${quizResponses.length}`);
    console.log(`   💳 Pagos: ${payments.length}`);
    
    console.log('\n🔑 Credenciales de prueba:');
    console.log('   Admin: admin@elearning.com / admin123');
    console.log('   Instructor: maria.garcia@elearning.com / instructor123');
    console.log('   Estudiante: juan.perez@estudiante.com / estudiante123');
    
  } catch (error) {
    console.error('❌ Error en el seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };