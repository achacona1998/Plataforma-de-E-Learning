const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/error.middleware');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const cursoRoutes = require('./routes/curso.routes');
const estudianteRoutes = require('./routes/estudiante.routes');
const instructorRoutes = require('./routes/instructor.routes');
const contenidoRoutes = require('./routes/contenido.routes');
const inscripcionRoutes = require('./routes/inscripcion.routes');
const progresoRoutes = require('./routes/progreso.routes');
const certificadoRoutes = require('./routes/certificado.routes');
const pagoRoutes = require('./routes/pago.routes');
const stripeRoutes = require('./routes/stripe.routes');
const paypalRoutes = require('./routes/paypal.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const quizRoutes = require('./routes/quiz.routes');
const respuestaQuizRoutes = require('./routes/respuesta-quiz.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elearning-platform';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (certificados)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/instructores', instructorRoutes);
app.use('/api/contenidos', contenidoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/progresos', progresoRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/respuestas-quiz', respuestaQuizRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    
    // Start the server after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unexpected errors
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

