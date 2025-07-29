const session = require('express-session');
const MongoStore = require('connect-mongo');
const logger = require('../config/logger');

// Configuration des sessions
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  name: 'sessionId', // Nom du cookie de session
  resave: false,
  saveUninitialized: false,
  rolling: true, // Renouveler la session à chaque requête
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS en production
    httpOnly: true, // Empêche l'accès via JavaScript
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
    sameSite: 'strict' // Protection CSRF
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600, // Lazy session update
    ttl: 24 * 60 * 60, // TTL en secondes (24h)
    autoRemove: 'native', // Suppression automatique des sessions expirées
    crypto: {
      secret: process.env.SESSION_SECRET || 'your-session-secret'
    }
  })
};

// Middleware de gestion des sessions
const sessionMiddleware = session(sessionConfig);

// Middleware pour nettoyer les sessions expirées
const cleanupSessions = async (req, res, next) => {
  try {
    // Nettoyer les sessions expirées (optionnel, MongoDB le fait automatiquement)
    if (req.session && req.session.lastAccess) {
      const now = new Date();
      const lastAccess = new Date(req.session.lastAccess);
      const timeDiff = now - lastAccess;
      
      // Si la dernière activité date de plus de 24h, détruire la session
      if (timeDiff > 24 * 60 * 60 * 1000) {
        req.session.destroy((err) => {
          if (err) {
            logger.error('Error destroying expired session:', err);
          }
        });
        return res.status(401).json({
          success: false,
          message: 'Session expirée'
        });
      }
    }
    
    // Mettre à jour le timestamp de dernière activité
    if (req.session) {
      req.session.lastAccess = new Date();
    }
    
    next();
  } catch (error) {
    logger.error('Session cleanup error:', error);
    next();
  }
};

// Middleware pour vérifier l'authentification via session
const requireSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Session requise'
    });
  }
  next();
};

// Middleware pour créer une session utilisateur
const createUserSession = (req, res, next) => {
  if (req.user && req.session) {
    req.session.userId = req.user.id;
    req.session.userRole = req.user.role;
    req.session.lastAccess = new Date();
    
    logger.info(`Session created for user: ${req.user.email}`);
  }
  next();
};

// Middleware pour détruire la session
const destroySession = (req, res, next) => {
  if (req.session) {
    const userId = req.session.userId;
    req.session.destroy((err) => {
      if (err) {
        logger.error('Error destroying session:', err);
        return next(err);
      }
      
      logger.info(`Session destroyed for user ID: ${userId}`);
      res.clearCookie('sessionId');
      next();
    });
  } else {
    next();
  }
};

// Utilitaire pour obtenir les informations de session
const getSessionInfo = (req) => {
  if (!req.session) {
    return null;
  }
  
  return {
    id: req.session.id,
    userId: req.session.userId,
    userRole: req.session.userRole,
    lastAccess: req.session.lastAccess,
    cookie: req.session.cookie
  };
};

module.exports = {
  sessionMiddleware,
  cleanupSessions,
  requireSession,
  createUserSession,
  destroySession,
  getSessionInfo
};