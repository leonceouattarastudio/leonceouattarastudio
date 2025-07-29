const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du projet est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu détaillé est requis']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['web', 'mobile', 'ecommerce', 'api', 'desktop', 'other'],
      message: 'Catégorie invalide'
    }
  },
  technologies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'],
      default: 'other'
    },
    version: String,
    icon: String
  }],
  status: {
    type: String,
    enum: {
      values: ['planning', 'development', 'testing', 'completed', 'maintenance', 'archived'],
      message: 'Statut invalide'
    },
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.startDate;
      },
      message: 'La date de fin doit être postérieure à la date de début'
    }
  },
  client: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom du client ne peut pas dépasser 100 caractères']
    },
    company: String,
    email: String,
    website: String
  },
  budget: {
    amount: {
      type: Number,
      min: [0, 'Le budget ne peut pas être négatif']
    },
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  links: {
    github: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'URL GitHub invalide'
      }
    },
    live: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'URL live invalide'
      }
    },
    demo: String,
    documentation: String
  },
  features: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    implemented: {
      type: Boolean,
      default: false
    }
  }],
  challenges: [{
    title: String,
    description: String,
    solution: String
  }],
  results: {
    metrics: [{
      name: String,
      value: String,
      description: String
    }],
    summary: String,
    impact: String
  },
  testimonial: {
    content: String,
    author: String,
    position: String,
    company: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
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
    downloads: {
      type: Number,
      default: 0
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  collaborators: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    role: String,
    contribution: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ isPublished: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ 'analytics.views': -1 });
projectSchema.index({ tags: 1 });

// Virtual pour la durée du projet
projectSchema.virtual('duration').get(function() {
  if (!this.endDate) return null;
  
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} mois`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} an${years > 1 ? 's' : ''}`;
  }
});

// Virtual pour l'image principale
projectSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Middleware pre-save pour générer le slug
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Méthode pour incrémenter les vues
projectSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { 'analytics.views': 1 } });
};

// Méthode pour incrémenter les likes
projectSchema.methods.incrementLikes = function() {
  return this.updateOne({ $inc: { 'analytics.likes': 1 } });
};

// Méthode statique pour obtenir les projets populaires
projectSchema.statics.getPopular = function(limit = 5) {
  return this.find({ isPublished: true })
    .sort({ 'analytics.views': -1, 'analytics.likes': -1 })
    .limit(limit)
    .populate('author', 'firstName lastName');
};

// Méthode statique pour obtenir les projets par catégorie
projectSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ category, isPublished: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author', 'firstName lastName');
};

module.exports = mongoose.model('Project', projectSchema);