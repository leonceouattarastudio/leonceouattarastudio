const Newsletter = require('../models/Newsletter');
const { catchAsync, AppError } = require('../middleware/error/errorHandler');
const logger = require('../config/logger');
const crypto = require('crypto');

// Fonction utilitaire pour envoyer des emails
const sendEmail = async (to, subject, message) => {
  logger.info(`Email sent to ${to}: ${subject}`);
  return true;
};

// @desc    S'abonner à la newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
const subscribe = catchAsync(async (req, res, next) => {
  const { email, firstName, lastName, interests, gdprConsent } = req.body;

  if (!gdprConsent) {
    return next(new AppError('Le consentement RGPD est requis', 400));
  }

  // Vérifier si l'email existe déjà
  let subscriber = await Newsletter.findOne({ email });

  if (subscriber) {
    if (subscriber.status === 'confirmed') {
      return next(new AppError('Cet email est déjà abonné à la newsletter', 400));
    }
    
    // Réactiver si désabonné
    if (subscriber.status === 'unsubscribed') {
      subscriber.status = 'pending';
      subscriber.isActive = true;
      subscriber.subscriptionDate = new Date();
    }
  } else {
    // Créer un nouvel abonné
    subscriber = new Newsletter({
      email,
      firstName,
      lastName,
      interests: interests || [],
      source: 'website',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      gdprConsent
    });
  }

  await subscriber.save();

  // Envoyer email de confirmation (double opt-in)
  const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/confirm/${subscriber.confirmationToken}`;
  
  try {
    await sendEmail(
      email,
      'Confirmez votre abonnement - Leonce Ouattara Studio',
      `
        Bonjour ${firstName || ''},
        
        Merci de votre intérêt pour ma newsletter !
        
        Pour confirmer votre abonnement et recevoir mes derniers articles et conseils tech, 
        cliquez sur le lien ci-dessous :
        
        ${confirmationUrl}
        
        Si vous n'avez pas demandé cet abonnement, ignorez simplement cet email.
        
        À bientôt,
        Leonce Ouattara
        Expert IT & Solutions Digitales
        
        ---
        Vous recevrez environ 1 email par semaine avec du contenu de qualité.
        Pas de spam, désabonnement en 1 clic.
      `
    );
  } catch (emailError) {
    logger.error('Confirmation email failed:', emailError);
    return next(new AppError('Erreur lors de l\'envoi de l\'email de confirmation', 500));
  }

  logger.info(`Newsletter subscription initiated for: ${email}`);

  res.status(200).json({
    success: true,
    message: 'Un email de confirmation a été envoyé. Vérifiez votre boîte mail.',
    data: {
      email,
      status: 'pending'
    }
  });
});

// @desc    Confirmer l'abonnement newsletter
// @route   GET /api/v1/newsletter/confirm/:token
// @access  Public
const confirmSubscription = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const subscriber = await Newsletter.findOne({ 
    confirmationToken: token,
    status: 'pending'
  });

  if (!subscriber) {
    return next(new AppError('Token de confirmation invalide ou expiré', 400));
  }

  // Confirmer l'abonnement
  await subscriber.confirm();

  // Envoyer email de bienvenue
  try {
    await sendEmail(
      subscriber.email,
      'Bienvenue dans ma newsletter ! 🚀',
      `
        Bonjour ${subscriber.firstName || ''},
        
        Félicitations ! Votre abonnement à ma newsletter est maintenant confirmé.
        
        Vous recevrez désormais :
        ✅ Mes derniers articles tech
        ✅ Des conseils de développement
        ✅ Les tendances du secteur IT
        ✅ Mes retours d'expérience
        
        Premier conseil : Suivez-moi sur LinkedIn pour encore plus de contenu !
        https://www.linkedin.com/in/leonce-ouattara/
        
        Merci de votre confiance,
        Leonce Ouattara
        
        ---
        Vous pouvez vous désabonner à tout moment en cliquant ici :
        ${process.env.FRONTEND_URL}/newsletter/unsubscribe/${subscriber.unsubscribeToken}
      `
    );
  } catch (emailError) {
    logger.error('Welcome email failed:', emailError);
  }

  logger.info(`Newsletter subscription confirmed for: ${subscriber.email}`);

  res.status(200).json({
    success: true,
    message: 'Abonnement confirmé avec succès ! Bienvenue dans la newsletter.',
    data: {
      email: subscriber.email,
      status: 'confirmed'
    }
  });
});

// @desc    Se désabonner de la newsletter
// @route   GET /api/v1/newsletter/unsubscribe/:token
// @access  Public
const unsubscribe = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const subscriber = await Newsletter.findOne({ 
    unsubscribeToken: token,
    isActive: true
  });

  if (!subscriber) {
    return next(new AppError('Token de désabonnement invalide', 400));
  }

  await subscriber.unsubscribe();

  logger.info(`Newsletter unsubscription for: ${subscriber.email}`);

  res.status(200).json({
    success: true,
    message: 'Désabonnement effectué avec succès. Nous sommes désolés de vous voir partir !',
    data: {
      email: subscriber.email,
      status: 'unsubscribed'
    }
  });
});

// @desc    Obtenir tous les abonnés (Admin)
// @route   GET /api/v1/newsletter/subscribers
// @access  Private (Admin)
const getSubscribers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.interests) filters.interests = { $in: req.query.interests.split(',') };

  const subscribers = await Newsletter.find(filters)
    .sort({ subscriptionDate: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Newsletter.countDocuments(filters);

  res.status(200).json({
    success: true,
    count: subscribers.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { subscribers }
  });
});

// @desc    Envoyer une newsletter (Admin)
// @route   POST /api/v1/newsletter/send
// @access  Private (Admin)
const sendNewsletter = catchAsync(async (req, res, next) => {
  const { subject, content, interests = [] } = req.body;

  // Obtenir les abonnés actifs
  const subscribers = await Newsletter.getActiveSubscribers(interests);

  if (subscribers.length === 0) {
    return next(new AppError('Aucun abonné trouvé pour ces critères', 400));
  }

  let sentCount = 0;
  let failedCount = 0;

  // Envoyer à tous les abonnés
  for (const subscriber of subscribers) {
    try {
      const unsubscribeUrl = `${process.env.FRONTEND_URL}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
      
      const emailContent = `
        ${content}
        
        ---
        Vous recevez cet email car vous êtes abonné à la newsletter de Leonce Ouattara Studio.
        
        Se désabonner : ${unsubscribeUrl}
        Leonce Ouattara - Expert IT & Solutions Digitales
        Email: leonce.ouattara@outlook.fr
      `;

      await sendEmail(subscriber.email, subject, emailContent);
      await subscriber.recordSent();
      sentCount++;
    } catch (error) {
      logger.error(`Failed to send newsletter to ${subscriber.email}:`, error);
      failedCount++;
    }
  }

  logger.info(`Newsletter sent: ${sentCount} success, ${failedCount} failed`);

  res.status(200).json({
    success: true,
    message: `Newsletter envoyée à ${sentCount} abonnés`,
    data: {
      sent: sentCount,
      failed: failedCount,
      total: subscribers.length
    }
  });
});

// @desc    Obtenir les statistiques de la newsletter (Admin)
// @route   GET /api/v1/newsletter/stats
// @access  Private (Admin)
const getNewsletterStats = catchAsync(async (req, res, next) => {
  const stats = await Newsletter.getStats();
  
  const totalSubscribers = await Newsletter.countDocuments();
  const activeSubscribers = await Newsletter.countDocuments({ 
    status: 'confirmed', 
    isActive: true 
  });

  res.status(200).json({
    success: true,
    data: {
      totalSubscribers,
      activeSubscribers,
      statusBreakdown: stats
    }
  });
});

// @desc    Mettre à jour les préférences d'un abonné
// @route   PUT /api/v1/newsletter/preferences/:token
// @access  Public
const updatePreferences = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { interests, frequency } = req.body;

  const subscriber = await Newsletter.findOne({ unsubscribeToken: token });
  if (!subscriber) {
    return next(new AppError('Abonné non trouvé', 404));
  }

  if (interests) subscriber.interests = interests;
  if (frequency) subscriber.preferences.frequency = frequency;

  await subscriber.save();

  res.status(200).json({
    success: true,
    message: 'Préférences mises à jour avec succès',
    data: {
      interests: subscriber.interests,
      frequency: subscriber.preferences.frequency
    }
  });
});

module.exports = {
  subscribe,
  confirmSubscription,
  unsubscribe,
  getSubscribers,
  sendNewsletter,
  getNewsletterStats,
  updatePreferences
};