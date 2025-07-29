const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'La date est requise'],
    index: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0, // Dimanche
    max: 6  // Samedi
  },
  timeSlots: [{
    startTime: {
      type: String, // Format "HH:MM"
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    endTime: {
      type: String, // Format "HH:MM"
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockReason: String,
    maxBookings: {
      type: Number,
      default: 1
    },
    currentBookings: {
      type: Number,
      default: 0
    },
    serviceTypes: [{
      type: String,
      enum: ['consultation', 'project-discussion', 'demo', 'support', 'follow-up']
    }],
    location: {
      type: String,
      enum: ['online', 'office', 'client-office'],
      default: 'online'
    }
  }],
  specialHours: {
    isSpecialDay: {
      type: Boolean,
      default: false
    },
    reason: String, // "Férié", "Congés", "Formation", etc.
    customHours: [{
      startTime: String,
      endTime: String,
      isAvailable: Boolean
    }]
  },
  timezone: {
    type: String,
    default: 'Europe/Paris'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour optimiser les requêtes
timeSlotSchema.index({ date: 1, 'timeSlots.startTime': 1 });
timeSlotSchema.index({ dayOfWeek: 1 });
timeSlotSchema.index({ 'timeSlots.isAvailable': 1 });

// Virtual pour vérifier si c'est un jour ouvrable
timeSlotSchema.virtual('isWorkingDay').get(function() {
  return this.dayOfWeek >= 1 && this.dayOfWeek <= 6; // Lundi à Samedi
});

// Virtual pour obtenir les créneaux disponibles
timeSlotSchema.virtual('availableSlots').get(function() {
  return this.timeSlots.filter(slot => 
    slot.isAvailable && 
    !slot.isBlocked && 
    slot.currentBookings < slot.maxBookings
  );
});

// Méthode pour réserver un créneau
timeSlotSchema.methods.bookSlot = function(startTime, endTime) {
  const slot = this.timeSlots.find(s => s.startTime === startTime);
  if (slot && slot.currentBookings < slot.maxBookings) {
    slot.currentBookings += 1;
    if (slot.currentBookings >= slot.maxBookings) {
      slot.isAvailable = false;
    }
    return this.save();
  }
  throw new Error('Créneau non disponible');
};

// Méthode pour libérer un créneau
timeSlotSchema.methods.releaseSlot = function(startTime) {
  const slot = this.timeSlots.find(s => s.startTime === startTime);
  if (slot && slot.currentBookings > 0) {
    slot.currentBookings -= 1;
    slot.isAvailable = true;
    return this.save();
  }
  throw new Error('Aucune réservation à libérer');
};

// Méthode statique pour obtenir les créneaux disponibles sur une période
timeSlotSchema.statics.getAvailableSlots = function(startDate, endDate, duration = 60, serviceType = null) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    'timeSlots.isAvailable': true,
    'timeSlots.isBlocked': false
  };

  if (serviceType) {
    query['timeSlots.serviceTypes'] = serviceType;
  }

  return this.find(query)
    .sort({ date: 1, 'timeSlots.startTime': 1 });
};

// Méthode statique pour générer les créneaux par défaut
timeSlotSchema.statics.generateDefaultSlots = function(date) {
  const dayOfWeek = date.getDay();
  
  // Pas de créneaux le dimanche
  if (dayOfWeek === 0) {
    return null;
  }

  const defaultSlots = [];
  
  // Créneaux matin : 9h00 - 12h00
  for (let hour = 9; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endHour = minute === 30 ? hour + 1 : hour;
      const endMinute = minute === 30 ? 0 : 30;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      defaultSlots.push({
        startTime,
        endTime,
        isAvailable: true,
        serviceTypes: ['consultation', 'project-discussion', 'demo'],
        location: 'online'
      });
    }
  }

  // Créneaux après-midi : 14h00 - 18h00
  for (let hour = 14; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endHour = minute === 30 ? hour + 1 : hour;
      const endMinute = minute === 30 ? 0 : 30;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      defaultSlots.push({
        startTime,
        endTime,
        isAvailable: true,
        serviceTypes: ['consultation', 'project-discussion', 'demo', 'support'],
        location: 'online'
      });
    }
  }

  return {
    date,
    dayOfWeek,
    timeSlots: defaultSlots,
    timezone: 'Europe/Paris'
  };
};

module.exports = mongoose.model('TimeSlot', timeSlotSchema);