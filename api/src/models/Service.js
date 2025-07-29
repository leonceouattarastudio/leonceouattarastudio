const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du service est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['web-development', 'mobile-development', 'ecommerce', 'backend-architecture', 'cloud-devops', 'security-audit', 'consulting'],
      message: 'Catégorie de service invalide'
    }
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  shortDescription: {
    type: String,
    required: [true, 'La description courte est requise'],
    trim: true,
    maxlength: [200, 'La description courte ne peut pas dépasser 200 caractères']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [200, 'Une fonctionnalité ne peut pas dépasser 200 caractères']
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  deliverables: [{
    type: String,
    trim: true,
    maxlength: [200, 'Un livrable ne peut pas dépasser 200 caractères']
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Le prix de base est requis'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    currency: {
      type: String,
      default: 'EUR'
    },
    priceType: {
      type: String,
      enum: ['fixed', 'hourly', 'project', 'consultation'],
      default: 'fixed'
    },
    customPricing: {
      type: Boolean,
      default: false
    }
  },
  duration: {
    estimatedHours: {
      type: Number,
      required: [true, 'La durée estimée est requise'],
      min: [0.5, 'La durée minimale est de 30 minutes']
    },
    consultationDuration: {
      type: Number,
      default: 60, // minutes pour la consultation initiale
      min: [30, 'La consultation minimale est de 30 minutes'],
      max: [240, 'La consultation maximale est de 4 heures']
    },
    flexibleDuration: {
      type: Boolean,
      default: false
    }
  },
  availability: {
    requiresConsultation: {
      type: Boolean,
      default: true
    },
    advanceBooking: {
      min: {
        type: Number,
        default: 24, // heures minimum avant le RDV
        min: [1, 'Réservation minimum 1 heure à l\'avance']
      },
      max: {
        type: Number,
        default: 2160, // 90 jours maximum
        max: [8760, 'Réservation maximum 1 an à l\'avance']
      }
    },
    bufferTime: {
      before: {
        type: Number,
        default: 15, // minutes avant le RDV
        min: [0, 'Buffer avant ne peut pas être négatif']
      },
      after: {
        type: Number,
        default: 15, // minutes après le RDV
        min: [0, 'Buffer après ne peut pas être négatif']
      }
    }
  },
  requirements: {
    clientInfo: [{
      field: {
        type: String,
        required: true,
        enum: ['company', 'website', 'budget', 'timeline', 'projectDescription', 'technicalRequirements', 'teamSize', 'currentSolution']
      },
      required: {
        type: Boolean,
        default: false
      },
      label: String,
      placeholder: String,
      helpText: String
    }],
    documents: [{
      type: String,
      enum: ['brief', 'specifications', 'mockups', 'existing-code', 'analytics', 'other']
    }],
    preparationSteps: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: 'Code'
  },
  color: {
    primary: {
      type: String,
      default: '#00F5FF'
    },
    secondary: {
      type: String,
      default: '#9D4EDD'
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  analytics: {
    bookings: {
      type: Number,
      default: 0
    },
    completedProjects: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
serviceSchema.index({ slug: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1, isPublic: 1 });
serviceSchema.index({ displayOrder: 1 });

// Virtual pour le prix formaté
serviceSchema.virtual('formattedPrice').get(function() {
  if (this.pricing.customPricing) {
    return 'Sur devis';
  }
  
  const price = this.pricing.basePrice.toLocaleString('fr-FR');
  return `${price} ${this.pricing.currency}`;
});

// Virtual pour la durée formatée
serviceSchema.virtual('formattedDuration').get(function() {
  const hours = this.duration.estimatedHours;
  if (hours < 1) {
    return `${hours * 60} min`;
  } else if (hours === 1) {
    return '1 heure';
  } else if (hours < 24) {
    return `${hours} heures`;
  } else {
    const days = Math.floor(hours / 8); // 8h par jour de travail
    return `${days} jour${days > 1 ? 's' : ''}`;
  }
});

// Middleware pre-save pour générer le slug
serviceSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Méthode pour incrémenter les réservations
serviceSchema.methods.incrementBookings = function() {
  return this.updateOne({ $inc: { 'analytics.bookings': 1 } });
};

// Méthode pour mettre à jour le chiffre d'affaires
serviceSchema.methods.addRevenue = function(amount) {
  return this.updateOne({ $inc: { 'analytics.totalRevenue': amount } });
};

// Méthode statique pour obtenir les services par catégorie
serviceSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    isActive: true, 
    isPublic: true 
  }).sort({ displayOrder: 1, name: 1 });
};

// Méthode statique pour obtenir les services populaires
serviceSchema.statics.getPopular = function(limit = 5) {
  return this.find({ 
    isActive: true, 
    isPublic: true 
  })
  .sort({ 'analytics.bookings': -1, 'analytics.averageRating': -1 })
  .limit(limit);
};

module.exports = mongoose.model('Service', serviceSchema);