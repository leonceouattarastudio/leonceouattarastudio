const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: [true, 'L\'ID de session est requis'],
    index: true
  },
  user: {
    id: String,
    name: String,
    email: String,
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    ipAddress: String,
    userAgent: String
  },
  message: {
    type: {
      type: String,
      enum: ['user', 'bot', 'system'],
      required: true
    },
    content: {
      type: String,
      required: [true, 'Le contenu du message est requis'],
      trim: true,
      maxlength: [2000, 'Le message ne peut pas dépasser 2000 caractères']
    },
    intent: {
      type: String,
      enum: [
        'greeting', 'question', 'request-quote', 'request-meeting', 
        'project-inquiry', 'support', 'information', 'goodbye', 'other'
      ]
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    entities: [{
      type: String,
      value: String,
      confidence: Number
    }],
    quickReplies: [String],
    attachments: [{
      type: String,
      url: String,
      filename: String
    }]
  },
  context: {
    previousIntent: String,
    conversationStage: {
      type: String,
      enum: ['initial', 'information-gathering', 'qualification', 'closing', 'completed'],
      default: 'initial'
    },
    userInfo: {
      name: String,
      email: String,
      phone: String,
      company: String,
      projectType: String,
      budget: String,
      timeline: String
    },
    flags: {
      needsHumanIntervention: {
        type: Boolean,
        default: false
      },
      isQualifiedLead: {
        type: Boolean,
        default: false
      },
      hasRequestedQuote: {
        type: Boolean,
        default: false
      },
      hasRequestedMeeting: {
        type: Boolean,
        default: false
      }
    }
  },
  response: {
    processingTime: Number, // en millisecondes
    source: {
      type: String,
      enum: ['predefined', 'ai-generated', 'knowledge-base', 'fallback'],
      default: 'predefined'
    },
    template: String,
    variables: Map
  },
  analytics: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
    sentimentScore: {
      type: Number,
      min: -1,
      max: 1,
      default: 0
    },
    language: {
      type: String,
      default: 'fr'
    },
    topics: [String],
    keywords: [String]
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    timezone: String,
    platform: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    referrer: String,
    pageUrl: String
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'archived'],
    default: 'active'
  },
  escalation: {
    reason: String,
    escalatedAt: Date,
    escalatedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    helpful: Boolean,
    submittedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes
chatMessageSchema.index({ sessionId: 1, createdAt: 1 });
chatMessageSchema.index({ 'user.email': 1 });
chatMessageSchema.index({ 'message.type': 1 });
chatMessageSchema.index({ 'message.intent': 1 });
chatMessageSchema.index({ status: 1 });
chatMessageSchema.index({ createdAt: -1 });
chatMessageSchema.index({ 'context.flags.needsHumanIntervention': 1 });

// Virtual pour vérifier si c'est un message utilisateur
chatMessageSchema.virtual('isUserMessage').get(function() {
  return this.message.type === 'user';
});

// Virtual pour vérifier si c'est un lead qualifié
chatMessageSchema.virtual('isQualifiedLead').get(function() {
  return this.context.flags.isQualifiedLead;
});

// Middleware pre-save pour analyser le sentiment et extraire les entités
chatMessageSchema.pre('save', function(next) {
  if (this.isNew && this.message.type === 'user') {
    // Analyse simple du sentiment basée sur des mots-clés
    const positiveWords = ['merci', 'parfait', 'excellent', 'super', 'génial', 'satisfait'];
    const negativeWords = ['problème', 'bug', 'erreur', 'déçu', 'mauvais', 'nul'];
    
    const content = this.message.content.toLowerCase();
    let sentimentScore = 0;
    
    positiveWords.forEach(word => {
      if (content.includes(word)) sentimentScore += 0.2;
    });
    
    negativeWords.forEach(word => {
      if (content.includes(word)) sentimentScore -= 0.2;
    });
    
    this.analytics.sentimentScore = Math.max(-1, Math.min(1, sentimentScore));
    
    if (sentimentScore > 0.1) {
      this.analytics.sentiment = 'positive';
    } else if (sentimentScore < -0.1) {
      this.analytics.sentiment = 'negative';
    } else {
      this.analytics.sentiment = 'neutral';
    }
    
    // Extraction simple d'entités (email, téléphone)
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(?:\+33|0)[1-9](?:[0-9]{8})/g;
    
    const emails = content.match(emailRegex);
    const phones = content.match(phoneRegex);
    
    if (emails) {
      emails.forEach(email => {
        this.message.entities.push({
          type: 'email',
          value: email,
          confidence: 0.9
        });
      });
    }
    
    if (phones) {
      phones.forEach(phone => {
        this.message.entities.push({
          type: 'phone',
          value: phone,
          confidence: 0.8
        });
      });
    }
  }
  
  next();
});

// Méthode pour marquer comme nécessitant une intervention humaine
chatMessageSchema.methods.escalate = function(reason, assignedTo) {
  this.context.flags.needsHumanIntervention = true;
  this.status = 'escalated';
  this.escalation = {
    reason,
    escalatedAt: new Date(),
    escalatedTo: assignedTo
  };
  return this.save();
};

// Méthode pour résoudre l'escalation
chatMessageSchema.methods.resolveEscalation = function() {
  this.escalation.resolved = true;
  this.escalation.resolvedAt = new Date();
  this.status = 'resolved';
  return this.save();
};

// Méthode pour ajouter un feedback
chatMessageSchema.methods.addFeedback = function(feedbackData) {
  this.feedback = {
    ...feedbackData,
    submittedAt: new Date()
  };
  return this.save();
};

// Méthode statique pour obtenir les conversations par session
chatMessageSchema.statics.getConversation = function(sessionId) {
  return this.find({ sessionId })
    .sort({ createdAt: 1 })
    .populate('escalation.escalatedTo', 'firstName lastName');
};

// Méthode statique pour obtenir les leads qualifiés
chatMessageSchema.statics.getQualifiedLeads = function() {
  return this.find({
    'context.flags.isQualifiedLead': true,
    'message.type': 'user'
  })
  .sort({ createdAt: -1 })
  .distinct('sessionId');
};

// Méthode statique pour obtenir les conversations nécessitant une intervention
chatMessageSchema.statics.getNeedingIntervention = function() {
  return this.find({
    'context.flags.needsHumanIntervention': true,
    status: 'escalated'
  })
  .sort({ 'escalation.escalatedAt': 1 })
  .populate('escalation.escalatedTo', 'firstName lastName');
};

// Méthode statique pour obtenir les statistiques du chatbot
chatMessageSchema.statics.getStats = function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      $lte: endDate || new Date()
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          type: "$message.type"
        },
        count: { $sum: 1 },
        avgSentiment: { $avg: "$analytics.sentimentScore" }
      }
    },
    {
      $group: {
        _id: "$_id.date",
        userMessages: {
          $sum: { $cond: [{ $eq: ["$_id.type", "user"] }, "$count", 0] }
        },
        botMessages: {
          $sum: { $cond: [{ $eq: ["$_id.type", "bot"] }, "$count", 0] }
        },
        avgSentiment: { $avg: "$avgSentiment" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('ChatMessage', chatMessageSchema);