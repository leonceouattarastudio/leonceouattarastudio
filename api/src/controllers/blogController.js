const BlogPost = require('../models/BlogPost');
const { catchAsync, AppError } = require('../middleware/error/errorHandler');
const logger = require('../config/logger');

// @desc    Obtenir tous les articles de blog
// @route   GET /api/v1/blog
// @access  Public
const getBlogPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtres
  const filters = { isPublished: true };
  if (req.query.category) filters.category = req.query.category;
  if (req.query.featured) filters.featured = req.query.featured === 'true';
  if (req.query.tags) {
    filters.tags = { $in: req.query.tags.split(',') };
  }

  // Recherche
  if (req.query.search) {
    filters.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { excerpt: { $regex: req.query.search, $options: 'i' } },
      { content: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
  }

  // Tri
  const sortBy = req.query.sort || '-publishedAt';

  const posts = await BlogPost.find(filters)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate('author', 'firstName lastName avatar')
    .select('-content'); // Exclure le contenu complet pour la liste

  const total = await BlogPost.countDocuments(filters);

  res.status(200).json({
    success: true,
    count: posts.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { posts }
  });
});

// @desc    Obtenir un article de blog par ID ou slug
// @route   GET /api/v1/blog/:id
// @access  Public
const getBlogPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Chercher par ID MongoDB ou par slug
  const query = id.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: id, isPublished: true }
    : { slug: id, isPublished: true };

  const post = await BlogPost.findOne(query)
    .populate('author', 'firstName lastName avatar')
    .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt');

  if (!post) {
    return next(new AppError('Article non trouvé', 404));
  }

  // Incrémenter les vues
  await post.incrementViews();

  res.status(200).json({
    success: true,
    data: { post }
  });
});

// @desc    Créer un nouvel article de blog (Admin)
// @route   POST /api/v1/blog
// @access  Private (Admin)
const createBlogPost = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;

  const post = await BlogPost.create(req.body);

  logger.info(`New blog post created: ${post.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Article créé avec succès',
    data: { post }
  });
});

// @desc    Mettre à jour un article de blog (Admin)
// @route   PUT /api/v1/blog/:id
// @access  Private (Admin)
const updateBlogPost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return next(new AppError('Article non trouvé', 404));
  }

  // Vérifier que l'utilisateur est l'auteur ou admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Non autorisé à modifier cet article', 403));
  }

  const updatedPost = await BlogPost.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('author', 'firstName lastName avatar');

  logger.info(`Blog post updated: ${updatedPost.title} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Article mis à jour avec succès',
    data: { post: updatedPost }
  });
});

// @desc    Supprimer un article de blog (Admin)
// @route   DELETE /api/v1/blog/:id
// @access  Private (Admin)
const deleteBlogPost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    return next(new AppError('Article non trouvé', 404));
  }

  // Vérifier que l'utilisateur est l'auteur ou admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Non autorisé à supprimer cet article', 403));
  }

  await post.deleteOne();

  logger.info(`Blog post deleted: ${post.title} by ${req.user.email}`);

  res.status(204).json({
    success: true,
    message: 'Article supprimé avec succès'
  });
});

// @desc    Obtenir les articles populaires
// @route   GET /api/v1/blog/popular
// @access  Public
const getPopularPosts = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;

  const posts = await BlogPost.getPopular(limit);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: { posts }
  });
});

// @desc    Obtenir les articles par catégorie
// @route   GET /api/v1/blog/category/:category
// @access  Public
const getPostsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  const posts = await BlogPost.getByCategory(category, limit);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: { posts }
  });
});

// @desc    Rechercher des articles
// @route   GET /api/v1/blog/search
// @access  Public
const searchPosts = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  if (!q) {
    return next(new AppError('Terme de recherche requis', 400));
  }

  const posts = await BlogPost.search(q, limit);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: { posts }
  });
});

// @desc    Liker un article
// @route   POST /api/v1/blog/:id/like
// @access  Public
const likeBlogPost = catchAsync(async (req, res, next) => {
  const post = await BlogPost.findOne({ 
    _id: req.params.id, 
    isPublished: true 
  });

  if (!post) {
    return next(new AppError('Article non trouvé', 404));
  }

  await post.incrementLikes();

  res.status(200).json({
    success: true,
    message: 'Article liké avec succès',
    data: {
      likes: post.analytics.likes + 1
    }
  });
});

// @desc    Ajouter un commentaire à un article
// @route   POST /api/v1/blog/:id/comments
// @access  Public
const addComment = catchAsync(async (req, res, next) => {
  const { author, content } = req.body;

  const post = await BlogPost.findOne({ 
    _id: req.params.id, 
    isPublished: true 
  });

  if (!post) {
    return next(new AppError('Article non trouvé', 404));
  }

  const commentData = {
    author: {
      name: author.name,
      email: author.email,
      website: author.website
    },
    content,
    isApproved: false // Modération requise
  };

  await post.addComment(commentData);

  logger.info(`New comment on blog post ${post.title} by ${author.email}`);

  res.status(201).json({
    success: true,
    message: 'Commentaire ajouté avec succès. Il sera visible après modération.',
    data: { comment: commentData }
  });
});

// @desc    Upload d'image pour un article (Admin)
// @route   POST /api/v1/blog/upload
// @access  Private (Admin)
const uploadImage = catchAsync(async (req, res, next) => {
  // Simulation d'upload d'image
  // En production, utilisez un service comme Cloudinary, AWS S3, etc.
  
  if (!req.file) {
    return next(new AppError('Aucun fichier fourni', 400));
  }

  // Simulation d'URL d'image uploadée
  const imageUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg?auto=compress&cs=tinysrgb&w=800`;

  logger.info(`Image uploaded for blog by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Image uploadée avec succès',
    data: {
      url: imageUrl,
      filename: req.file.originalname
    }
  });
});

// @desc    Obtenir les statistiques du blog (Admin)
// @route   GET /api/v1/blog/stats
// @access  Private (Admin)
const getBlogStats = catchAsync(async (req, res, next) => {
  const totalPosts = await BlogPost.countDocuments();
  const publishedPosts = await BlogPost.countDocuments({ isPublished: true });
  const draftPosts = await BlogPost.countDocuments({ isPublished: false });
  const featuredPosts = await BlogPost.countDocuments({ featured: true });

  const categoryStats = await BlogPost.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalViews: { $sum: '$analytics.views' },
        totalLikes: { $sum: '$analytics.likes' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      categoryStats
    }
  });
});

module.exports = {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getPopularPosts,
  getPostsByCategory,
  searchPosts,
  likeBlogPost,
  addComment,
  uploadImage,
  getBlogStats
};