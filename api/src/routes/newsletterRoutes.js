const express = require('express');
const {
  subscribe,
  confirmSubscription,
  unsubscribe,
  getSubscribers,
  sendNewsletter,
  getNewsletterStats,
  updatePreferences
} = require('../controllers/newsletterController');

const { authenticate, authorize } = require('../middleware/auth/auth');
const { validate, commonSchemas } = require('../middleware/validation/validation');
const { publicLimiter } = require('../config/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Schémas de validation pour la newsletter
const newsletterSchemas = {
  subscribe: Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    interests: Joi.array().items(
      Joi.string().valid('web-development', 'mobile-development', 'tech-news', 'tutorials', 'case-studies', 'tips')
    ),
    gdprConsent: Joi.boolean().valid(true).required()
  }),

  sendNewsletter: Joi.object({
    subject: Joi.string().trim().min(5).max(200).required(),
    content: Joi.string().trim().min(50).required(),
    interests: Joi.array().items(
      Joi.string().valid('web-development', 'mobile-development', 'tech-news', 'tutorials', 'case-studies', 'tips')
    )
  }),

  updatePreferences: Joi.object({
    interests: Joi.array().items(
      Joi.string().valid('web-development', 'mobile-development', 'tech-news', 'tutorials', 'case-studies', 'tips')
    ),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'occasional')
  }).min(1)
};

// Routes publiques
router.post('/subscribe', publicLimiter, validate(newsletterSchemas.subscribe), subscribe);
router.get('/confirm/:token', confirmSubscription);
router.get('/unsubscribe/:token', unsubscribe);
router.put('/preferences/:token', validate(newsletterSchemas.updatePreferences), updatePreferences);

// Routes protégées (Admin seulement)
router.use(authenticate);
router.use(authorize('admin'));

router.get('/subscribers', getSubscribers);
router.post('/send', validate(newsletterSchemas.sendNewsletter), sendNewsletter);
router.get('/stats', getNewsletterStats);

module.exports = router;