const Contact = require('../models/Contact');
const { catchAsync, AppError } = require('../middleware/error/errorHandler');
const logger = require('../config/logger');

// Fonction utilitaire pour envoyer des emails (simulation)
const sendEmail = async (to, subject, message) => {
  // En production, utilisez un service comme SendGrid, Mailgun, etc.
  logger.info(`Email sent to ${to}: ${subject}`);
  return true;
};

// @desc    Créer un nouveau message de contact
// @route   POST /api/v1/contact
// @access  Public
const createContact = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    subject,
    projectType,
    budget,
    timeline,
    message,
    source,
    gdprConsent
  } = req.body;

  // Vérifier le consentement RGPD
  if (!gdprConsent) {
    return next(new AppError('Le consentement RGPD est requis', 400));
  }

  // Créer le contact avec métadonnées
  const contactData = {
    firstName,
    lastName,
    email,
    phone,
    company: company ? { name: company } : undefined,
    subject,
    projectType,
    budget: budget ? { range: budget } : undefined,
    timeline,
    message,
    source: source || 'website',
    gdprConsent,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referer')
  };

  const contact = await Contact.create(contactData);

  // Envoyer notification email à l'admin
  try {
    await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@leonceouattara.com',
      `Nouveau message de contact - ${subject}`,
      `
        Nouveau message de contact reçu:
        
        Nom: ${firstName} ${lastName}
        Email: ${email}
        Téléphone: ${phone || 'Non renseigné'}
        Entreprise: ${company || 'Non renseignée'}
        Sujet: ${subject}
        Type de projet: ${projectType || 'Non spécifié'}
        Budget: ${budget || 'Non spécifié'}
        Timeline: ${timeline || 'Non spécifiée'}
        
        Message:
        ${message}
        
        ---
        IP: ${req.ip}
        User Agent: ${req.get('User-Agent')}
        Référent: ${req.get('Referer') || 'Direct'}
      `
    );

    // Envoyer email de confirmation au client
    await sendEmail(
      email,
      'Confirmation de réception - Leonce Ouattara Studio',
      `
        Bonjour ${firstName},
        
        Merci pour votre message. J'ai bien reçu votre demande concernant "${subject}".
        
        Je vous répondrai dans les plus brefs délais, généralement sous 24h.
        
        Cordialement,
        Leonce Ouattara
        Expert IT & Solutions Digitales
        
        ---
        Ce message est envoyé automatiquement, merci de ne pas y répondre.
      `
    );
  } catch (emailError) {
    logger.error('Email notification failed:', emailError);
    // Ne pas faire échouer la création du contact si l'email échoue
  }

  logger.info(`New contact message from: ${email}`);

  res.status(201).json({
    success: true,
    message: 'Message envoyé avec succès. Vous recevrez une réponse sous 24h.',
    data: {
      contact: {
        id: contact._id,
        status: contact.status,
        createdAt: contact.createdAt
      }
    }
  });
});

// @desc    Obtenir tous les messages de contact (Admin)
// @route   GET /api/v1/contact
// @access  Private (Admin)
const getContacts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Filtres
  const filters = { isSpam: false };
  if (req.query.status) filters.status = req.query.status;
  if (req.query.subject) filters.subject = req.query.subject;
  if (req.query.priority) filters.priority = req.query.priority;

  // Recherche
  if (req.query.search) {
    filters.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
      { message: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const contacts = await Contact.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'firstName lastName');

  const total = await Contact.countDocuments(filters);

  res.status(200).json({
    success: true,
    count: contacts.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: { contacts }
  });
});

// @desc    Obtenir un message de contact par ID (Admin)
// @route   GET /api/v1/contact/:id
// @access  Private (Admin)
const getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName')
    .populate('responses.sentBy', 'firstName lastName');

  if (!contact) {
    return next(new AppError('Message de contact non trouvé', 404));
  }

  // Marquer comme lu
  await contact.markAsRead();

  res.status(200).json({
    success: true,
    data: { contact }
  });
});

// @desc    Répondre à un message de contact (Admin)
// @route   POST /api/v1/contact/:id/reply
// @access  Private (Admin)
const replyToContact = catchAsync(async (req, res, next) => {
  const { message, method = 'email' } = req.body;

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError('Message de contact non trouvé', 404));
  }

  // Ajouter la réponse
  await contact.addResponse({
    message,
    sentBy: req.user.id,
    method
  });

  // Envoyer l'email de réponse
  if (method === 'email') {
    try {
      await sendEmail(
        contact.email,
        `Réponse à votre message - ${contact.subject}`,
        `
          Bonjour ${contact.firstName},
          
          ${message}
          
          Cordialement,
          Leonce Ouattara
          Expert IT & Solutions Digitales
          
          Email: leonce.ouattara@outlook.fr
          Téléphone: +225 05 45 13 07 39
        `
      );
    } catch (emailError) {
      logger.error('Reply email failed:', emailError);
      return next(new AppError('Erreur lors de l\'envoi de l\'email', 500));
    }
  }

  logger.info(`Reply sent to contact ${contact.email} by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Réponse envoyée avec succès',
    data: { contact }
  });
});

// @desc    Mettre à jour le statut d'un contact (Admin)
// @route   PUT /api/v1/contact/:id/status
// @access  Private (Admin)
const updateContactStatus = catchAsync(async (req, res, next) => {
  const { status, priority, assignedTo, notes } = req.body;

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError('Message de contact non trouvé', 404));
  }

  // Mettre à jour les champs
  if (status) contact.status = status;
  if (priority) contact.priority = priority;
  if (assignedTo) contact.assignedTo = assignedTo;

  // Ajouter une note si fournie
  if (notes) {
    contact.notes.push({
      content: notes,
      addedBy: req.user.id
    });
  }

  await contact.save();

  logger.info(`Contact ${contact._id} updated by ${req.user.email}`);

  res.status(200).json({
    success: true,
    message: 'Contact mis à jour avec succès',
    data: { contact }
  });
});

// @desc    Supprimer un message de contact (Admin)
// @route   DELETE /api/v1/contact/:id
// @access  Private (Admin)
const deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError('Message de contact non trouvé', 404));
  }

  await contact.deleteOne();

  logger.info(`Contact ${req.params.id} deleted by ${req.user.email}`);

  res.status(204).json({
    success: true,
    message: 'Message supprimé avec succès'
  });
});

// @desc    Obtenir les statistiques des contacts (Admin)
// @route   GET /api/v1/contact/stats
// @access  Private (Admin)
const getContactStats = catchAsync(async (req, res, next) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalContacts = await Contact.countDocuments();
  const unreadContacts = await Contact.countDocuments({ status: 'new' });
  const spamContacts = await Contact.countDocuments({ isSpam: true });

  res.status(200).json({
    success: true,
    data: {
      totalContacts,
      unreadContacts,
      spamContacts,
      statusBreakdown: stats
    }
  });
});

module.exports = {
  createContact,
  getContacts,
  getContact,
  replyToContact,
  updateContactStatus,
  deleteContact,
  getContactStats
};