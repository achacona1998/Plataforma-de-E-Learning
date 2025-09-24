require('dotenv').config();

module.exports = {
    // Configuración de la base de datos
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // Configuración de JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'tu_clave_secreta_jwt',
        expiresIn: '24h'
    },

    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },

    // Configuración de cors
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Configuración de límites de solicitudes
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100 // límite de 100 solicitudes por ventana
    }
};