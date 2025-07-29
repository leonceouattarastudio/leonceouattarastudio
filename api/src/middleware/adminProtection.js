const { AppError } = require('./error/errorHandler');
const logger = require('../config/logger');

// Middleware de protection pour l'interface admin
const adminProtection = (req, res, next) => {
  // Vérifier que l'utilisateur est authentifié
  if (!req.user) {
    logger.warn('Unauthorized admin access attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    return next(new AppError('Authentification requise pour accéder à l\'interface admin', 401));
  }

  // Vérifier que l'utilisateur a le rôle admin
  if (req.user.role !== 'admin') {
    logger.warn('Forbidden admin access attempt', {
      userId: req.user.id,
      userEmail: req.user.email,
      userRole: req.user.role,
      ip: req.ip,
      url: req.originalUrl
    });
    return next(new AppError('Accès refusé. Privilèges administrateur requis.', 403));
  }

  // Vérifier que le compte est actif
  if (!req.user.isActive) {
    logger.warn('Inactive admin account access attempt', {
      userId: req.user.id,
      userEmail: req.user.email,
      ip: req.ip
    });
    return next(new AppError('Compte administrateur désactivé', 403));
  }

  // Vérifier que l'email est vérifié (optionnel)
  if (!req.user.emailVerified) {
    logger.warn('Unverified admin account access attempt', {
      userId: req.user.id,
      userEmail: req.user.email,
      ip: req.ip
    });
    return next(new AppError('Email non vérifié. Vérifiez votre email avant d\'accéder à l\'interface admin.', 403));
  }

  // Log de l'accès admin réussi
  logger.info('Admin access granted', {
    userId: req.user.id,
    userEmail: req.user.email,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method
  });

  next();
};

// Middleware pour les actions sensibles (suppression, modification de rôles, etc.)
const sensitiveActionProtection = (req, res, next) => {
  // Vérifier la dernière connexion (pas plus de 2 heures)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  if (req.user.lastLogin < twoHoursAgo) {
    logger.warn('Sensitive action attempted with old session', {
      userId: req.user.id,
      userEmail: req.user.email,
      lastLogin: req.user.lastLogin,
      ip: req.ip,
      url: req.originalUrl
    });
    return next(new AppError('Session trop ancienne. Reconnectez-vous pour effectuer cette action.', 401));
  }

  // Log de l'action sensible
  logger.warn('Sensitive admin action attempted', {
    userId: req.user.id,
    userEmail: req.user.email,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });

  next();
};

// Middleware pour limiter les tentatives d'accès admin
const adminRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limite à 50 requêtes par fenêtre de temps
  message: {
    success: false,
    error: 'Trop de tentatives d\'accès admin. Réessayez dans 15 minutes.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Ne pas limiter si l'utilisateur est déjà authentifié et admin
    return req.user && req.user.role === 'admin';
  },
  handler: (req, res) => {
    logger.warn('Admin rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });
    res.status(429).json({
      success: false,
      error: 'Trop de tentatives d\'accès admin. Réessayez dans 15 minutes.',
      retryAfter: 900
    });
  }
});

// Middleware pour auditer les actions admin
const auditAdminAction = (action) => {
  return (req, res, next) => {
    // Enregistrer l'action avant qu'elle soit exécutée
    const auditData = {
      action,
      userId: req.user.id,
      userEmail: req.user.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date(),
      requestBody: req.body,
      params: req.params,
      query: req.query
    };

    logger.info('Admin action audit', auditData);

    // Intercepter la réponse pour logger le résultat
    const originalSend = res.send;
    res.send = function(data) {
      logger.info('Admin action completed', {
        ...auditData,
        statusCode: res.statusCode,
        success: res.statusCode < 400
      });
      originalSend.call(this, data);
    };

    next();
  };
};

module.exports = {
  adminProtection,
  sensitiveActionProtection,
  adminRateLimit,
  auditAdminAction
};