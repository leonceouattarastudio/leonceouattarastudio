const logger = require('../../config/logger');

// Classe d'erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Gestion des erreurs de cast MongoDB
const handleCastErrorDB = (err) => {
  const message = `Ressource non trouvée avec l'ID: ${err.value}`;
  return new AppError(message, 400);
};

// Gestion des erreurs de duplication MongoDB
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' existe déjà. Veuillez utiliser une autre valeur.`;
  return new AppError(message, 400);
};

// Gestion des erreurs de validation MongoDB
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message,
    value: el.value
  }));
  
  const message = 'Données invalides';
  return new AppError(message, 400, errors);
};

// Gestion des erreurs JWT
const handleJWTError = () =>
  new AppError('Token invalide. Veuillez vous reconnecter.', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expiré. Veuillez vous reconnecter.', 401);

// Envoi d'erreur en développement
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    details: err.details,
    stack: err.stack
  });
};

// Envoi d'erreur en production
const sendErrorProd = (err, res) => {
  // Erreurs opérationnelles : envoyer le message à l'utilisateur
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details
    });
  } else {
    // Erreurs de programmation : ne pas exposer les détails
    logger.error('ERROR:', err);
    
    res.status(500).json({
      success: false,
      error: 'Une erreur interne s\'est produite'
    });
  }
};

// Middleware de gestion d'erreurs global
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log de l'erreur
  logger.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Gestion des erreurs spécifiques
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} non trouvée`;
  logger.warn(`404 - ${message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });
  
  next(new AppError(message, 404));
};

// Wrapper pour les fonctions async
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  globalErrorHandler,
  notFound,
  catchAsync
};