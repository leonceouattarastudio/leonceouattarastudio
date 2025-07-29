const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../../config/logger');
const { AppError } = require('../error/errorHandler');

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Récupération du token depuis les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Token d\'accès requis', 401));
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérification que l'utilisateur existe toujours
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppError('L\'utilisateur associé à ce token n\'existe plus', 401));
    }

    // Vérification que l'utilisateur n'a pas changé son mot de passe après l'émission du token
    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      return next(new AppError('Mot de passe récemment modifié, veuillez vous reconnecter', 401));
    }

    // Ajout de l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token invalide', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expiré', 401));
    }
    
    logger.error('Authentication error:', error);
    return next(new AppError('Erreur d\'authentification', 401));
  }
};

// Middleware d'autorisation par rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentification requise', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permissions insuffisantes pour cette action', 403));
    }

    next();
  };
};

// Middleware optionnel (utilisateur connecté ou non)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};