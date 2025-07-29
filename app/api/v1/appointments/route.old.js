import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Fonction utilitaire pour envoyer des emails (simulation)
const sendEmail = async (to, subject, message) => {
  console.log(`Email sent to ${to}: ${subject}`);
  // Ici vous pourrez intégrer votre service d'email (Nodemailer, SendGrid, etc.)
  return true;
};

// Fonction pour vérifier la disponibilité d'un créneau
const isSlotAvailable = async (db, startTime, endTime, excludeId = null) => {
  const query = {
    $or: [
      {
        'appointment.startTime': { $lt: new Date(endTime) },
        'appointment.endTime': { $gt: new Date(startTime) }
      }
    ],
    status: { $in: ['scheduled', 'confirmed'] }
  };

  if (excludeId) {
    query._id = { $ne: new ObjectId(excludeId) };
  }

  const conflictingAppointment = await db.collection('appointments').findOne(query);
  return !conflictingAppointment;
};

// Fonction pour générer un token unique
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received appointment data:', body);

    const { db } = await connectToDatabase();
    
    // Validation des données essentielles
    const { serviceId, client, appointment, project, consents } = body;
    
    if (!serviceId || !client || !appointment || !consents?.gdpr?.accepted) {
      return NextResponse.json(
        { error: 'Données manquantes ou consentement RGPD requis' },
        { status: 400 }
      );
    }

    // Vérifier que le service existe
    const service = await db.collection('services').findOne({
      _id: new ObjectId(serviceId),
      isActive: true
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé ou indisponible' },
        { status: 404 }
      );
    }

    // Calculer la durée et l'heure de fin
    const startTime = new Date(appointment.startTime);
    const duration = service.duration?.consultationDuration || 60;
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Vérifier la disponibilité du créneau
    const isAvailable = await isSlotAvailable(db, startTime, endTime);

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est pas disponible' },
        { status: 400 }
      );
    }

    // Générer les tokens de confirmation et d'annulation
    const confirmationToken = generateToken();
    const cancellationToken = generateToken();

    // Préparer les données du rendez-vous
    const appointmentData = {
      service: new ObjectId(serviceId),
      serviceSnapshot: {
        name: service.name,
        price: service.pricing?.basePrice || 0,
        currency: service.pricing?.currency || 'EUR',
        category: service.category
      },
      client: {
        ...client,
        timezone: client.timezone || 'Europe/Paris',
        isReturningClient: false // À calculer si nécessaire
      },
      appointment: {
        ...appointment,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        location: {
          type: appointment.location?.type || 'online',
          details: appointment.location?.details,
          meetingLink: appointment.location?.type === 'online' ? 
            `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}` : 
            undefined,
          address: appointment.location?.address
        }
      },
      project: project || {},
      consents: {
        gdpr: {
          accepted: consents.gdpr.accepted,
          acceptedAt: new Date(),
          ipAddress: request.ip || 'unknown',
          userAgent: request.headers.get('User-Agent') || 'unknown'
        },
        marketing: consents.marketing || { accepted: false },
        dataRetention: consents.dataRetention || { accepted: false }
      },
      analytics: {
        bookingSource: request.headers.get('Referer') || 'direct',
        deviceType: request.headers.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop',
        browserInfo: request.headers.get('User-Agent'),
        referrerUrl: request.headers.get('Referer'),
        ...body.analytics
      },
      status: 'scheduled',
      confirmationToken,
      cancellationToken,
      notifications: {
        confirmation: { sent: false },
        reminder24h: { sent: false },
        reminder2h: { sent: false }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insérer le rendez-vous
    const result = await db.collection('appointments').insertOne(appointmentData);

    // Incrémenter le compteur de réservations du service
    await db.collection('services').updateOne(
      { _id: new ObjectId(serviceId) },
      { 
        $inc: { 'stats.totalBookings': 1 },
        $set: { updatedAt: new Date() }
      }
    );

    // Envoyer email de confirmation au client
    try {
      const appointmentDate = startTime.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const appointmentTime = startTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      const confirmationMessage = `
        Bonjour ${client.firstName},
        
        Votre rendez-vous a été confirmé avec succès !
        
        🎯 Service : ${service.name}
        📅 Date : ${appointmentDate}
        🕐 Heure : ${appointmentTime}
        ⏱️ Durée : ${duration} minutes
        📍 Type : ${appointment.location?.type === 'online' ? 'Visioconférence' : 'Présentiel'}
        ${appointmentData.appointment.location.meetingLink ? `🔗 Lien : ${appointmentData.appointment.location.meetingLink}` : ''}
        
        Sujet : ${appointment.title}
        ${appointment.description ? `Description : ${appointment.description}` : ''}
        
        Je vous enverrai un rappel 24h avant notre rendez-vous.
        
        Si vous devez annuler ou reporter, utilisez ce lien :
        ${process.env.NEXT_PUBLIC_BASE_URL}/appointments/manage/${cancellationToken}
        
        À bientôt,
        Leonce Ouattara
        Expert IT & Solutions Digitales
        
        Email: leonce.ouattara@outlook.fr
        Téléphone: +225 05 45 13 07 39
      `;

      await sendEmail(
        client.email,
        'Confirmation de rendez-vous - Leonce Ouattara Studio',
        confirmationMessage
      );

      // Marquer la confirmation comme envoyée
      await db.collection('appointments').updateOne(
        { _id: result.insertedId },
        { 
          $set: { 
            'notifications.confirmation.sent': true,
            'notifications.confirmation.sentAt': new Date()
          }
        }
      );

      // Envoyer notification à l'admin
      const adminMessage = `
        Nouveau rendez-vous programmé :
        
        Service : ${service.name} (${service.category})
        Prix : ${service.pricing?.basePrice || 0} ${service.pricing?.currency || 'EUR'}
        
        Client : ${client.firstName} ${client.lastName}
        Email : ${client.email}
        Téléphone : ${client.phone || 'Non renseigné'}
        Entreprise : ${client.company?.name || 'Non renseignée'}
        
        Date : ${appointmentDate} à ${appointmentTime}
        Durée : ${duration} minutes
        Type : ${appointment.type}
        
        Projet :
        Type : ${project?.type || 'Non spécifié'}
        Budget : ${project?.budget?.range || 'Non spécifié'}
        Timeline : ${project?.timeline || 'Non spécifiée'}
        
        Description : ${project?.description || 'Aucune description'}
        
        ID du rendez-vous : ${result.insertedId}
      `;

      await sendEmail(
        process.env.ADMIN_EMAIL || 'admin@leonceouattara.com',
        `Nouveau RDV - ${service.name}`,
        adminMessage
      );

    } catch (emailError) {
      console.error('Appointment confirmation email failed:', emailError);
    }

    console.log(`New appointment created: ${client.email} - ${service.name}`);

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous créé avec succès. Un email de confirmation vous a été envoyé.',
      data: {
        appointment: {
          id: result.insertedId,
          service: service.name,
          startTime: appointmentData.appointment.startTime,
          duration: appointmentData.appointment.duration,
          status: appointmentData.status,
          confirmationToken: confirmationToken
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erreur lors de la création du rendez-vous',
        details: error.message
      },
      { status: 500 }
    );
  }
}
