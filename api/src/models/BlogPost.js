const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'L\'extrait est requis'],
    trim: true,
    maxlength: [500, 'L\'extrait ne peut pas dépasser 500 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis']
  },
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['tech', 'tutorial', 'opinion', 'news', 'case-study', 'tips', 'other'],
      message: 'Catégorie invalide'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  scheduledFor: Date,
  featured: {
    type: Boolean,
    default: false
  },
  readingTime: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    canonicalUrl: String
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    readTime: {
      total: {
        type: Number,
        default: 0
      },
      average: {
        type: Number,
        default: 0
      }
    }
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  coAuthors: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  series: {
    name: String,
    part: Number,
    total: Number
  },
  relatedPosts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'BlogPost'
  }],
  comments: [{
    author: {
      name: String,
      email: String,
      website: String
    },
    content: String,
    isApproved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      author: {
        name: String,
        email: String
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  newsletter: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    recipients: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ isPublished: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ featured: 1 });
blogPostSchema.index({ 'analytics.views': -1 });
blogPostSchema.index({ createdAt: -1 });

// Virtual pour l'URL complète
blogPostSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

// Middleware pre-save pour générer le slug et calculer le temps de lecture
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (this.isModified('content')) {
    // Calcul approximatif du temps de lecture (250 mots par minute)
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 250);
  }
  
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Méthode pour incrémenter les vues
blogPostSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { 'analytics.views': 1 } });
};

// Méthode pour incrémenter les likes
blogPostSchema.methods.incrementLikes = function() {
  return this.updateOne({ $inc: { 'analytics.likes': 1 } });
};

// Méthode pour ajouter un commentaire
blogPostSchema.methods.addComment = function(commentData) {
  this.comments.push(commentData);
  return this.save();
};

// Méthode statique pour obtenir les articles populaires
blogPostSchema.statics.getPopular = function(limit = 5) {
  return this.find({ isPublished: true })
    .sort({ 'analytics.views': -1, 'analytics.likes': -1 })
    .limit(limit)
    .populate('author', 'firstName lastName avatar');
};

// Méthode statique pour obtenir les articles par catégorie
blogPostSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ category, isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName avatar');
};

// Méthode statique pour rechercher des articles
blogPostSchema.statics.search = function(query, limit = 10) {
  return this.find({
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('author', 'firstName lastName avatar');
};

module.exports = mongoose.model('BlogPost', blogPostSchema);