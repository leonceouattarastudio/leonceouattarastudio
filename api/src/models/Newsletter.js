const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'unsubscribed', 'bounced', 'complained'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['website', 'blog', 'social', 'referral', 'import', 'manual'],
    default: 'website'
  },
  interests: [{
    type: String,
    enum: ['web-development', 'mobile-development', 'tech-news', 'tutorials', 'case-studies', 'tips']
  }],
  preferences: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'occasional'],
      default: 'weekly'
    },
    format: {
      type: String,
      enum: ['html', 'text'],
      default: 'html'
    },
    language: {
      type: String,
      default: 'fr'
    }
  },
  demographics: {
    country: String,
    city: String,
    timezone: String,
    profession: String,
    company: String
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  confirmationDate: Date,
  unsubscribeDate: Date,
  lastEmailSent: Date,
  emailsSent: {
    type: Number,
    default: 0
  },
  emailsOpened: {
    type: Number,
    default: 0
  },
  emailsClicked: {
    type: Number,
    default: 0
  },
  confirmationToken: String,
  unsubscribeToken: {
    type: String,
    unique: true
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  tags: [String],
  customFields: {
    type: Map,
    of: String
  },
  gdprConsent: {
    type: Boolean,
    required: true
  },
  consentDate: {
    type: Date,
    default: Date.now
  },
  doubleOptIn: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ subscriptionDate: -1 });
newsletterSchema.index({ confirmationToken: 1 });
newsletterSchema.index({ unsubscribeToken: 1 });
newsletterSchema.index({ interests: 1 });

// Virtual pour le nom complet
newsletterSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.email;
});

// Virtual pour le taux d'ouverture
newsletterSchema.virtual('openRate').get(function() {
  if (this.emailsSent === 0) return 0;
  return Math.round((this.emailsOpened / this.emailsSent) * 100);
});

// Virtual pour le taux de clic
newsletterSchema.virtual('clickRate').get(function() {
  if (this.emailsSent === 0) return 0;
  return Math.round((this.emailsClicked / this.emailsSent) * 100);
});

// Middleware pre-save pour générer les tokens
newsletterSchema.pre('save', function(next) {
  if (this.isNew) {
    // Générer un token de confirmation
    this.confirmationToken = require('crypto').randomBytes(32).toString('hex');
    
    // Générer un token de désinscription unique
    this.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
  }
  
  next();
});

// Méthode pour confirmer l'inscription
newsletterSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.confirmationDate = new Date();
  this.doubleOptIn = true;
  this.confirmationToken = undefined;
  return this.save();
};

// Méthode pour se désinscrire
newsletterSchema.methods.unsubscribe = function() {
  this.status = 'unsubscribed';
  this.unsubscribeDate = new Date();
  this.isActive = false;
  return this.save();
};

// Méthode pour enregistrer l'ouverture d'un email
newsletterSchema.methods.recordOpen = function() {
  this.emailsOpened += 1;
  this.lastEmailSent = new Date();
  return this.save();
};

// Méthode pour enregistrer un clic
newsletterSchema.methods.recordClick = function() {
  this.emailsClicked += 1;
  return this.save();
};

// Méthode pour enregistrer l'envoi d'un email
newsletterSchema.methods.recordSent = function() {
  this.emailsSent += 1;
  this.lastEmailSent = new Date();
  return this.save();
};

// Méthode statique pour obtenir les abonnés actifs
newsletterSchema.statics.getActiveSubscribers = function(interests = []) {
  const query = { 
    status: 'confirmed', 
    isActive: true 
  };
  
  if (interests.length > 0) {
    query.interests = { $in: interests };
  }
  
  return this.find(query).sort({ subscriptionDate: -1 });
};

// Méthode statique pour obtenir les statistiques
newsletterSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalOpens: { $sum: '$emailsOpened' },
        totalClicks: { $sum: '$emailsClicked' },
        totalSent: { $sum: '$emailsSent' }
      }
    }
  ]);
};

module.exports = mongoose.model('Newsletter', newsletterSchema);