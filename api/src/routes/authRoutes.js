const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  checkAuthStatus,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/authController');

const { authenticate, authorize } = require('../middleware/auth/auth');
const { validate, authSchemas, commonSchemas } = require('../middleware/validation/validation');
const { authLimiter } = require('../config/rateLimiter');

const router = express.Router();

// Routes publiques avec rate limiting strict
router.post('/register', authLimiter, validate(authSchemas.register), register);
router.post('/login', authLimiter, validate(authSchemas.login), login);
router.post('/forgot-password', authLimiter, validate(authSchemas.forgotPassword), forgotPassword);
router.patch('/reset-password/:token', authLimiter, validate(authSchemas.resetPassword), resetPassword);
router.post('/refresh-token', refreshToken);
router.get('/status', checkAuthStatus);

// Routes protégées
router.use(authenticate); // Toutes les routes suivantes nécessitent une authentification

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/me', validate(authSchemas.updateProfile), updateMe);
router.put('/change-password', validate(authSchemas.changePassword), changePassword);

// Routes admin seulement
router.use(authorize('admin')); // Toutes les routes suivantes nécessitent le rôle admin

router.get('/users', getAllUsers);
router.get('/users/:id', validate(commonSchemas.mongoId, 'params'), getUserById);
router.put('/users/:id', validate(commonSchemas.mongoId, 'params'), updateUser);
router.delete('/users/:id', validate(commonSchemas.mongoId, 'params'), deleteUser);

module.exports = router;