const dotenv = require('dotenv');

// Gestion des erreurs non capturées dès le début
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Configuration des variables d'environnement
dotenv.config();

const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');

// Connexion à la base de données
connectDB();

// Configuration du port
const PORT = process.env.PORT || 5000;

// Démarrage du serveur
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`);
});

// Gestion des rejets de promesses non gérées
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err.name, err.message);
  
  server.close(() => {
    process.exit(1);
  });
});

// Gestion gracieuse de l'arrêt du serveur
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
  
  // Force l'arrêt après 10 secondes
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;