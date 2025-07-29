const Service = require('../models/Service');
const { catchAsync, AppError } = require('../middleware/error/errorHandler');
const logger = require('../config/logger');

// @desc    Obtenir tous les services
// @route   GET /api/v1/services
// @access  Public
const getServices = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Filtres
  const filters = { isActive: true, isPublic: true };
  if (req.query.category) filters.category = req.query.category;

  // Recherche
  if (req.query.search) {
    filters.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { technologies: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
  }

  // Tri
  const sortBy = req.query.sort || 'displayOrder name';

  const services = await Service.find(filters)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Service.countDocuments(filters);

  res.status(200).json({
    success: true,
    count: services.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { services }
  });
});

// @desc    Obtenir un service par ID ou slug
// @route   GET /api/v1/services/:id
// @access  Public
const getService = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Chercher par ID MongoDB ou par slug
  const query = id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: id, isActive: true, isPublic: true }
    : { slug: id, isActive: true, isPublic: true };

  const service = await Service.findOne(query);

  if (!service) {
    return next(new AppError('Service non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    data: { service }
  });
});

// @desc    Obtenir les services par catégorie
// @route   GET /api/v1/services/category/:category
// @access  Public
const getServicesByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;

  const services = await Service.getByCategory(category);

  res.status(200).json({
    success: true,
    count: services.length,
    data: { services }
  });
});

// @desc    Obtenir les services populaires
// @route   GET /api/v1/services/popular
// @access  Public
const getPopularServices = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;

  const services = await Service.getPopular(limit);

  res.status(200).json({
    success: true,
    count: services.length,
    data: { services }
  });
});

// @desc    Créer un nouveau service (Admin)
// @route   POST /api/v1/services
// @access  Private (Admin)
const createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);

  logger.info(`New service created: ${service.name} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Service créé avec succès',
    data: { service }
  });
});

// @desc    Mettre à jour un service (Admin)
// @route   PUT /api/v1/services/:id
// @access  Private (Admin)
const updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service non trouvé', 404));
  }

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  logger.info(`Service updated: ${updatedService.name} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Service mis à jour avec succès',
    data: { service: updatedService }
  });
});

// @desc    Supprimer un service (Admin)
// @route   DELETE /api/v1/services/:id
// @access  Private (Admin)
const deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service non trouvé', 404));
  }

  // Soft delete - marquer comme inactif
  service.isActive = false;
  await service.save();

  logger.info(`Service deleted: ${service.name} by ${req.user.email}`);

  res.status(204).json({
    success: true,
    message: 'Service supprimé avec succès'
  });
});

// @desc    Obtenir les statistiques des services (Admin)
// @route   GET /api/v1/services/stats
// @access  Private (Admin)
const getServiceStats = catchAsync(async (req, res, next) => {
  const stats = await Service.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalBookings: { $sum: '$analytics.bookings' },
        totalRevenue: { $sum: '$analytics.totalRevenue' },
        avgRating: { $avg: '$analytics.averageRating' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  const totalServices = await Service.countDocuments({ isActive: true });
  const totalRevenue = await Service.aggregate([
    { $group: { _id: null, total: { $sum: '$analytics.totalRevenue' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalServices,
      totalRevenue: totalRevenue[0]?.total || 0,
      categoryStats: stats
    }
  });
});

module.exports = {
  getServices,
  getService,
  getServicesByCategory,
  getPopularServices,
  createService,
  updateService,
  deleteService,
  getServiceStats
};