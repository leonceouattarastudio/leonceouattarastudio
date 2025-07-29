const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  /*
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); */

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Gestion des événements de connexion
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Fermeture propre de la connexion
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
