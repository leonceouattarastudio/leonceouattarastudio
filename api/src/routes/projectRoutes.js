const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getPopularProjects,
  getProjectsByCategory,
  likeProject,
  getProjectStats
} = require('../controllers/projectController');

const { authenticate, authorize, optionalAuth } = require('../middleware/auth/auth');
const { validate, projectSchemas, commonSchemas } = require('../middleware/validation/validation');
const { publicLimiter } = require('../config/rateLimiter');

const router = express.Router();

// Routes publiques
router.get('/', publicLimiter, getProjects);
router.get('/popular', publicLimiter, getPopularProjects);
router.get('/category/:category', publicLimiter, getProjectsByCategory);
router.get('/:id', publicLimiter, getProject);
router.post('/:id/like', publicLimiter, validate(commonSchemas.mongoId, 'params'), likeProject);

// Routes protégées (Admin seulement)
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', validate(projectSchemas.create), createProject);
router.put('/:id', validate(commonSchemas.mongoId, 'params'), validate(projectSchemas.update), updateProject);
router.delete('/:id', validate(commonSchemas.mongoId, 'params'), deleteProject);
router.get('/admin/stats', getProjectStats);

module.exports = router;