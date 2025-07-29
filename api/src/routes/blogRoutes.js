const express = require('express');
const {
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
} = require('../controllers/blogController');

const { authenticate, authorize, optionalAuth } = require('../middleware/auth/auth');
const { validate, commonSchemas } = require('../middleware/validation/validation');
const { publicLimiter } = require('../config/rateLimiter');
const Joi = require('joi');

const router = express.Router();

// Schémas de validation pour le blog
const blogSchemas = {
  create: Joi.object({
    title: Joi.string().trim().min(5).max(200).required(),
    excerpt: Joi.string().trim().min(10).max(500).required(),
    content: Joi.string().trim().min(100).required(),
    category: Joi.string().valid('tech', 'tutorial', 'opinion', 'news', 'case-study', 'tips', 'other').required(),
    tags: Joi.array().items(Joi.string().trim().lowercase()).min(1).max(10),
    featuredImage: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().trim().max(200),
      caption: Joi.string().trim().max(300)
    }),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().trim().max(200),
      caption: Joi.string().trim().max(300)
    })),
    featured: Joi.boolean().default(false),
    isPublished: Joi.boolean().default(false),
    publishedAt: Joi.date(),
    scheduledFor: Joi.date(),
    seo: Joi.object({
      metaTitle: Joi.string().trim().max(60),
      metaDescription: Joi.string().trim().max(160),
      keywords: Joi.array().items(Joi.string().trim()),
      canonicalUrl: Joi.string().uri()
    }),
    relatedPosts: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
  }),

  update: Joi.object({
    title: Joi.string().trim().min(5).max(200),
    excerpt: Joi.string().trim().min(10).max(500),
    content: Joi.string().trim().min(100),
    category: Joi.string().valid('tech', 'tutorial', 'opinion', 'news', 'case-study', 'tips', 'other'),
    tags: Joi.array().items(Joi.string().trim().lowercase()).min(1).max(10),
    featuredImage: Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().trim().max(200),
      caption: Joi.string().trim().max(300)
    }),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      alt: Joi.string().trim().max(200),
      caption: Joi.string().trim().max(300)
    })),
    featured: Joi.boolean(),
    isPublished: Joi.boolean(),
    publishedAt: Joi.date(),
    scheduledFor: Joi.date(),
    seo: Joi.object({
      metaTitle: Joi.string().trim().max(60),
      metaDescription: Joi.string().trim().max(160),
      keywords: Joi.array().items(Joi.string().trim()),
      canonicalUrl: Joi.string().uri()
    }),
    relatedPosts: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
  }).min(1),

  addComment: Joi.object({
    author: Joi.object({
      name: Joi.string().trim().min(2).max(50).required(),
      email: Joi.string().email().required(),
      website: Joi.string().uri()
    }).required(),
    content: Joi.string().trim().min(10).max(1000).required()
  })
};

// Routes publiques
router.get('/', publicLimiter, getBlogPosts);
router.get('/popular', publicLimiter, getPopularPosts);
router.get('/search', publicLimiter, searchPosts);
router.get('/category/:category', publicLimiter, getPostsByCategory);
router.get('/:id', publicLimiter, getBlogPost);
router.post('/:id/like', publicLimiter, validate(commonSchemas.mongoId, 'params'), likeBlogPost);
router.post('/:id/comments', publicLimiter, validate(commonSchemas.mongoId, 'params'), validate(blogSchemas.addComment), addComment);

// Routes protégées (Admin seulement)
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', validate(blogSchemas.create), createBlogPost);
router.put('/:id', validate(commonSchemas.mongoId, 'params'), validate(blogSchemas.update), updateBlogPost);
router.delete('/:id', validate(commonSchemas.mongoId, 'params'), deleteBlogPost);
router.post('/upload', uploadImage);
router.get('/admin/stats', getBlogStats);

module.exports = router;