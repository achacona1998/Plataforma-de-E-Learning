# 🎓 Plataforma de E-Learning

Una plataforma completa de aprendizaje en línea que permite a instructores crear cursos y a estudiantes acceder a contenido educativo de calidad con seguimiento de progreso y certificaciones.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🎯 Descripción del Proyecto

### Problema que Resuelve

Las instituciones educativas y emprendedores enfrentan desafíos significativos para ofrecer cursos en línea:

- **Plataformas fragmentadas**: Contenido disperso en YouTube, Google Drive, formularios
- **Falta de seguimiento**: Sin visibilidad del progreso estudiantil
- **Dificultad para escalar**: Colapso con 100+ estudiantes por falta de automatización
- **Acceso no centralizado**: Herramientas múltiples y desconectadas

### Solución Propuesta

Una plataforma unificada que ofrece:

✅ **Creación de cursos estructurados** (módulos, videos, quizzes)  
✅ **Inscripciones y pagos automatizados** (Stripe, PayPal)  
✅ **Seguimiento de progreso** detallado  
✅ **Certificados digitales** al completar cursos  
✅ **Dashboard intuitivo** para estudiantes e instructores  

## 🚀 Características Principales

### Para Estudiantes
- 📚 Explorar y inscribirse en cursos
- 📊 Dashboard personalizado con progreso
- 🎯 Sistema de racha de aprendizaje
- 📈 Estadísticas de estudio en tiempo real
- 🏆 Certificados digitales descargables
- 💳 Pagos seguros integrados

### Para Instructores
- 📝 Crear y gestionar cursos
- 📹 Subir contenido multimedia
- 📋 Crear quizzes y evaluaciones
- 👥 Gestionar estudiantes inscritos
- 📊 Analytics de rendimiento
- 💰 Gestión de ingresos

### Para Administradores
- 🔧 Panel de administración completo
- 👤 Gestión de usuarios y roles
- 📈 Métricas y reportes del sistema
- ⚙️ Configuración de la plataforma

## 🛠 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **PDFKit** - Generación de certificados

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS 4** - Framework de estilos
- **React Router DOM** - Enrutamiento
- **Heroicons** - Iconografía
- **Lucide React** - Iconos adicionales

### DevOps y Producción
- **Docker** - Containerización
- **Docker Compose** - Orquestación de contenedores
- **Nginx** - Servidor web y proxy reverso
- **SSL/TLS** - Certificados de seguridad

### Servicios Externos
- **Stripe** - Procesamiento de pagos
- **PayPal** - Pagos alternativos
- **SMTP** - Envío de emails
- **Redis** - Cache y sesiones

## 🏗 Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│    Frontend     │◄──►│     Backend     │◄──►│    MongoDB      │
│   (React SPA)   │    │  (Express API)  │    │   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│     Nginx       │    │     Redis       │    │   File System   │
│  (Load Balancer)│    │    (Cache)      │    │   (Uploads)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ⚡ Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB (v6 o superior)
- npm o pnpm
- Docker (opcional, para producción)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Plataforma-de-E-Learning
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

3. **Configurar Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Variables de Entorno

Consulta los archivos `.env.example` en cada directorio para las configuraciones necesarias.

## 📖 Uso

### Registro e Inicio de Sesión
1. Accede a la plataforma
2. Regístrate como estudiante o instructor
3. Verifica tu email (si está configurado)
4. Inicia sesión con tus credenciales

### Para Estudiantes
1. Explora el catálogo de cursos
2. Inscríbete en cursos de interés
3. Realiza el pago (si es requerido)
4. Accede al contenido del curso
5. Completa lecciones y quizzes
6. Descarga tu certificado al finalizar

### Para Instructores
1. Accede al panel de instructor
2. Crea un nuevo curso
3. Agrega módulos y contenido
4. Configura precios y acceso
5. Publica el curso
6. Gestiona estudiantes inscritos

## 📁 Estructura del Proyecto

```
Plataforma-de-E-Learning/
├── 📁 backend/                 # API y lógica del servidor
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Controladores de rutas
│   │   ├── 📁 models/          # Modelos de MongoDB
│   │   ├── 📁 routes/          # Definición de rutas
│   │   ├── 📁 middleware/      # Middleware personalizado
│   │   ├── 📁 services/        # Lógica de negocio
│   │   └── 📄 index.js         # Punto de entrada
│   ├── 📁 uploads/             # Archivos subidos
│   ├── 📄 package.json
│   └── 📄 .env.example
├── 📁 frontend/                # Aplicación React
│   ├── 📁 src/
│   │   ├── 📁 components/      # Componentes reutilizables
│   │   ├── 📁 pages/           # Páginas de la aplicación
│   │   ├── 📁 contexts/        # Context API
│   │   ├── 📁 hooks/           # Custom hooks
│   │   ├── 📁 services/        # Servicios API
│   │   └── 📁 utils/           # Utilidades
│   ├── 📄 package.json
│   └── 📄 .env.example
├── 📄 docker-compose.prod.yml  # Configuración de producción
├── 📄 README.md               # Este archivo
└── 📁 test/                   # Archivos de prueba
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión

### Cursos
- `GET /api/cursos` - Listar cursos
- `POST /api/cursos` - Crear curso
- `GET /api/cursos/:id` - Obtener curso específico
- `PUT /api/cursos/:id` - Actualizar curso
- `DELETE /api/cursos/:id` - Eliminar curso

### Usuarios
- `GET /api/usuarios/perfil` - Obtener perfil
- `PUT /api/usuarios/perfil` - Actualizar perfil
- `GET /api/usuarios/progreso` - Obtener progreso

### Inscripciones
- `POST /api/inscripciones` - Inscribirse a curso
- `GET /api/inscripciones` - Listar inscripciones

Para más detalles, consulta la documentación de la API en `/backend/README.md`.

## 🚀 Despliegue

### Desarrollo
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Producción con Docker
```bash
# Construir y ejecutar todos los servicios
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Detener servicios
docker-compose -f docker-compose.prod.yml down
```

### Variables de Entorno de Producción
Asegúrate de configurar todas las variables necesarias en tu servidor:
- Credenciales de MongoDB
- Claves JWT
- Configuración SMTP
- Claves de Stripe/PayPal
- Configuración SSL

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Usa ESLint para JavaScript
- Sigue las convenciones de React
- Documenta funciones complejas
- Escribe tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

Para preguntas, sugerencias o reportar problemas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐