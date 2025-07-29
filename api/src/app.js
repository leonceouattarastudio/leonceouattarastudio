const express = require('express');
const morgan = require('morgan');
const compression = require('compression');

// Importation des middlewares de sécurité
const { helmetConfig, mongoSanitize, xssClean } = require('./middleware/security');
const corsConfig = require('./config/cors');
const { generalLimiter } = require('./config/rateLimiter');

// Importation des middlewares d'erreur
const { globalErrorHandler, notFound } = require('./middleware/error/errorHandler');

// Importation des routes
const routes = require('./routes');
const adminRoutes = require('./routes/adminRoutes');
const { sessionMiddleware, cleanupSessions } = require('./middleware/session');

// Importation du logger
const logger = require('./config/logger');

// Création de l'application Express
const app = express();

// Middleware de confiance pour les proxies (Heroku, Nginx, etc.)
app.set('trust proxy', 1);

// Middleware de sécurité
app.use(helmetConfig);
app.use(corsConfig);

// Middleware de compression
app.use(compression());

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting global
app.use(generalLimiter);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de session
app.use(sessionMiddleware);
app.use(cleanupSessions);

// Middleware de sécurité pour les données
app.use(mongoSanitize);
app.use(xssClean);

// Middleware pour ajouter des headers de sécurité supplémentaires
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes principales
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);
app.use(`/api/${process.env.API_VERSION || 'v1'}/admin`, adminRoutes);

// Route de base
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Leonce Ouattara Studio API',
    version: process.env.API_VERSION || 'v1',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion d'erreurs global
app.use(globalErrorHandler);

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;