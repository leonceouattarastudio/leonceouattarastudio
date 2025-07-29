const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

// Configuration Helmet pour la sécurité
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false
});

// Middleware de nettoyage XSS
const xssClean = (req, res, next) => {
  // Nettoyer le body
  if (req.body && typeof req.body === 'object') {
    req.body = cleanObject(req.body);
  }
  
  // Nettoyer les query params
  if (req.query && typeof req.query === 'object') {
    req.query = cleanObject(req.query);
  }
  
  // Nettoyer les params
  if (req.params && typeof req.params === 'object') {
    req.params = cleanObject(req.params);
  }
  
  next();
};

// Fonction récursive pour nettoyer les objets
const cleanObject = (obj) => {
  const cleaned = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        cleaned[key] = xss(value);
      } else if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          cleaned[key] = value.map(item => 
            typeof item === 'string' ? xss(item) : 
            typeof item === 'object' ? cleanObject(item) : item
          );
        } else {
          cleaned[key] = cleanObject(value);
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
};

module.exports = {
  helmetConfig,
  mongoSanitize: mongoSanitize(),
  xssClean
};