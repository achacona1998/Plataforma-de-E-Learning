# 🚀 Backend - Plataforma de E-Learning

API RESTful construida con Node.js y Express.js que proporciona todos los servicios backend para la plataforma de e-learning.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Modelos de Datos](#-modelos-de-datos)
- [Middleware](#-middleware)
- [Servicios](#-servicios)
- [Scripts](#-scripts)
- [Despliegue](#-despliegue)

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema seguro de autenticación y autorización
- 👥 **Gestión de Usuarios** - Estudiantes, instructores y administradores
- 📚 **Gestión de Cursos** - CRUD completo para cursos y contenido
- 📊 **Seguimiento de Progreso** - Monitoreo detallado del avance estudiantil
- 🏆 **Certificados Digitales** - Generación automática de certificados PDF
- 💳 **Pagos Integrados** - Stripe y PayPal para procesamiento de pagos
- 📧 **Notificaciones Email** - Sistema de notificaciones SMTP
- 🔍 **API RESTful** - Endpoints bien estructurados y documentados
- 🛡️ **Seguridad** - Validación, sanitización y protección CORS
- 📁 **Gestión de Archivos** - Upload y manejo de contenido multimedia

## 🛠 Tecnologías

### Core
- **Node.js** (v18+) - Runtime de JavaScript
- **Express.js** (v4.21+) - Framework web
- **MongoDB** (v6+) - Base de datos NoSQL
- **Mongoose** (v8.13+) - ODM para MongoDB

### Autenticación y Seguridad
- **jsonwebtoken** - Tokens JWT
- **bcryptjs** - Encriptación de contraseñas
- **cors** - Cross-Origin Resource Sharing

### Servicios Externos
- **Stripe** - Procesamiento de pagos
- **PayPal** - Pagos alternativos
- **Nodemailer** - Envío de emails

### Utilidades
- **PDFKit** - Generación de certificados PDF
- **dotenv** - Gestión de variables de entorno
- **nodemon** - Hot reload en desarrollo

## ⚡ Instalación

### Prerrequisitos
- Node.js v18 o superior
- MongoDB v6 o superior
- npm o pnpm

### Pasos de Instalación

1. **Navegar al directorio backend**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

4. **Editar el archivo .env** con tus configuraciones

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

## ⚙️ Configuración

### Variables de Entorno Principales

```env
# Servidor
PORT=5000
NODE_ENV=development

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/elearning-platform

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRES_IN=24h

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@elearning.com

# CORS
CORS_ORIGIN=http://localhost:5173
```

Para ver todas las variables disponibles, consulta `.env.example`.

## 📁 Estructura del Proyecto

```
backend/
├── 📁 src/
│   ├── 📁 config/              # Configuraciones
│   │   └── 📄 config.js        # Configuración de la aplicación
│   ├── 📁 controllers/         # Controladores de rutas
│   │   ├── 📄 auth.controller.js
│   │   ├── 📄 curso.controller.js
│   │   ├── 📄 usuario.controller.js
│   │   ├── 📄 inscripcion.controller.js
│   │   ├── 📄 progreso.controller.js
│   │   ├── 📄 certificado.controller.js
│   │   ├── 📄 pago.controller.js
│   │   ├── 📄 stripe.controller.js
│   │   ├── 📄 paypal.controller.js
│   │   ├── 📄 quiz.controller.js
│   │   └── 📄 ...
│   ├── 📁 middleware/          # Middleware personalizado
│   │   ├── 📄 auth.middleware.js
│   │   └── 📄 error.middleware.js
│   ├── 📁 models/              # Modelos de MongoDB
│   │   ├── 📄 usuario.model.js
│   │   ├── 📄 curso.model.js
│   │   ├── 📄 inscripcion.model.js
│   │   ├── 📄 progreso.model.js
│   │   ├── 📄 certificado.model.js
│   │   └── 📄 ...
│   ├── 📁 routes/              # Definición de rutas
│   │   ├── 📄 auth.routes.js
│   │   ├── 📄 curso.routes.js
│   │   ├── 📄 usuario.routes.js
│   │   └── 📄 ...
│   ├── 📁 services/            # Servicios de negocio
│   │   └── 📄 certificateGenerator.js
│   ├── 📁 scripts/             # Scripts de utilidad
│   │   └── 📄 seed.js          # Datos de prueba
│   └── 📄 index.js             # Punto de entrada
├── 📁 uploads/                 # Archivos subidos
│   └── 📁 certificates/        # Certificados generados
├── 📄 package.json
├── 📄 .env.example
└── 📄 Dockerfile.prod
```

## 🔌 API Endpoints

### Autenticación
```http
POST   /api/auth/register       # Registro de usuario
POST   /api/auth/login          # Inicio de sesión
POST   /api/auth/logout         # Cerrar sesión
POST   /api/auth/refresh        # Renovar token
POST   /api/auth/forgot-password # Recuperar contraseña
POST   /api/auth/reset-password  # Restablecer contraseña
```

### Usuarios
```http
GET    /api/usuarios/perfil     # Obtener perfil del usuario
PUT    /api/usuarios/perfil     # Actualizar perfil
GET    /api/usuarios/progreso   # Obtener progreso del usuario
DELETE /api/usuarios/cuenta     # Eliminar cuenta
```

### Cursos
```http
GET    /api/cursos              # Listar todos los cursos
POST   /api/cursos              # Crear nuevo curso (instructor)
GET    /api/cursos/:id          # Obtener curso específico
PUT    /api/cursos/:id          # Actualizar curso (instructor)
DELETE /api/cursos/:id          # Eliminar curso (instructor)
GET    /api/cursos/:id/contenido # Obtener contenido del curso
```

### Inscripciones
```http
GET    /api/inscripciones       # Listar inscripciones del usuario
POST   /api/inscripciones       # Inscribirse a un curso
GET    /api/inscripciones/:id   # Obtener inscripción específica
DELETE /api/inscripciones/:id   # Cancelar inscripción
```

### Progreso
```http
GET    /api/progresos           # Obtener todo el progreso
POST   /api/progresos           # Actualizar progreso
GET    /api/progresos/:cursoId  # Progreso de curso específico
PUT    /api/progresos/:id       # Actualizar progreso específico
```

### Certificados
```http
GET    /api/certificados        # Listar certificados del usuario
POST   /api/certificados        # Generar nuevo certificado
GET    /api/certificados/:id    # Obtener certificado específico
GET    /api/certificados/:id/download # Descargar certificado PDF
```

### Pagos
```http
POST   /api/stripe/create-payment-intent    # Crear intención de pago Stripe
POST   /api/stripe/webhook                  # Webhook de Stripe
POST   /api/paypal/create-order             # Crear orden PayPal
POST   /api/paypal/capture-order            # Capturar pago PayPal
GET    /api/pagos                           # Historial de pagos
```

### Quizzes
```http
GET    /api/quizzes/:cursoId    # Obtener quizzes de un curso
POST   /api/quizzes             # Crear nuevo quiz (instructor)
PUT    /api/quizzes/:id         # Actualizar quiz
DELETE /api/quizzes/:id         # Eliminar quiz
POST   /api/respuestas-quiz     # Enviar respuestas de quiz
GET    /api/respuestas-quiz/:quizId # Obtener respuestas de quiz
```

### Health Check
```http
GET    /api/health              # Estado del servidor
```

## 📊 Modelos de Datos

### Usuario
```javascript
{
  nombre: String,
  email: String (unique),
  password: String (hashed),
  rol: ['estudiante', 'instructor', 'admin'],
  fechaRegistro: Date,
  activo: Boolean,
  perfil: {
    telefono: String,
    biografia: String,
    avatar: String
  }
}
```

### Curso
```javascript
{
  titulo: String,
  descripcion: String,
  instructor: ObjectId (ref: Usuario),
  precio: Number,
  duracion: Number,
  nivel: ['principiante', 'intermedio', 'avanzado'],
  categoria: String,
  imagen: String,
  activo: Boolean,
  fechaCreacion: Date,
  contenido: [ObjectId] (ref: Contenido)
}
```

### Inscripción
```javascript
{
  estudiante: ObjectId (ref: Usuario),
  curso: ObjectId (ref: Curso),
  fechaInscripcion: Date,
  estado: ['activa', 'completada', 'cancelada'],
  progreso: Number (0-100),
  fechaCompletacion: Date
}
```

### Progreso
```javascript
{
  estudiante: ObjectId (ref: Usuario),
  curso: ObjectId (ref: Curso),
  contenido: ObjectId (ref: Contenido),
  completado: Boolean,
  fechaCompletacion: Date,
  tiempoEstudio: Number,
  puntuacion: Number
}
```

## 🛡️ Middleware

### Autenticación (`auth.middleware.js`)
- Verifica tokens JWT
- Extrae información del usuario
- Protege rutas privadas

### Manejo de Errores (`error.middleware.js`)
- Captura errores globales
- Formatea respuestas de error
- Logging de errores

### Ejemplo de Uso
```javascript
// Ruta protegida
router.get('/perfil', authMiddleware, getUserProfile);

// Ruta con manejo de errores
app.use(errorHandler);
```

## 🔧 Servicios

### Generador de Certificados (`certificateGenerator.js`)
- Genera certificados PDF personalizados
- Incluye información del curso y estudiante
- Almacena certificados en el sistema de archivos

```javascript
const certificate = await generateCertificate({
  studentName: 'Juan Pérez',
  courseName: 'React Avanzado',
  completionDate: new Date(),
  instructorName: 'María García'
});
```

## 📜 Scripts

### Seed de Datos (`scripts/seed.js`)
Pobla la base de datos con datos de prueba:

```bash
node src/scripts/seed.js
```

Crea:
- Usuarios de ejemplo (estudiantes, instructores, admin)
- Cursos de muestra
- Inscripciones de prueba
- Progreso simulado

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Docker
```bash
# Construir imagen
docker build -f Dockerfile.prod -t elearning-backend .

# Ejecutar contenedor
docker run -p 5000:5000 --env-file .env elearning-backend
```

### Variables de Entorno de Producción
Asegúrate de configurar:
- `MONGODB_URI` con tu cluster de MongoDB Atlas
- `JWT_SECRET` con una clave segura
- Credenciales de Stripe/PayPal
- Configuración SMTP para emails
- `CORS_ORIGIN` con tu dominio de producción

## 📝 Notas de Desarrollo

### Convenciones de Código
- Usar camelCase para variables y funciones
- Usar PascalCase para modelos y clases
- Incluir JSDoc para funciones complejas
- Manejar errores con try-catch

### Testing
```bash
# Ejecutar tests (cuando estén implementados)
npm test
```

### Logging
El servidor incluye logging básico. Para producción, considera implementar:
- Winston para logging avanzado
- Morgan para logging de requests HTTP
- Monitoreo con herramientas como New Relic

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de conexión a MongoDB**
   - Verificar `MONGODB_URI` en `.env`
   - Asegurar que MongoDB esté ejecutándose

2. **Error de autenticación JWT**
   - Verificar `JWT_SECRET` en `.env`
   - Comprobar que el token no haya expirado

3. **Error de CORS**
   - Configurar `CORS_ORIGIN` correctamente
   - Verificar que el frontend esté en la URL permitida

4. **Error de upload de archivos**
   - Verificar permisos de la carpeta `uploads/`
   - Comprobar límites de tamaño de archivo

---

Para más información, consulta el README principal del proyecto o contacta al equipo de desarrollo.