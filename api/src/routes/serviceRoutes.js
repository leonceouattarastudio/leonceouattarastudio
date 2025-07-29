const express = require('express');
const {
  getServices,
  getService,
  getServicesByCategory,
  getPopularServices,
  createService,
  updateService,
  deleteService,
  getServiceStats
} = require('../controllers/serviceController');

const { authenticate, authorize } = require('../middleware/auth/auth');
const { validate, commonSchemas } = require('../middleware/validation/validation');
const { publicLimiter } = require('../config/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Schémas de validation pour les services
const serviceSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    category: Joi.string().valid(
      'web-development', 'mobile-development', 'ecommerce', 
      'backend-architecture', 'cloud-devops', 'security-audit', 'consulting'
    ).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    shortDescription: Joi.string().trim().min(10).max(200).required(),
    features: Joi.array().items(Joi.string().trim().max(200)).min(1),
    technologies: Joi.array().items(Joi.string().trim()),
    deliverables: Joi.array().items(Joi.string().trim().max(200)),
    pricing: Joi.object({
      basePrice: Joi.number().positive().required(),
      currency: Joi.string().default('EUR'),
      priceType: Joi.string().valid('fixed', 'hourly', 'project', 'consultation').default('fixed'),
      customPricing: Joi.boolean().default(false)
    }).required(),
    duration: Joi.object({
      estimatedHours: Joi.number().positive().required(),
      consultationDuration: Joi.number().integer().min(30).max(240).default(60),
      flexibleDuration: Joi.boolean().default(false)
    }).required(),
    availability: Joi.object({
      requiresConsultation: Joi.boolean().default(true),
      advanceBooking: Joi.object({
        min: Joi.number().integer().min(1).default(24),
        max: Joi.number().integer().max(8760).default(2160)
      }),
      bufferTime: Joi.object({
        before: Joi.number().integer().min(0).default(15),
        after: Joi.number().integer().min(0).default(15)
      })
    }),
    requirements: Joi.object({
      clientInfo: Joi.array().items(Joi.object({
        field: Joi.string().valid(
          'company', 'website', 'budget', 'timeline', 'projectDescription', 
          'technicalRequirements', 'teamSize', 'currentSolution'
        ).required(),
        required: Joi.boolean().default(false),
        label: Joi.string(),
        placeholder: Joi.string(),
        helpText: Joi.string()
      })),
      documents: Joi.array().items(Joi.string().valid(
        'brief', 'specifications', 'mockups', 'existing-code', 'analytics', 'other'
      )),
      preparationSteps: Joi.array().items(Joi.string())
    }),
    isActive: Joi.boolean().default(true),
    isPublic: Joi.boolean().default(true),
    displayOrder: Joi.number().integer().default(0),
    icon: Joi.string().default('Code'),
    color: Joi.object({
      primary: Joi.string().default('#00F5FF'),
      secondary: Joi.string().default('#9D4EDD')
    }),
    seo: Joi.object({
      metaTitle: Joi.string().max(60),
      metaDescription: Joi.string().max(160),
      keywords: Joi.array().items(Joi.string())
    })
  }),

  update: Joi.object({
    name: Joi.string().trim().min(3).max(100),
    category: Joi.string().valid(
      'web-development', 'mobile-development', 'ecommerce', 
      'backend-architecture', 'cloud-devops', 'security-audit', 'consulting'
    ),
    description: Joi.string().trim().min(10).max(1000),
    shortDescription: Joi.string().trim().min(10).max(200),
    features: Joi.array().items(Joi.string().trim().max(200)),
    technologies: Joi.array().items(Joi.string().trim()),
    deliverables: Joi.array().items(Joi.string().trim().max(200)),
    pricing: Joi.object({
      basePrice: Joi.number().positive(),
      currency: Joi.string(),
      priceType: Joi.string().valid('fixed', 'hourly', 'project', 'consultation'),
      customPricing: Joi.boolean()
    }),
    duration: Joi.object({
      estimatedHours: Joi.number().positive(),
      consultationDuration: Joi.number().integer().min(30).max(240),
      flexibleDuration: Joi.boolean()
    }),
    availability: Joi.object({
      requiresConsultation: Joi.boolean(),
      advanceBooking: Joi.object({
        min: Joi.number().integer().min(1),
        max: Joi.number().integer().max(8760)
      }),
      bufferTime: Joi.object({
        before: Joi.number().integer().min(0),
        after: Joi.number().integer().min(0)
      })
    }),
    requirements: Joi.object({
      clientInfo: Joi.array().items(Joi.object({
        field: Joi.string().valid(
          'company', 'website', 'budget', 'timeline', 'projectDescription', 
          'technicalRequirements', 'teamSize', 'currentSolution'
        ),
        required: Joi.boolean(),
        label: Joi.string(),
        placeholder: Joi.string(),
        helpText: Joi.string()
      })),
      documents: Joi.array().items(Joi.string().valid(
        'brief', 'specifications', 'mockups', 'existing-code', 'analytics', 'other'
      )),
      preparationSteps: Joi.array().items(Joi.string())
    }),
    isActive: Joi.boolean(),
    isPublic: Joi.boolean(),
    displayOrder: Joi.number().integer(),
    icon: Joi.string(),
    color: Joi.object({
      primary: Joi.string(),
      secondary: Joi.string()
    }),
    seo: Joi.object({
      metaTitle: Joi.string().max(60),
      metaDescription: Joi.string().max(160),
      keywords: Joi.array().items(Joi.string())
    })
  }).min(1)
};

// Routes publiques
router.get('/', publicLimiter, getServices);
router.get('/popular', publicLimiter, getPopularServices);
router.get('/category/:category', publicLimiter, getServicesByCategory);
router.get('/:id', publicLimiter, getService);

// Routes protégées (Admin seulement)
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', validate(serviceSchemas.create), createService);
router.put('/:id', validate(commonSchemas.mongoId, 'params'), validate(serviceSchemas.update), updateService);
router.delete('/:id', validate(commonSchemas.mongoId, 'params'), deleteService);
router.get('/admin/stats', getServiceStats);

module.exports = router;