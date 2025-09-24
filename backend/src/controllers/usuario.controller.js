const Progreso = require("../models/progreso.model");
const Inscripcion = require("../models/inscripcion.model");
const Curso = require("../models/curso.model");
const Contenido = require("../models/contenido.model");
const Usuario = require("../models/usuario.model");
const Estudiante = require("../models/estudiante.model");
const Instructor = require("../models/instructor.model");
const Pago = require("../models/pago.model");

// Obtener el progreso del usuario actual
exports.getProgresoUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    // Obtener inscripciones del usuario
    const inscripciones = await Inscripcion.find({
      estudiante_id: req.usuario.estudiante_id,
    }).populate("curso_id");

    // Obtener progresos del usuario
    const progresos = await Progreso.find({
      estudiante_id: req.usuario.estudiante_id,
    }).populate({
      path: "contenido_id",
      populate: {
        path: "curso_id",
        select: "titulo",
      },
    });

    // Calcular estadísticas
    const totalCoursesEnrolled = inscripciones.length;

    // Agrupar progresos por curso
    const progresosPorCurso = {};
    progresos.forEach((progreso) => {
      const cursoId = progreso.contenido_id.curso_id._id.toString();
      if (!progresosPorCurso[cursoId]) {
        progresosPorCurso[cursoId] = {
          curso: progreso.contenido_id.curso_id,
          contenidosCompletados: 0,
          totalContenidos: 0,
        };
      }

      if (progreso.fecha_completado) {
        progresosPorCurso[cursoId].contenidosCompletados += 1;
      }
    });

    // Obtener el total de contenidos por curso
    for (const cursoId in progresosPorCurso) {
      const totalContenidos = await Contenido.countDocuments({
        curso_id: cursoId,
      });
      progresosPorCurso[cursoId].totalContenidos = totalContenidos;
    }

    // Calcular cursos completados y progreso general
    let cursosCompletados = 0;
    let totalProgresoAcumulado = 0;

    for (const cursoId in progresosPorCurso) {
      const { contenidosCompletados, totalContenidos } =
        progresosPorCurso[cursoId];

      if (totalContenidos > 0) {
        const progresoCurso = Math.round(
          (contenidosCompletados / totalContenidos) * 100
        );
        progresosPorCurso[cursoId].progreso = progresoCurso;
        totalProgresoAcumulado += progresoCurso;

        if (progresoCurso === 100) {
          cursosCompletados += 1;
        }
      } else {
        progresosPorCurso[cursoId].progreso = 0;
      }
    }

    // Calcular progreso general
    const overallProgress =
      totalCoursesEnrolled > 0
        ? Math.round(totalProgresoAcumulado / totalCoursesEnrolled)
        : 0;

    // Calcular tiempo total de aprendizaje (simulado por ahora)
    const totalLearningTime = Math.round(progresos.length * 0.5); // Asumiendo 30 minutos por contenido

    // Generar logros basados en el progreso
    const achievements = [];

    if (cursosCompletados > 0) {
      achievements.push({
        id: 1,
        title: "Primer curso completado",
        description: "Has completado tu primer curso",
        date: new Date(),
      });
    }

    if (totalLearningTime >= 10) {
      achievements.push({
        id: 2,
        title: "Estudiante dedicado",
        description: "Has estudiado más de 10 horas",
        date: new Date(),
      });
    }

    // Generar actividades recientes basadas en progresos
    const recentActivities = progresos
      .filter((p) => p.fecha_completado)
      .sort(
        (a, b) => new Date(b.fecha_completado) - new Date(a.fecha_completado)
      )
      .slice(0, 5)
      .map((p, index) => ({
        id: index + 1,
        type: "course_progress",
        description: `Completaste el contenido en el curso ${p.contenido_id.curso_id.titulo}`,
        date: p.fecha_completado,
      }));

    const progresoData = {
      overallProgress,
      totalCoursesEnrolled,
      coursesCompleted: cursosCompletados,
      totalLearningTime,
      achievements,
      recentActivities,
    };

    res.status(200).json(progresoData);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Obtener estadísticas del usuario actual
exports.getEstadisticasUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    // Obtener inscripciones del usuario
    const inscripciones = await Inscripcion.find({
      estudiante_id: req.usuario.estudiante_id,
    }).populate("curso_id");

    // Obtener progresos del usuario
    const progresos = await Progreso.find({
      estudiante_id: req.usuario.estudiante_id,
    }).populate({
      path: "contenido_id",
      populate: {
        path: "curso_id",
        select: "titulo",
      },
    });

    // Agrupar progresos por curso
    const progresosPorCurso = {};
    progresos.forEach((progreso) => {
      const cursoId = progreso.contenido_id.curso_id._id.toString();
      if (!progresosPorCurso[cursoId]) {
        progresosPorCurso[cursoId] = {
          curso: progreso.contenido_id.curso_id,
          contenidosCompletados: 0,
          totalContenidos: 0,
        };
      }

      if (progreso.fecha_completado) {
        progresosPorCurso[cursoId].contenidosCompletados += 1;
      }
    });

    // Obtener el total de contenidos por curso
    for (const cursoId in progresosPorCurso) {
      const totalContenidos = await Contenido.countDocuments({
        curso_id: cursoId,
      });
      progresosPorCurso[cursoId].totalContenidos = totalContenidos;
    }

    // Calcular cursos completados y en progreso
    let cursosCompletados = 0;
    let cursosEnProgreso = 0;

    for (const cursoId in progresosPorCurso) {
      const { contenidosCompletados, totalContenidos } =
        progresosPorCurso[cursoId];

      if (totalContenidos > 0) {
        const progresoCurso = Math.round(
          (contenidosCompletados / totalContenidos) * 100
        );

        if (progresoCurso === 100) {
          cursosCompletados += 1;
        } else if (progresoCurso > 0) {
          cursosEnProgreso += 1;
        }
      }
    }

    // Calcular tiempo total de aprendizaje (simulado por ahora)
    const tiempoTotalAprendizaje = Math.round(progresos.length * 0.5); // Asumiendo 30 minutos por contenido

    // Obtener último acceso (simulado por ahora)
    const ultimoAcceso = new Date();

    // Obtener certificados (simulado por ahora)
    const certificadosObtenidos = cursosCompletados;

    const statsData = {
      cursosCompletados,
      cursosEnProgreso,
      tiempoTotalAprendizaje,
      ultimoAcceso,
      certificadosObtenidos,
    };

    res.status(200).json(statsData);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Obtener todos los usuarios (solo admin)
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .populate('estudiante_id', 'telefono fecha_nacimiento')
      .populate('instructor_id', 'especialidad biografia')
      .select('-password')
      .sort({ createdAt: -1 });

    // Formatear datos para el frontend con cálculo de cursos inscritos
    const usuariosFormateados = await Promise.all(usuarios.map(async (usuario) => {
      let cursosInscritos = [];
      
      // Si el usuario es estudiante, obtener sus inscripciones
      if (usuario.estudiante_id) {
        const inscripciones = await Inscripcion.find({ 
          estudiante_id: usuario.estudiante_id 
        }).populate('curso_id', 'titulo');
        cursosInscritos = inscripciones.map(inscripcion => inscripcion.curso_id);
      }

      return {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
        telefono: usuario.telefono || '',
        fecha_registro: usuario.fecha_registro || usuario.createdAt,
        ultimo_acceso: usuario.ultimo_acceso || usuario.updatedAt,
        avatar: usuario.avatar,
        biografia: usuario.biografia || '',
        direccion: usuario.direccion || '',
        cursos_inscritos: cursosInscritos // Array de objetos de curso para que el frontend pueda calcular .length
      };
    }));

    res.status(200).json({
      success: true,
      data: usuariosFormateados
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo usuario (solo admin)
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono, estado, biografia, direccion } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear el usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
      rol: rol || 'estudiante',
      telefono: telefono || '',
      estado: estado || 'activo',
      biografia: biografia || '',
      direccion: direccion || ''
    });

    await nuevoUsuario.save();

    // Crear perfil específico según el rol
    if (rol === 'student' || rol === 'estudiante') {
      const estudiante = new Estudiante({
        usuario_id: nuevoUsuario._id,
        telefono: telefono || ''
      });
      await estudiante.save();
      nuevoUsuario.estudiante_id = estudiante._id;
    } else if (rol === 'instructor') {
      const instructor = new Instructor({
        usuario_id: nuevoUsuario._id,
        telefono: telefono || '',
        especialidad: '',
        biografia: ''
      });
      await instructor.save();
      nuevoUsuario.instructor_id = instructor._id;
    }

    await nuevoUsuario.save();

    // Retornar usuario sin password
    const usuarioRespuesta = await Usuario.findById(nuevoUsuario._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: usuarioRespuesta
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar usuario (solo admin)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, telefono, estado, biografia, direccion } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el email ya existe (excluyendo el usuario actual)
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ email, _id: { $ne: id } });
      if (emailExistente) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (rol) usuario.rol = rol;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (estado) usuario.estado = estado;
    if (biografia !== undefined) usuario.biografia = biografia;
    if (direccion !== undefined) usuario.direccion = direccion;

    await usuario.save();

    // Actualizar perfil específico si hay teléfono
    if (telefono) {
      if (usuario.estudiante_id) {
        await Estudiante.findByIdAndUpdate(usuario.estudiante_id, { telefono });
      } else if (usuario.instructor_id) {
        await Instructor.findByIdAndUpdate(usuario.instructor_id, { telefono });
      }
    }

    const usuarioActualizado = await Usuario.findById(id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar usuario (solo admin)
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Eliminar perfiles relacionados
    if (usuario.estudiante_id) {
      await Estudiante.findByIdAndDelete(usuario.estudiante_id);
    }
    if (usuario.instructor_id) {
      await Instructor.findByIdAndDelete(usuario.instructor_id);
    }

    // Eliminar usuario
    await Usuario.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener usuario por ID (solo admin)
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id)
      .populate('estudiante_id')
      .populate('instructor_id')
      .select('-password');

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas administrativas (solo admin)
exports.getEstadisticasAdmin = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const usuarios = await Usuario.find()
      .populate('estudiante_id')
      .populate('instructor_id')
      .select('-password');

    // Obtener todos los cursos
    const cursos = await Curso.find().populate('instructor_id');

    // Obtener todas las inscripciones
    const inscripciones = await Inscripcion.find()
      .populate('curso_id', 'titulo precio')
      .populate('estudiante_id');

    // Obtener todos los progresos
    const progresos = await Progreso.find()
      .populate({
        path: 'contenido_id',
        populate: {
          path: 'curso_id',
          select: 'titulo'
        }
      });

    // Calcular estadísticas básicas
    const totalUsers = usuarios.length;
    const totalCourses = cursos.length;
    const activeStudents = usuarios.filter(
      u => u.rol === 'estudiante' && u.estado === 'activo'
    ).length;

    // Calcular cursos completados correctamente
    const cursosCompletados = await calcularCursosCompletados();

    // Calcular ingresos totales
    const totalRevenue = inscripciones.reduce((sum, inscripcion) => {
      return sum + (inscripcion.curso_id?.precio || 0);
    }, 0);

    // Calcular crecimiento mensual (simulado por ahora)
    const fechaActual = new Date();
    const fechaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);
    const fechaDosMesesAntes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 2, 1);
    
    const usuariosEsteMes = usuarios.filter(u => 
      new Date(u.createdAt) >= fechaMesAnterior
    ).length;
    const usuariosMesAnterior = usuarios.filter(u => 
      new Date(u.createdAt) < fechaMesAnterior && 
      new Date(u.createdAt) >= fechaDosMesesAntes
    ).length;
    
    const monthlyGrowth = usuariosMesAnterior > 0 
      ? ((usuariosEsteMes - usuariosMesAnterior) / usuariosMesAnterior) * 100 
      : 0;

    // Calcular crecimiento de cursos
    const cursosEsteMes = cursos.filter(c => 
      new Date(c.fecha_creacion || c.createdAt) >= fechaMesAnterior
    ).length;
    const cursosMesAnterior = cursos.filter(c => 
      new Date(c.fecha_creacion || c.createdAt) < fechaMesAnterior && 
      new Date(c.fecha_creacion || c.createdAt) >= fechaDosMesesAntes
    ).length;
    
    const courseGrowth = cursosMesAnterior > 0 
      ? ((cursosEsteMes - cursosMesAnterior) / cursosMesAnterior) * 100 
      : 0;

    // Calcular crecimiento de ingresos
    const ingresosEsteMes = inscripciones
      .filter(i => new Date(i.fecha_inscripcion || i.createdAt) >= fechaMesAnterior)
      .reduce((sum, i) => sum + (i.curso_id?.precio || 0), 0);
    const ingresosMesAnterior = inscripciones
      .filter(i => 
        new Date(i.fecha_inscripcion || i.createdAt) < fechaMesAnterior && 
        new Date(i.fecha_inscripcion || i.createdAt) >= fechaDosMesesAntes
      )
      .reduce((sum, i) => sum + (i.curso_id?.precio || 0), 0);
    
    const revenueGrowth = ingresosMesAnterior > 0 
      ? ((ingresosEsteMes - ingresosMesAnterior) / ingresosMesAnterior) * 100 
      : 0;

    // Calcular crecimiento de inscripciones
    const inscripcionesEsteMes = inscripciones.filter(i => 
      new Date(i.fecha_inscripcion || i.createdAt) >= fechaMesAnterior
    ).length;
    const inscripcionesMesAnterior = inscripciones.filter(i => 
      new Date(i.fecha_inscripcion || i.createdAt) < fechaMesAnterior && 
      new Date(i.fecha_inscripcion || i.createdAt) >= fechaDosMesesAntes
    ).length;
    
    const enrollmentGrowth = inscripcionesMesAnterior > 0 
      ? ((inscripcionesEsteMes - inscripcionesMesAnterior) / inscripcionesMesAnterior) * 100 
      : 0;

    // Calcular actividad reciente
    const recentActivity = await generarActividadReciente(inscripciones, progresos);

    // Calcular cursos más populares con revenue y rating
    const topCourses = await generarDatosCursosPopulares();

    // Generar datos de gráficos
    const userGrowth = generarDatosCrecimientoUsuarios(usuarios);
    const revenueData = generarDatosIngresos(inscripciones);

    const estadisticas = {
      totalUsers,
      totalCourses,
      activeStudents,
      completedCourses: cursosCompletados,
      totalRevenue,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      courseGrowth: Math.round(courseGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      enrollmentGrowth: Math.round(enrollmentGrowth * 100) / 100,
      recentActivity,
      topCourses,
      userGrowth,
      revenueData
    };

    res.status(200).json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    console.error('Error al obtener estadísticas administrativas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función auxiliar para calcular cursos completados
async function calcularCursosCompletados() {
  try {
    const inscripciones = await Inscripcion.find().populate('curso_id estudiante_id');
    let cursosCompletados = 0;

    for (const inscripcion of inscripciones) {
      if (!inscripcion.curso_id || !inscripcion.estudiante_id) continue;

      // Obtener total de contenidos del curso
      const totalContenidos = await Contenido.countDocuments({
        curso_id: inscripcion.curso_id._id
      });

      if (totalContenidos === 0) continue;

      // Obtener contenidos completados por el estudiante
      const contenidosCompletados = await Progreso.countDocuments({
        estudiante_id: inscripcion.estudiante_id._id,
        contenido_id: { 
          $in: await Contenido.find({ curso_id: inscripcion.curso_id._id }).select('_id') 
        },
        fecha_completado: { $ne: null }
      });

      // Si completó el 100% del curso
      if (contenidosCompletados === totalContenidos) {
        cursosCompletados++;
      }
    }

    return cursosCompletados;
  } catch (error) {
    console.error('Error al calcular cursos completados:', error);
    return 0;
  }
}

// Función auxiliar para generar actividad reciente
async function generarActividadReciente(inscripciones, progresos) {
  const actividades = [];

  // Inscripciones recientes (últimos 10)
  const inscripcionesRecientes = inscripciones
    .sort((a, b) => new Date(b.fecha_inscripcion) - new Date(a.fecha_inscripcion))
    .slice(0, 5);

  inscripcionesRecientes.forEach(inscripcion => {
    if (inscripcion.estudiante_id && inscripcion.curso_id) {
      actividades.push({
        id: inscripcion._id,
        type: 'enrollment',
        user: inscripcion.estudiante_id.nombre || 'Usuario',
        action: `se inscribió en ${inscripcion.curso_id.titulo}`,
        time: getTimeAgo(inscripcion.fecha_inscripcion)
      });
    }
  });

  // Progresos recientes (últimos 5)
  const progresosRecientes = progresos
    .filter(p => p.fecha_completado)
    .sort((a, b) => new Date(b.fecha_completado) - new Date(a.fecha_completado))
    .slice(0, 5);

  progresosRecientes.forEach(progreso => {
    if (progreso.contenido_id?.curso_id) {
      actividades.push({
        id: progreso._id,
        type: 'progress',
        user: 'Estudiante',
        action: `completó contenido en ${progreso.contenido_id.curso_id.titulo}`,
        time: getTimeAgo(progreso.fecha_completado)
      });
    }
  });

  return actividades.slice(0, 10);
}

// Función auxiliar para calcular cursos populares
function calcularCursosPopulares(inscripciones) {
  const cursosCount = {};

  inscripciones.forEach(inscripcion => {
    if (inscripcion.curso_id) {
      const cursoId = inscripcion.curso_id._id.toString();
      if (!cursosCount[cursoId]) {
        cursosCount[cursoId] = {
          id: cursoId,
          title: inscripcion.curso_id.titulo,
          enrollments: 0
        };
      }
      cursosCount[cursoId].enrollments++;
    }
  });

  return Object.values(cursosCount)
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 5);
}

// Función auxiliar para generar datos de crecimiento de usuarios
function generarDatosCrecimientoUsuarios(usuarios) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const datos = [];

  meses.forEach((mes, index) => {
    const fechaInicio = new Date(2024, index, 1);
    const fechaFin = new Date(2024, index + 1, 0);
    
    const usuariosDelMes = usuarios.filter(u => {
      const fechaCreacion = new Date(u.createdAt);
      return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
    }).length;

    datos.push({
      month: mes,
      users: usuariosDelMes
    });
  });

  return datos;
}

// Función auxiliar para generar datos de ingresos mensuales
function generarDatosIngresos(inscripciones) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const datos = [];

  meses.forEach((mes, index) => {
    const fechaInicio = new Date(2024, index, 1);
    const fechaFin = new Date(2024, index + 1, 0);
    
    const ingresosDelMes = inscripciones.filter(i => {
      const fechaInscripcion = new Date(i.fecha_inscripcion);
      return fechaInscripcion >= fechaInicio && fechaInscripcion <= fechaFin;
    }).reduce((total, inscripcion) => {
      return total + (inscripcion.curso_id?.precio || 0);
    }, 0);

    datos.push({
      month: mes,
      revenue: ingresosDelMes
    });
  });

  return datos;
}


// Función auxiliar para calcular tiempo transcurrido
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  } else if (diffInHours > 0) {
    return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  } else {
    return 'hace unos minutos';
  }
}

// Función para generar datos de cursos populares con revenue y rating
async function generarDatosCursosPopulares() {
  try {
    // Obtener todos los cursos con sus datos básicos
    const cursos = await Curso.find({ estado: 'publicado' })
      .select('titulo precio calificacion_promedio total_estudiantes')
      .lean();

    // Obtener pagos completados para calcular ingresos por curso
    const pagos = await Pago.find({ estado: 'completado' })
      .populate('curso_id', 'titulo')
      .lean();

    // Calcular ingresos por curso
    const ingresosPorCurso = {};
    pagos.forEach(pago => {
      if (pago.curso_id) {
        const cursoId = pago.curso_id._id.toString();
        if (!ingresosPorCurso[cursoId]) {
          ingresosPorCurso[cursoId] = 0;
        }
        ingresosPorCurso[cursoId] += pago.monto;
      }
    });

    // Combinar datos de cursos con ingresos
    const cursosConDatos = cursos.map(curso => ({
      id: curso._id.toString(),
      title: curso.titulo,
      revenue: ingresosPorCurso[curso._id.toString()] || 0,
      rating: curso.calificacion_promedio || 0,
      enrollments: curso.total_estudiantes || 0,
      price: curso.precio || 0
    }));

    // Ordenar por rating (más popular) y luego por ingresos
    const cursosOrdenados = cursosConDatos
      .sort((a, b) => {
        // Primero por rating (descendente)
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Si el rating es igual, ordenar por ingresos (descendente)
        return b.revenue - a.revenue;
      })
      .slice(0, 5); // Top 5 cursos

    return cursosOrdenados;
  } catch (error) {
    console.error('Error al generar datos de cursos populares:', error);
    return [];
  }
}
