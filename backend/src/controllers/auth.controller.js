const Usuario = require("../models/usuario.model");
const Estudiante = require("../models/estudiante.model");
const Instructor = require("../models/instructor.model");

// Registrar un nuevo usuario
exports.registro = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        status: "error",
        message: "El email ya está registrado",
      });
    }

    // Crear el perfil correspondiente según el rol
    let perfilId;
    if (rol === "estudiante") {
      const nuevoEstudiante = await Estudiante.create({
        nombre,
        correo: email,
        fecha_registro: Date.now(),
      });
      perfilId = { estudiante_id: nuevoEstudiante._id };
    } else if (rol === "instructor") {
      const nuevoInstructor = await Instructor.create({
        nombre,
        especialidad: req.body.especialidad || "General",
      });
      perfilId = { instructor_id: nuevoInstructor._id };
    }

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol,
      ...perfilId,
    });

    // Generar token JWT
    const token = usuario.generarJWT();

    res.status(201).json({
      status: "success",
      token,
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si se proporcionaron email y password
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Por favor proporcione email y contraseña",
      });
    }

    // Buscar usuario y seleccionar explícitamente el campo password
    const usuario = await Usuario.findOne({ email }).select("+password");

    // Verificar si el usuario existe y la contraseña es correcta
    if (!usuario || !(await usuario.verificarPassword(password))) {
      return res.status(401).json({
        status: "error",
        message: "Email o contraseña incorrectos",
      });
    }

    // Actualizar último acceso
    usuario.ultimo_acceso = new Date();
    await usuario.save();

    // Generar token JWT
    const token = usuario.generarJWT();

    res.status(200).json({
      status: "success",
      token,
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Obtener el perfil del usuario actual
exports.getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
      .populate("estudiante_id")
      .populate("instructor_id");

    if (!usuario) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          estudiante: usuario.estudiante_id,
          instructor: usuario.instructor_id,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
