const express = require('express');
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const contactRoutes = require('./contactRoutes');
const newsletterRoutes = require('./newsletterRoutes');
const blogRoutes = require('./blogRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const serviceRoutes = require('./serviceRoutes');
const calendarRoutes = require('./calendarRoutes');

const router = express.Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/blog', blogRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);
router.use('/calendar', calendarRoutes);

// Route de santé de l'API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1'
  });
});

// Route d'information sur l'API
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API Leonce Ouattara Studio',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      projects: '/api/v1/projects',
      contact: '/api/v1/contact',
      newsletter: '/api/v1/newsletter',
      blog: '/api/v1/blog',
      appointments: '/api/v1/appointments',
      services: '/api/v1/services',
      calendar: '/api/v1/calendar',
      health: '/api/v1/health'
    }
  });
});

module.exports = router;