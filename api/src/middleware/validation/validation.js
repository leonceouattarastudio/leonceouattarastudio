const Joi = require('joi');
const { AppError } = require('../error/errorHandler');
const logger = require('../../config/logger');

// Middleware de validation générique
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      logger.warn('Validation error:', { 
        endpoint: req.originalUrl,
        method: req.method,
        errors: errorMessage 
      });

      return next(new AppError('Données de validation invalides', 400, errorMessage));
    }

    // Remplacer les données validées
    req[property] = value;
    next();
  };
};

// Schémas de validation communs
const commonSchemas = {
  // Validation d'ID MongoDB
  mongoId: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
      .messages({
        'string.pattern.base': 'ID invalide',
        'any.required': 'ID requis'
      })
  }),

  // Validation de pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('-createdAt'),
    fields: Joi.string()
  }),

  // Validation d'email
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'Email requis'
    }),

  // Validation de mot de passe
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
      'any.required': 'Mot de passe requis'
    })
};

// Schémas de validation pour l'authentification
const authSchemas = {
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.min': 'Le prénom doit contenir au moins 2 caractères',
        'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
        'any.required': 'Prénom requis'
      }),
    lastName: Joi.string().trim().min(2).max(50).required()
      .messages({
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères',
        'any.required': 'Nom requis'
      }),
    email: commonSchemas.email,
    password: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Les mots de passe ne correspondent pas',
        'any.required': 'Confirmation du mot de passe requise'
      }),
    role: Joi.string().valid('user', 'admin').default('user')
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required()
      .messages({
        'any.required': 'Mot de passe requis'
      })
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': 'Les mots de passe ne correspondent pas'
      })
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    email: Joi.string().email(),
    avatar: Joi.string().uri()
  }).min(1),

  changePassword: Joi.object({
    currentPassword: Joi.string().required()
      .messages({
        'any.required': 'Mot de passe actuel requis'
      }),
    newPassword: commonSchemas.password,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({
        'any.only': 'Les mots de passe ne correspondent pas',
        'any.required': 'Confirmation du nouveau mot de passe requise'
      })
  })
};

// Schémas pour les projets
const projectSchemas = {
  create: Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    category: Joi.string().valid('web', 'mobile', 'ecommerce', 'api', 'other').required(),
    technologies: Joi.array().items(Joi.string().trim()).min(1).required(),
    status: Joi.string().valid('planning', 'development', 'testing', 'completed', 'maintenance').default('planning'),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    clientName: Joi.string().trim().max(100),
    budget: Joi.number().positive(),
    featured: Joi.boolean().default(false),
    images: Joi.array().items(Joi.string().uri()),
    githubUrl: Joi.string().uri(),
    liveUrl: Joi.string().uri()
  }),

  update: Joi.object({
    title: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().min(10).max(1000),
    category: Joi.string().valid('web', 'mobile', 'ecommerce', 'api', 'other'),
    technologies: Joi.array().items(Joi.string().trim()).min(1),
    status: Joi.string().valid('planning', 'development', 'testing', 'completed', 'maintenance'),
    startDate: Joi.date(),
    endDate: Joi.date(),
    clientName: Joi.string().trim().max(100),
    budget: Joi.number().positive(),
    featured: Joi.boolean(),
    images: Joi.array().items(Joi.string().uri()),
    githubUrl: Joi.string().uri(),
    liveUrl: Joi.string().uri()
  }).min(1)
};

module.exports = {
  validate,
  commonSchemas,
  authSchemas,
  projectSchemas
};