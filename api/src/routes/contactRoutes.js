const express = require('express');
const {
  createContact,
  getContacts,
  getContact,
  replyToContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');

const { authenticate, authorize } = require('../middleware/auth/auth');
const { validate, commonSchemas } = require('../middleware/validation/validation');
const { publicLimiter } = require('../config/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Schémas de validation pour les contacts
const contactSchemas = {
  create: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^(?:\+33|0)[1-9](?:[0-9]{8})$/),
    company: Joi.string().trim().max(100),
    subject: Joi.string().valid('general', 'project', 'support', 'partnership', 'quote', 'other').required(),
    projectType: Joi.string().valid('website', 'webapp', 'mobile', 'ecommerce', 'api', 'consulting', 'other'),
    budget: Joi.string().valid('1000-5000', '5000-10000', '10000-20000', '20000-50000', '50000+', 'to-discuss'),
    timeline: Joi.string().valid('asap', '1-month', '2-3-months', '3-6-months', '6-months+', 'flexible'),
    message: Joi.string().trim().min(10).max(2000).required(),
    source: Joi.string().valid('website', 'referral', 'social', 'email', 'phone', 'other'),
    gdprConsent: Joi.boolean().valid(true).required()
  }),

  reply: Joi.object({
    message: Joi.string().trim().min(10).max(2000).required(),
    method: Joi.string().valid('email', 'phone', 'meeting').default('email')
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('new', 'read', 'replied', 'in-progress', 'completed', 'archived'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    notes: Joi.string().trim().max(1000)
  }).min(1)
};

// Routes publiques
router.post('/', publicLimiter, validate(contactSchemas.create), createContact);

// Routes protégées (Admin seulement)
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', validate(commonSchemas.mongoId, 'params'), getContact);
router.post('/:id/reply', validate(commonSchemas.mongoId, 'params'), validate(contactSchemas.reply), replyToContact);
router.put('/:id/status', validate(commonSchemas.mongoId, 'params'), validate(contactSchemas.updateStatus), updateContactStatus);
router.delete('/:id', validate(commonSchemas.mongoId, 'params'), deleteContact);

module.exports = router;