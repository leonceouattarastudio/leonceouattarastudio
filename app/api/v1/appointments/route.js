import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from '@/lib/emailService';

// GET - Récupérer tous les rendez-vous
export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const appointments = await db.collection('appointments').find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau rendez-vous
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, message } = body;

    // Validation basique
    if (!name || !email || !service || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Vérifier si le créneau est déjà pris
    const existingAppointment = await db.collection('appointments').findOne({
      date: new Date(date).toISOString().split('T')[0],
      time: time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Ce créneau est déjà réservé' },
        { status: 409 }
      );
    }

    // Créer le nouveau rendez-vous
    const newAppointment = {
      name,
      email,
      phone: phone || null,
      service,
      date: new Date(date).toISOString().split('T')[0],
      time,
      message: message || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('appointments').insertOne(newAppointment);
    const appointmentWithId = { ...newAppointment, _id: result.insertedId };

    // Dans votre route POST
    try {
      // ... création du rendez-vous ...

      // Utiliser la nouvelle méthode processNewAppointment
      const emailResult = await sendClientConfirmationEmail(appointmentWithId);
      
      console.log('📊 Résultats:', {
        emailSent: emailResult.emailSent,
        calendarCreated: emailResult.calendarCreated,
        contactAdded: emailResult.contactAdded,
        errors: emailResult.errors
      });
      
      console.log(`🎉 Nouveau rendez-vous créé: ${email} - ${service}`);

      return NextResponse.json({
        success: true,
        appointment: newAppointment,
        emailSent: emailResult.emailSent,
        message: 'Rendez-vous créé avec succès',
        data: appointmentWithId
      }, { status: 201 });

    } catch (error) {
      console.error('Erreur:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un rendez-vous
export async function PUT(request) {
  try {
    const body = await request.json();
    const { _id, status, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('appointments').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          ...(status && { status }),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un rendez-vous
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('appointments').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
