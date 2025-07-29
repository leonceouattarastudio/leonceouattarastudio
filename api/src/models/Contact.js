const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^(?:\+33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone invalide']
  },
  company: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères']
    },
    website: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise']
    },
    industry: String
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est requis'],
    enum: {
      values: ['general', 'project', 'support', 'partnership', 'quote', 'other'],
      message: 'Sujet invalide'
    }
  },
  projectType: {
    type: String,
    enum: ['website', 'webapp', 'mobile', 'ecommerce', 'api', 'consulting', 'other']
  },
  budget: {
    range: {
      type: String,
      enum: ['1000-5000', '5000-10000', '10000-20000', '20000-50000', '50000+', 'to-discuss']
    },
    currency: {
      type: String,
      default: 'EUR'
    }
  },
  timeline: {
    type: String,
    enum: ['asap', '1-month', '2-3-months', '3-6-months', '6-months+', 'flexible']
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true,
    maxlength: [2000, 'Le message ne peut pas dépasser 2000 caractères']
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimetype: String
  }],
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'in-progress', 'completed', 'archived'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social', 'email', 'phone', 'other'],
    default: 'website'
  },
  referrer: {
    url: String,
    source: String
  },
  ipAddress: String,
  userAgent: String,
  location: {
    country: String,
    city: String,
    timezone: String
  },
  responses: [{
    message: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    method: {
      type: String,
      enum: ['email', 'phone', 'meeting'],
      default: 'email'
    }
  }],
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: true
    }
  }],
  tags: [String],
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    date: Date,
    completed: {
      type: Boolean,
      default: false
    },
    notes: String
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  spamScore: {
    type: Number,
    default: 0
  },
  gdprConsent: {
    type: Boolean,
    required: true
  },
  marketingConsent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ subject: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ assignedTo: 1 });
contactSchema.index({ isSpam: 1 });

// Virtual pour le nom complet
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour vérifier si le contact nécessite un suivi
contactSchema.virtual('needsFollowUp').get(function() {
  return this.followUp.required && !this.followUp.completed && 
         this.followUp.date && this.followUp.date <= new Date();
});

// Middleware pre-save pour détecter le spam
contactSchema.pre('save', function(next) {
  // Simple détection de spam basée sur des mots-clés
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations'];
  const messageContent = this.message.toLowerCase();
  
  let spamScore = 0;
  spamKeywords.forEach(keyword => {
    if (messageContent.includes(keyword)) {
      spamScore += 20;
    }
  });
  
  // Vérifier les liens suspects
  const linkCount = (messageContent.match(/http/g) || []).length;
  if (linkCount > 3) spamScore += 30;
  
  this.spamScore = spamScore;
  this.isSpam = spamScore > 50;
  
  next();
});

// Méthode pour marquer comme lu
contactSchema.methods.markAsRead = function() {
  if (this.status === 'new') {
    this.status = 'read';
    return this.save();
  }
};

// Méthode pour ajouter une réponse
contactSchema.methods.addResponse = function(responseData) {
  this.responses.push(responseData);
  this.status = 'replied';
  return this.save();
};

// Méthode pour ajouter une note
contactSchema.methods.addNote = function(noteData) {
  this.notes.push(noteData);
  return this.save();
};

// Méthode statique pour obtenir les contacts non lus
contactSchema.statics.getUnread = function() {
  return this.find({ status: 'new', isSpam: false })
    .sort({ createdAt: -1 });
};

// Méthode statique pour obtenir les contacts nécessitant un suivi
contactSchema.statics.getNeedingFollowUp = function() {
  return this.find({
    'followUp.required': true,
    'followUp.completed': false,
    'followUp.date': { $lte: new Date() },
    isSpam: false
  }).sort({ 'followUp.date': 1 });
};

module.exports = mongoose.model('Contact', contactSchema);