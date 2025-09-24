// API Base URL
export const API_BASE_URL = 'http://localhost:5000';

// Rutas de la API
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  USERS: '/api/usuarios',
  COURSES: '/api/cursos',
  ENROLLMENTS: '/api/inscripciones',
  CERTIFICATES: '/api/certificados',
  PAYMENTS: '/api/pagos',
  STATISTICS: '/api/estadisticas',
  REPORTS: '/api/reportes',
  SETTINGS: '/api/configuracion'
};

// Estados de usuario
export const USER_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  SUSPENDED: 'suspendido'
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'estudiante'
};

// Estados de curso
export const COURSE_STATUS = {
  DRAFT: 'borrador',
  PUBLISHED: 'publicado',
  ARCHIVED: 'archivado'
};

// Niveles de curso
export const COURSE_LEVELS = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado'
};

// Categorías de curso
export const COURSE_CATEGORIES = [
  'Desarrollo Web',
  'Desarrollo Móvil',
  'Ciencia de Datos',
  'Inteligencia Artificial',
  'Ciberseguridad',
  'Diseño UX/UI',
  'Marketing Digital',
  'Gestión de Proyectos',
  'Idiomas',
  'Otros'
];

// Estados de certificado
export const CERTIFICATE_STATUS = {
  ISSUED: 'issued',
  PENDING: 'pending',
  EXPIRED: 'expired',
  REVOKED: 'revoked'
};

// Estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Métodos de pago
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer'
};

// Rangos de tiempo para reportes
export const TIME_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.'
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  CREATED: 'Creado exitosamente',
  UPDATED: 'Actualizado exitosamente',
  DELETED: 'Eliminado exitosamente',
  SAVED: 'Guardado exitosamente'
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/ogg']
  }
};

// Configuración de validación
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#1f2937',
  SECONDARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4'
};