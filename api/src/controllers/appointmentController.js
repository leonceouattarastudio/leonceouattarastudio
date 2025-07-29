const Service = require('../models/Service');
const TimeSlot = require('../models/TimeSlot');
const Appointment = require('../models/Appointment');
const { catchAsync, AppError } = require('../middleware/error/errorHandler');
const logger = require('../config/logger');

// Fonction utilitaire pour envoyer des emails
const sendEmail = async (to, subject, message) => {
  logger.info(`Email sent to ${to}: ${subject}`);
  return true;
};

// Fonction utilitaire pour générer un fichier ICS
const generateICSFile = (appointment) => {
  const startTime = new Date(appointment.appointment.startTime);
  const endTime = new Date(appointment.appointment.endTime);
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Leonce Ouattara Studio//Appointment//FR
BEGIN:VEVENT
UID:${appointment._id}@leonceouattara.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startTime)}
DTEND:${formatDate(endTime)}
SUMMARY:${appointment.appointment.title}
DESCRIPTION:${appointment.appointment.description || 'Rendez-vous avec Leonce Ouattara'}
LOCATION:${appointment.appointment.location.type === 'online' ? 'Visioconférence' : appointment.appointment.location.address || ''}
ORGANIZER:CN=Leonce Ouattara:MAILTO:leonce-ouattara-studio@outlook.com
ATTENDEE:CN=${appointment.client.firstName} ${appointment.client.lastName}:MAILTO:${appointment.client.email}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:EMAIL
DESCRIPTION:Rappel: Rendez-vous dans 2 heures
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};

// Fonction pour calculer le temps de trajet
const calculateTravelTime = async (clientLocation, appointmentLocation) => {
  // Simulation - en production, utiliser Google Maps API
  if (!clientLocation || !appointmentLocation) return null;
  
  // Retourner un temps estimé basique
  return {
    estimated: 30, // minutes
    mode: 'driving'
  };
};

// Fonction pour vérifier la disponibilité d'un créneau
const isSlotAvailable = async (startTime, endTime, excludeId = null) => {
  const query = {
    $or: [
      {
        'appointment.startTime': { $lt: endTime },
        'appointment.endTime': { $gt: startTime }
      }
    ],
    status: { $in: ['scheduled', 'confirmed'] }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictingAppointment = await Appointment.findOne(query);
  return !conflictingAppointment;
};

// @desc    Créer un nouveau rendez-vous
// @route   POST /api/v1/appointments
// @access  Public
const createAppointment = catchAsync(async (req, res, next) => {
  const {
    serviceId,
    client,
    appointment,
    project,
    consents,
    analytics
  } = req.body;

  if (!consents?.gdpr?.accepted) {
    return next(new AppError('Le consentement RGPD est requis', 400));
  }

  // Vérifier que le service existe
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    return next(new AppError('Service non trouvé ou indisponible', 404));
  }

  // Vérifier la disponibilité du créneau
  const isAvailable = await isSlotAvailable(
    new Date(appointment.startTime),
    new Date(appointment.endTime)
  );

  if (!isAvailable) {
    return next(new AppError('Ce créneau n\'est pas disponible', 400));
  }

  // Calculer le temps de trajet si nécessaire
  let travelTime = null;
  if (client.location && appointment.location.type !== 'online') {
    travelTime = await calculateTravelTime(client.location, appointment.location);
  }

  // Créer le rendez-vous
  const appointmentData = {
    service: serviceId,
    client: {
      ...client,
      timezone: client.timezone || 'Europe/Paris',
      location: {
        ...client.location,
        travelTime
      },
      // Vérifier si c'est un client récurrent
      isReturningClient: await Appointment.countDocuments({ 'client.email': client.email }) > 0
    },
    appointment: {
      ...appointment,
      duration: service.duration.consultationDuration,
      location: {
        type: appointment.location?.type || 'online',
        details: appointment.location?.details,
        meetingLink: appointment.location?.type === 'online' ? 
          `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}` : 
          undefined
      }
    },
    project,
    consents: {
      gdpr: {
        accepted: consents.gdpr.accepted,
        acceptedAt: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      },
      marketing: consents.marketing || { accepted: false },
      dataRetention: consents.dataRetention || { accepted: false }
    },
    analytics: {
      bookingSource: req.get('Referer') || 'direct',
      deviceType: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop',
      browserInfo: req.get('User-Agent'),
      referrerUrl: req.get('Referer'),
      ...analytics
    }
  };

  const newAppointment = await Appointment.create(appointmentData);

  // Incrémenter le compteur de réservations du service
  await service.incrementBookings();

  // Générer le fichier ICS
  const icsContent = generateICSFile(newAppointment);

  // Envoyer email de confirmation au client
  try {
    const appointmentDate = new Date(appointment.startTime).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const appointmentTime = new Date(appointment.startTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    await sendEmail(
      client.email,
      'Confirmation de rendez-vous - Leonce Ouattara Studio',
      `
        Bonjour ${client.firstName},
        
        Votre rendez-vous a été confirmé avec succès !
        
        🎯 Service : ${service.name}
        📅 Date : ${appointmentDate}
        🕐 Heure : ${appointmentTime}
        ⏱️ Durée : ${service.duration.consultationDuration} minutes
        📍 Type : ${appointment.location?.type === 'online' ? 'Visioconférence' : 'Présentiel'}
        ${appointment.location?.meetingLink ? `🔗 Lien : ${appointment.location.meetingLink}` : ''}
        ${travelTime ? `🚗 Temps de trajet estimé : ${travelTime.estimated} minutes` : ''}
        
        Sujet : ${appointment.title}
        ${appointment.description ? `Description : ${appointment.description}` : ''}
        
        Vous trouverez en pièce jointe un fichier .ics pour ajouter ce rendez-vous à votre calendrier.
        
        Je vous enverrai un rappel 24h avant notre rendez-vous.
        
        Si vous devez annuler ou reporter, utilisez ce lien :
        ${process.env.FRONTEND_URL}/appointments/manage/${newAppointment.cancellationToken}
        
        À bientôt,
        Leonce Ouattara
        Expert IT & Solutions Digitales
        
        Email: leonce-ouattara-studio@outlook.com
        Téléphone: +225 05 45 13 07 39
      `
    );

    // Marquer la confirmation comme envoyée
    newAppointment.notifications.confirmation = {
      sent: true,
      sentAt: new Date(),
      icsAttached: true
    };
    await newAppointment.save();

    // Envoyer notification à l'admin
    await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@leonceouattara.com',
      `Nouveau RDV - ${service.name}`,
      `
        Nouveau rendez-vous programmé :
        
        Service : ${service.name} (${service.category})
        Prix : ${service.formattedPrice}
        
        Client : ${client.firstName} ${client.lastName}
        Email : ${client.email}
        Téléphone : ${client.phone || 'Non renseigné'}
        Entreprise : ${client.company?.name || 'Non renseignée'}
        Client récurrent : ${appointmentData.client.isReturningClient ? 'Oui' : 'Non'}
        
        Date : ${appointmentDate} à ${appointmentTime}
        Durée : ${service.duration.consultationDuration} minutes
        Type : ${appointment.type}
        
        Projet :
        Type : ${project?.type || 'Non spécifié'}
        Budget : ${project?.budget?.range || 'Non spécifié'}
        Timeline : ${project?.timeline || 'Non spécifiée'}
        
        Description : ${project?.description || 'Aucune description'}
        
        Informations supplémentaires :
        ${client.additionalInfo ? JSON.stringify(client.additionalInfo, null, 2) : 'Aucune'}
        
        Lien de gestion : ${process.env.ADMIN_URL}/appointments/${newAppointment._id}
      `
    );
  } catch (emailError) {
    logger.error('Appointment confirmation email failed:', emailError);
  }

  logger.info(`New appointment created: ${client.email} - ${service.name}`);

  res.status(201).json({
    success: true,
    message: 'Rendez-vous créé avec succès. Un email de confirmation vous a été envoyé.',
    data: {
      appointment: {
        id: newAppointment._id,
        service: service.name,
        startTime: newAppointment.appointment.startTime,
        duration: newAppointment.appointment.duration,
        status: newAppointment.status,
        confirmationToken: newAppointment.confirmationToken
      }
    }
  });
});

// @desc    Obtenir les créneaux suggérés pour un service
// @route   GET /api/v1/appointments/suggested-slots/:serviceId
// @access  Public
const getSuggestedSlots = catchAsync(async (req, res, next) => {
  const { serviceId } = req.params;
  const { date, preference = 'first-available' } = req.query;

  const service = await Service.findById(serviceId);
  if (!service) {
    return next(new AppError('Service non trouvé', 404));
  }

  const startDate = date ? new Date(date) : new Date();
  const endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 jours

  // Obtenir les créneaux disponibles
  const availableSlots = await TimeSlot.getAvailableSlots(
    startDate,
    endDate,
    service.duration.consultationDuration,
    'consultation'
  );

  let suggestedSlots = [];

  switch (preference) {
    case 'first-available':
      suggestedSlots = availableSlots.slice(0, 1);
      break;
    case 'morning':
      suggestedSlots = availableSlots.filter(slot => {
        const hour = parseInt(slot.timeSlots[0]?.startTime.split(':')[0]);
        return hour >= 9 && hour < 12;
      }).slice(0, 5);
      break;
    case 'afternoon':
      suggestedSlots = availableSlots.filter(slot => {
        const hour = parseInt(slot.timeSlots[0]?.startTime.split(':')[0]);
        return hour >= 14 && hour < 18;
      }).slice(0, 5);
      break;
    default:
      suggestedSlots = availableSlots.slice(0, 10);
  }

  res.status(200).json({
    success: true,
    data: {
      service: {
        id: service._id,
        name: service.name,
        duration: service.duration.consultationDuration
      },
      suggestedSlots,
      preference
    }
  });
});

// @desc    Obtenir tous les rendez-vous (Admin)
// @route   GET /api/v1/appointments
// @access  Private (Admin)
const getAppointments = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Filtres
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.type) filters['appointment.type'] = req.query.type;
  if (req.query.service) filters.service = req.query.service;
  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    filters['appointment.startTime'] = {
      $gte: date,
      $lt: nextDay
    };
  }

  const appointments = await Appointment.find(filters)
    .sort({ 'appointment.startTime': 1 })
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'firstName lastName')
    .populate('service', 'name category pricing.basePrice pricing.currency');

  const total = await Appointment.countDocuments(filters);

  res.status(200).json({
    success: true,
    count: appointments.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { appointments }
  });
});

// @desc    Obtenir un rendez-vous par ID (Admin)
// @route   GET /api/v1/appointments/:id
// @access  Private (Admin)
const getAppointment = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName')
    .populate('createdBy', 'firstName lastName')
    .populate('service', 'name category description pricing duration');

  if (!appointment) {
    return next(new AppError('Rendez-vous non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    data: { appointment }
  });
});

// @desc    Confirmer un rendez-vous
// @route   POST /api/v1/appointments/:id/confirm
// @access  Public
const confirmAppointment = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    confirmationToken: token,
    status: 'scheduled'
  });

  if (!appointment) {
    return next(new AppError('Rendez-vous non trouvé ou token invalide', 404));
  }

  await appointment.confirm();

  logger.info(`Appointment confirmed: ${appointment._id}`);

  res.status(200).json({
    success: true,
    message: 'Rendez-vous confirmé avec succès',
    data: { appointment }
  });
});

// @desc    Annuler un rendez-vous
// @route   POST /api/v1/appointments/:id/cancel
// @access  Public
const cancelAppointment = catchAsync(async (req, res, next) => {
  const { token, reason } = req.body;

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    cancellationToken: token,
    status: { $in: ['scheduled', 'confirmed'] }
  });

  if (!appointment) {
    return next(new AppError('Rendez-vous non trouvé ou token invalide', 404));
  }

  await appointment.cancel(reason);

  // Envoyer email de confirmation d'annulation
  try {
    await sendEmail(
      appointment.client.email,
      'Annulation de rendez-vous confirmée',
      `
        Bonjour ${appointment.client.firstName},
        
        Votre rendez-vous du ${new Date(appointment.appointment.startTime).toLocaleDateString('fr-FR')} 
        a été annulé avec succès.
        
        ${reason ? `Raison : ${reason}` : ''}
        
        N'hésitez pas à reprendre contact pour programmer un nouveau rendez-vous.
        
        Cordialement,
        Leonce Ouattara
      `
    );
  } catch (emailError) {
    logger.error('Cancellation email failed:', emailError);
  }

  logger.info(`Appointment cancelled: ${appointment._id} - ${reason || 'No reason'}`);

  res.status(200).json({
    success: true,
    message: 'Rendez-vous annulé avec succès',
    data: { appointment }
  });
});

// @desc    Reporter un rendez-vous
// @route   PUT /api/v1/appointments/:id/reschedule
// @access  Private (Admin)
const rescheduleAppointment = catchAsync(async (req, res, next) => {
  const { newStartTime, newDuration } = req.body;

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return next(new AppError('Rendez-vous non trouvé', 404));
  }

  const newEndTime = new Date(new Date(newStartTime).getTime() + (newDuration || appointment.appointment.duration) * 60000);

  // Vérifier la disponibilité du nouveau créneau
  const isAvailable = await isSlotAvailable(
    new Date(newStartTime),
    newEndTime,
    appointment._id
  );

  if (!isAvailable) {
    return next(new AppError('Le nouveau créneau n\'est pas disponible', 400));
  }

  await appointment.reschedule(new Date(newStartTime), newDuration);

  // Envoyer email de notification
  try {
    await sendEmail(
      appointment.client.email,
      'Rendez-vous reporté - Nouvelle date confirmée',
      `
        Bonjour ${appointment.client.firstName},
        
        Votre rendez-vous a été reporté à une nouvelle date :
        
        📅 Nouvelle date : ${new Date(newStartTime).toLocaleDateString('fr-FR')}
        🕐 Nouvelle heure : ${new Date(newStartTime).toLocaleTimeString('fr-FR')}
        ⏱️ Durée : ${newDuration || appointment.appointment.duration} minutes
        
        Toutes les autres informations restent inchangées.
        
        Cordialement,
        Leonce Ouattara
      `
    );
  } catch (emailError) {
    logger.error('Reschedule email failed:', emailError);
  }

  logger.info(`Appointment rescheduled: ${appointment._id} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Rendez-vous reporté avec succès',
    data: { appointment }
  });
});

// @desc    Obtenir les créneaux disponibles
// @route   GET /api/v1/appointments/available-slots
// @access  Public
const getAvailableSlots = catchAsync(async (req, res, next) => {
  const { date, duration = 60, serviceId } = req.query;

  if (!date) {
    return next(new AppError('Date requise', 400));
  }

  let serviceDuration = parseInt(duration);
  
  // Si un service est spécifié, utiliser sa durée
  if (serviceId) {
    const service = await Service.findById(serviceId);
    if (service) {
      serviceDuration = service.duration.consultationDuration;
    }
  }

  const requestedDate = new Date(date);
  
  // Bloquer les dimanches
  if (requestedDate.getDay() === 0) {
    return res.status(200).json({
      success: true,
      data: {
        date: requestedDate,
        availableSlots: [],
        message: 'Aucun créneau disponible le dimanche'
      }
    });
  }
  
  const startOfDay = new Date(requestedDate);
  startOfDay.setHours(9, 0, 0, 0); // 9h00
  const endOfDay = new Date(requestedDate);
  endOfDay.setHours(18, 0, 0, 0); // 18h00

  // Obtenir les rendez-vous existants pour cette date
  const existingAppointments = await Appointment.find({
    'appointment.startTime': {
      $gte: startOfDay,
      $lt: endOfDay
    },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ 'appointment.startTime': 1 });

  // Générer les créneaux disponibles (par tranches de 30 minutes)
  const availableSlots = [];
  const slotDuration = serviceDuration;
  
  for (let time = new Date(startOfDay); time < endOfDay; time.setMinutes(time.getMinutes() + 30)) {
    const slotEnd = new Date(time.getTime() + slotDuration * 60000);
    
    if (slotEnd <= endOfDay) {
      const isAvailable = await isSlotAvailable(time, slotEnd);
      
      if (isAvailable) {
        availableSlots.push({
          startTime: new Date(time),
          endTime: slotEnd,
          duration: slotDuration,
          period: time.getHours() < 12 ? 'morning' : time.getHours() < 18 ? 'afternoon' : 'evening'
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    data: {
      date: requestedDate,
      availableSlots,
      serviceDuration,
      totalSlots: availableSlots.length
    }
  });
});

// @desc    Obtenir les rendez-vous du jour (Admin)
// @route   GET /api/v1/appointments/today
// @access  Private (Admin)
const getTodayAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.getTodayAppointments()
    .populate('service', 'name category');

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: { appointments }
  });
});

// @desc    Envoyer les rappels automatiques
// @route   POST /api/v1/appointments/send-reminders
// @access  Private (Admin)
const sendReminders = catchAsync(async (req, res, next) => {
  const appointmentsDue = await Appointment.getDueForReminders()
    .populate('service', 'name')
    .populate('client');

  let sentCount = 0;
  let failedCount = 0;

  for (const appointment of appointmentsDue) {
    try {
      const now = new Date();
      const appointmentTime = new Date(appointment.appointment.startTime);
      const timeDiff = appointmentTime - now;
      
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      const twoHoursInMs = 2 * 60 * 60 * 1000;
      
      let reminderType = '';
      let subject = '';
      let message = '';
      
      if (timeDiff <= twoDaysInMs && timeDiff > twoHoursInMs) {
        reminderType = '2-days';
        subject = 'Rappel : Votre rendez-vous dans 2 jours';
        message = `
          Bonjour ${appointment.client.firstName},
          
          Ceci est un rappel pour votre rendez-vous prévu dans 2 jours :
          
          📅 Date : ${appointmentTime.toLocaleDateString('fr-FR')}
          🕐 Heure : ${appointmentTime.toLocaleTimeString('fr-FR')}
          🎯 Service : ${appointment.service.name}
          
          Si vous devez annuler ou reporter, utilisez ce lien :
          ${process.env.FRONTEND_URL}/appointments/manage/${appointment.cancellationToken}
          
          À bientôt,
          Leonce Ouattara
        `;
      } else if (timeDiff <= twoHoursInMs && timeDiff > 0) {
        reminderType = '2-hours';
        subject = 'Rappel urgent : Votre rendez-vous dans 2 heures';
        message = `
          Bonjour ${appointment.client.firstName},
          
          Votre rendez-vous approche ! Dans 2 heures :
          
          🕐 Heure : ${appointmentTime.toLocaleTimeString('fr-FR')}
          🎯 Service : ${appointment.service.name}
          📍 ${appointment.appointment.location.type === 'online' ? 
            `Lien de visioconférence : ${appointment.appointment.location.meetingLink}` : 
            `Adresse : ${appointment.appointment.location.address}`}
          
          Préparez-vous et à tout à l'heure !
          
          Leonce Ouattara
        `;
      }
      
      if (reminderType) {
        await sendEmail(appointment.client.email, subject, message);
        await appointment.markReminderSent(reminderType);
        sentCount++;
      }
    } catch (error) {
      logger.error(`Failed to send reminder for appointment ${appointment._id}:`, error);
      failedCount++;
    }
  }

  res.status(200).json({
    success: true,
    message: `Rappels envoyés : ${sentCount} succès, ${failedCount} échecs`,
    data: {
      sent: sentCount,
      failed: failedCount,
      total: appointmentsDue.length
    }
  });
});

// @desc    Obtenir les statistiques des rendez-vous (Admin)
// @route   GET /api/v1/appointments/stats
// @access  Private (Admin)
const getAppointmentStats = catchAsync(async (req, res, next) => {
  const totalAppointments = await Appointment.countDocuments();
  const scheduledAppointments = await Appointment.countDocuments({ status: 'scheduled' });
  const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
  const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
  const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

  const typeStats = await Appointment.aggregate([
    {
      $group: {
        _id: '$appointment.type',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Statistiques par service
  const serviceStats = await Appointment.aggregate([
    {
      $lookup: {
        from: 'services',
        localField: 'service',
        foreignField: '_id',
        as: 'serviceInfo'
      }
    },
    {
      $group: {
        _id: '$service',
        serviceName: { $first: '$serviceInfo.name' },
        count: { $sum: 1 },
        revenue: { $sum: '$serviceSnapshot.price' },
        avgRating: { $avg: '$feedback.rating' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Calcul des KPIs
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const monthlyAppointments = await Appointment.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
  });
  
  const monthlyCancellations = await Appointment.countDocuments({
    status: 'cancelled',
    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
  });
  
  const monthlyCompletions = await Appointment.countDocuments({
    status: 'completed',
    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
  });
  
  const cancellationRate = monthlyAppointments > 0 ? (monthlyCancellations / monthlyAppointments) * 100 : 0;
  const completionRate = monthlyAppointments > 0 ? (monthlyCompletions / monthlyAppointments) * 100 : 0;
  
  // Calcul du revenu moyen par RDV
  const revenueStats = await Appointment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$serviceSnapshot.price' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  const avgRevenuePerAppointment = revenueStats[0] ? 
    revenueStats[0].totalRevenue / revenueStats[0].count : 0;

  res.status(200).json({
    success: true,
    data: {
      totalAppointments,
      scheduledAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      typeStats,
      serviceStats,
      kpis: {
        cancellationRate: Math.round(cancellationRate * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
        avgRevenuePerAppointment: Math.round(avgRevenuePerAppointment * 100) / 100,
        monthlyBookings: monthlyAppointments
      }
    }
  });
});

module.exports = {
  createAppointment,
  getSuggestedSlots,
  getAppointments,
  getAppointment,
  confirmAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableSlots,
  getTodayAppointments,
  sendReminders,
  getAppointmentStats
};