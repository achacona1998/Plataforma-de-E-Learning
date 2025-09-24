# 🎨 Frontend - Plataforma de E-Learning

Aplicación web moderna construida con React 19 y Vite que proporciona una interfaz de usuario intuitiva y responsiva para la plataforma de e-learning.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Principales](#-componentes-principales)
- [Páginas y Rutas](#-páginas-y-rutas)
- [Hooks Personalizados](#-hooks-personalizados)
- [Contextos](#-contextos)
- [Estilos y UI](#-estilos-y-ui)
- [Despliegue](#-despliegue)

## ✨ Características

### 🎯 Experiencia de Usuario
- 📱 **Diseño Responsivo** - Optimizado para móviles, tablets y desktop
- 🎨 **UI Moderna** - Interfaz limpia y atractiva con Tailwind CSS
- ⚡ **Rendimiento Optimizado** - Lazy loading y code splitting
- 🌙 **Tema Consistente** - Paleta de colores profesional
- 🔄 **Actualizaciones en Tiempo Real** - Estados dinámicos y reactivos

### 👥 Roles de Usuario
- **🎓 Estudiantes**: Dashboard personalizado, progreso de cursos, certificados
- **👨‍🏫 Instructores**: Gestión de cursos, analytics, estudiantes
- **⚙️ Administradores**: Panel completo de administración

### 🚀 Funcionalidades Clave
- 🔐 **Autenticación Segura** - Login/registro con JWT
- 📚 **Catálogo de Cursos** - Exploración y búsqueda avanzada
- 📊 **Dashboard Dinámico** - Estadísticas y progreso en tiempo real
- 💳 **Pagos Integrados** - Checkout con Stripe y PayPal
- 🏆 **Sistema de Certificados** - Generación y descarga de certificados
- 📈 **Analytics Avanzados** - Métricas y reportes visuales

## 🛠 Tecnologías

### Core Framework
- **React 19** - Biblioteca de UI con las últimas características
- **Vite 6** - Build tool ultrarrápido y dev server
- **React Router DOM 7** - Enrutamiento declarativo

### Estilos y UI
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Heroicons** - Iconografía profesional
- **Lucide React** - Iconos adicionales modernos

### Estado y Datos
- **Context API** - Gestión de estado global
- **Custom Hooks** - Lógica reutilizable
- **Fetch API** - Comunicación con backend

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **Hot Module Replacement** - Desarrollo en tiempo real

## ⚡ Instalación

### Prerrequisitos
- Node.js v18 o superior
- npm o pnpm
- Backend ejecutándose en puerto 5000

### Pasos de Instalación

1. **Navegar al directorio frontend**
```bash
cd frontend
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

4. **Editar el archivo .env**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=E-Learning Platform
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## ⚙️ Configuración

### Variables de Entorno

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=E-Learning Platform
VITE_APP_VERSION=1.0.0

# Payment Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT=false
```

### Configuración de Vite

El proyecto está configurado con:
- **Proxy API**: Redirecciona `/api/*` al backend
- **Puerto personalizado**: 3000 por defecto
- **Source maps**: Habilitados para debugging
- **Auto-apertura**: Abre automáticamente en el navegador

## 📁 Estructura del Proyecto

```
frontend/
├── 📁 public/                  # Archivos estáticos
│   ├── 📄 index.html          # Template HTML
│   └── 📄 vite.svg            # Favicon
├── 📁 src/
│   ├── 📄 App.jsx             # Componente principal
│   ├── 📄 main.jsx            # Punto de entrada
│   ├── 📄 index.css           # Estilos globales
│   ├── 📁 components/         # Componentes reutilizables
│   │   ├── 📁 admin/          # Componentes de administración
│   │   ├── 📁 auth/           # Autenticación
│   │   ├── 📁 certificates/   # Certificados
│   │   ├── 📁 content/        # Contenido de cursos
│   │   ├── 📁 dashboard/      # Dashboard components
│   │   ├── 📁 instructor/     # Componentes de instructor
│   │   ├── 📁 navigation/     # Navegación
│   │   ├── 📁 payment/        # Pagos
│   │   ├── 📁 quiz/           # Quizzes
│   │   ├── 📁 student/        # Componentes de estudiante
│   │   └── 📁 ui/             # Componentes UI base
│   ├── 📁 contexts/           # Context providers
│   │   └── 📄 AuthContext.jsx # Contexto de autenticación
│   ├── 📁 hooks/              # Custom hooks
│   │   ├── 📄 useApi.js       # Hook para API calls
│   │   ├── 📄 useCourseManagement.js
│   │   ├── 📄 useSearch.js    # Hook de búsqueda
│   │   └── 📄 useUserManagement.js
│   ├── 📁 layout/             # Layouts de página
│   │   ├── 📄 AdminLayout.jsx
│   │   ├── 📄 BaseLayout.jsx
│   │   ├── 📄 InstructorLayout.jsx
│   │   └── 📄 StudentLayout.jsx
│   ├── 📁 pages/              # Páginas de la aplicación
│   │   ├── 📁 admin/          # Páginas de administración
│   │   ├── 📁 auth/           # Login/Register
│   │   ├── 📁 courses/        # Catálogo de cursos
│   │   ├── 📁 instructor/     # Panel de instructor
│   │   ├── 📁 learning/       # Experiencia de aprendizaje
│   │   └── 📁 student/        # Dashboard de estudiante
│   ├── 📁 sections/           # Secciones de página
│   ├── 📁 services/           # Servicios API
│   │   └── 📄 api.js          # Cliente API
│   └── 📁 utils/              # Utilidades
│       ├── 📄 constants.js    # Constantes
│       └── 📄 helpers.js      # Funciones helper
├── 📄 package.json
├── 📄 vite.config.js          # Configuración de Vite
├── 📄 tailwind.config.js      # Configuración de Tailwind
├── 📄 eslint.config.js        # Configuración de ESLint
└── 📄 .env.example
```

## 🧩 Componentes Principales

### Componentes de UI Base (`/components/ui/`)
- **Button** - Botones con variantes y estados
- **Input** - Campos de entrada estilizados
- **Modal** - Modales reutilizables
- **Progress** - Barras de progreso
- **Card** - Tarjetas de contenido
- **Loading** - Indicadores de carga

### Componentes de Autenticación (`/components/auth/`)
- **LoginForm** - Formulario de inicio de sesión
- **RegisterForm** - Formulario de registro
- **ProtectedRoute** - Rutas protegidas por autenticación

### Componentes de Dashboard (`/components/dashboard/`)
- **StatCard** - Tarjetas de estadísticas
- **ProgressChart** - Gráficos de progreso
- **RecentActivity** - Actividad reciente
- **QuickActions** - Acciones rápidas

## 🗺 Páginas y Rutas

### Rutas Públicas
```javascript
/                    # Página de inicio
/login              # Inicio de sesión
/register           # Registro
/courses            # Catálogo de cursos
/courses/:id        # Detalle de curso
```

### Rutas de Estudiante
```javascript
/student/dashboard       # Dashboard principal
/student/my-learning     # Mis cursos
/student/certificates    # Mis certificados
/student/analytics       # Analytics personales
/student/profile         # Perfil de usuario
```

### Rutas de Instructor
```javascript
/instructor/dashboard    # Dashboard de instructor
/instructor/courses      # Gestión de cursos
/instructor/students     # Mis estudiantes
/instructor/analytics    # Analytics de instructor
/instructor/quizzes      # Gestión de quizzes
```

### Rutas de Administrador
```javascript
/admin/dashboard         # Dashboard de admin
/admin/users            # Gestión de usuarios
/admin/courses          # Gestión de cursos
/admin/payments         # Gestión de pagos
/admin/statistics       # Estadísticas globales
/admin/settings         # Configuración
```

## 🎣 Hooks Personalizados

### `useApi(endpoint, options)`
Hook para realizar llamadas a la API con manejo de estados:

```javascript
const { data, loading, error, refetch } = useApi('/cursos');
```

### `useAuth()`
Hook para acceder al contexto de autenticación:

```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

### `useSearch(items, searchFields)`
Hook para funcionalidad de búsqueda:

```javascript
const { searchTerm, setSearchTerm, filteredItems } = useSearch(courses, ['titulo', 'descripcion']);
```

### `useCourseManagement()`
Hook para gestión de cursos:

```javascript
const { courses, createCourse, updateCourse, deleteCourse } = useCourseManagement();
```

## 🎯 Contextos

### AuthContext
Gestiona el estado de autenticación global:

```javascript
const authContext = {
  user: null | UserObject,
  isAuthenticated: boolean,
  loading: boolean,
  login: (credentials) => Promise,
  logout: () => void,
  register: (userData) => Promise
};
```

## 🎨 Estilos y UI

### Tailwind CSS
El proyecto utiliza Tailwind CSS 4 con configuración personalizada:

```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
}
```

### Paleta de Colores
- **Primario**: Azul (#3B82F6)
- **Secundario**: Verde (#10B981)
- **Acento**: Púrpura (#8B5CF6)
- **Neutros**: Grises escalados
- **Estados**: Rojo (error), Amarillo (warning), Verde (success)

### Componentes Responsivos
Todos los componentes están optimizados para:
- 📱 **Mobile**: 320px - 768px
- 📟 **Tablet**: 768px - 1024px
- 🖥 **Desktop**: 1024px+

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting de código
```

### Producción

#### Build Local
```bash
npm run build
```
Los archivos se generan en `/dist`

#### Docker
```bash
# Construir imagen
docker build -f Dockerfile.prod -t elearning-frontend .

# Ejecutar contenedor
docker run -p 80:80 elearning-frontend
```

#### Variables de Entorno de Producción
```env
VITE_API_URL=https://api.tudominio.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_PAYPAL_CLIENT_ID=live_client_id
```

### Optimizaciones de Producción
- **Code Splitting**: Carga lazy de componentes
- **Tree Shaking**: Eliminación de código no utilizado
- **Minificación**: CSS y JavaScript optimizados
- **Compresión**: Gzip habilitado
- **CDN**: Assets servidos desde CDN

## 📊 Métricas y Analytics

### Performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### Bundle Size
- **Inicial**: ~150KB gzipped
- **Vendor**: ~200KB gzipped
- **Total**: ~350KB gzipped

## 🔧 Troubleshooting

### Problemas Comunes

1. **Error de conexión con API**
   - Verificar `VITE_API_URL` en `.env`
   - Asegurar que el backend esté ejecutándose

2. **Estilos no se cargan**
   - Verificar configuración de Tailwind
   - Comprobar imports de CSS

3. **Rutas no funcionan**
   - Verificar configuración de React Router
   - Comprobar rutas protegidas

4. **Build falla**
   - Limpiar cache: `rm -rf node_modules/.vite`
   - Reinstalar dependencias

---

Para más información, consulta el README principal del proyecto o la documentación del backend.
