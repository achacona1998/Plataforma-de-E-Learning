const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

// Middleware para proteger rutas y verificar autenticación
exports.proteger = async (req, res, next) => {
  try {
    let token;

    // Verificar si hay token en el header de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No está autorizado para acceder a esta ruta'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto_temporal');

    // Verificar si el usuario aún existe
    const usuarioActual = await Usuario.findById(decoded.id);
    if (!usuarioActual) {
      return res.status(401).json({
        status: 'error',
        message: 'El usuario ya no existe'
      });
    }

    // Guardar usuario en req para uso posterior
    req.usuario = usuarioActual;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware para restringir acceso según roles
exports.restringirA = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        status: 'error',
        message: 'No tiene permiso para realizar esta acción'
      });
    }
    next();
  };
};

// Middleware específico para verificar si el usuario es administrador
exports.esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};

// Middleware específico para verificar si el usuario es instructor
exports.esInstructor = (req, res, next) => {
  if (req.usuario.rol !== 'instructor' && req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de instructor'
    });
  }
  next();
};

// Middleware específico para verificar si el usuario es estudiante
exports.esEstudiante = (req, res, next) => {
  if (req.usuario.rol !== 'estudiante' && req.usuario.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de estudiante'
    });
  }
  next();
};