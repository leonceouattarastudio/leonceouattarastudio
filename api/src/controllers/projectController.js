const Project = require('../models/Project');
const { catchAsync, AppError } = require('../middleware/error/errorHandler');
const logger = require('../config/logger');

// Fonction utilitaire pour la pagination
const getPaginationData = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Fonction utilitaire pour construire les filtres
const buildFilters = (req) => {
  const filters = { isPublished: true };
  
  if (req.query.category) {
    filters.category = req.query.category;
  }
  
  if (req.query.status) {
    filters.status = req.query.status;
  }
  
  if (req.query.featured) {
    filters.featured = req.query.featured === 'true';
  }
  
  if (req.query.search) {
    filters.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { technologies: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
  }
  
  return filters;
};

// @desc    Obtenir tous les projets
// @route   GET /api/v1/projects
// @access  Public
const getProjects = catchAsync(async (req, res, next) => {
  const { page, limit, skip } = getPaginationData(req);
  const filters = buildFilters(req);
  
  // Construire la requête
  let query = Project.find(filters);
  
  // Tri
  const sortBy = req.query.sort || '-createdAt';
  query = query.sort(sortBy);
  
  // Sélection des champs
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }
  
  // Population
  query = query.populate('author', 'firstName lastName avatar');
  
  // Exécution avec pagination
  const projects = await query.skip(skip).limit(limit);
  
  // Compter le total
  const total = await Project.countDocuments(filters);
  
  // Calculer les métadonnées de pagination
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  res.status(200).json({
    success: true,
    count: projects.length,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    },
    data: {
      projects
    }
  });
});

// @desc    Obtenir un projet par ID ou slug
// @route   GET /api/v1/projects/:id
// @access  Public
const getProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  // Chercher par ID MongoDB ou par slug
  const query = id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: id, isPublished: true }
    : { slug: id, isPublished: true };
  
  const project = await Project.findOne(query)
    .populate('author', 'firstName lastName avatar');
  
  if (!project) {
    return next(new AppError('Projet non trouvé', 404));
  }
  
  // Incrémenter les vues
  await project.incrementViews();
  
  res.status(200).json({
    success: true,
    data: {
      project
    }
  });
});

// @desc    Créer un nouveau projet
// @route   POST /api/v1/projects
// @access  Private (Admin)
const createProject = catchAsync(async (req, res, next) => {
  // Ajouter l'auteur
  req.body.author = req.user.id;
  
  const project = await Project.create(req.body);
  
  logger.info(`New project created: ${project.title} by ${req.user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'Projet créé avec succès',
    data: {
      project
    }
  });
});

// @desc    Mettre à jour un projet
// @route   PUT /api/v1/projects/:id
// @access  Private (Admin)
const updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new AppError('Projet non trouvé', 404));
  }
  
  // Vérifier que l'utilisateur est l'auteur ou admin
  if (project.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Non autorisé à modifier ce projet', 403));
  }
  
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('author', 'firstName lastName avatar');
  
  logger.info(`Project updated: ${updatedProject.title} by ${req.user.email}`);
  
  res.status(200).json({
    success: true,
    message: 'Projet mis à jour avec succès',
    data: {
      project: updatedProject
    }
  });
});

// @desc    Supprimer un projet
// @route   DELETE /api/v1/projects/:id
// @access  Private (Admin)
const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return next(new AppError('Projet non trouvé', 404));
  }
  
  // Vérifier que l'utilisateur est l'auteur ou admin
  if (project.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Non autorisé à supprimer ce projet', 403));
  }
  
  await project.deleteOne();
  
  logger.info(`Project deleted: ${project.title} by ${req.user.email}`);
  
  res.status(204).json({
    success: true,
    message: 'Projet supprimé avec succès'
  });
});

// @desc    Obtenir les projets populaires
// @route   GET /api/v1/projects/popular
// @access  Public
const getPopularProjects = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;
  
  const projects = await Project.getPopular(limit);
  
  res.status(200).json({
    success: true,
    count: projects.length,
    data: {
      projects
    }
  });
});

// @desc    Obtenir les projets par catégorie
// @route   GET /api/v1/projects/category/:category
// @access  Public
const getProjectsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const projects = await Project.getByCategory(category, limit);
  
  res.status(200).json({
    success: true,
    count: projects.length,
    data: {
      projects
    }
  });
});

// @desc    Liker un projet
// @route   POST /api/v1/projects/:id/like
// @access  Public
const likeProject = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({ 
    _id: req.params.id, 
    isPublished: true 
  });
  
  if (!project) {
    return next(new AppError('Projet non trouvé', 404));
  }
  
  await project.incrementLikes();
  
  res.status(200).json({
    success: true,
    message: 'Projet liké avec succès',
    data: {
      likes: project.likes + 1
    }
  });
});

// @desc    Obtenir les statistiques des projets
// @route   GET /api/v1/projects/stats
// @access  Private (Admin)
const getProjectStats = catchAsync(async (req, res, next) => {
  const stats = await Project.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: '$likes' },
        avgBudget: { $avg: '$budget' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  const totalProjects = await Project.countDocuments();
  const publishedProjects = await Project.countDocuments({ isPublished: true });
  const featuredProjects = await Project.countDocuments({ featured: true });
  
  res.status(200).json({
    success: true,
    data: {
      totalProjects,
      publishedProjects,
      featuredProjects,
      categoryStats: stats
    }
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getPopularProjects,
  getProjectsByCategory,
  likeProject,
  getProjectStats
};