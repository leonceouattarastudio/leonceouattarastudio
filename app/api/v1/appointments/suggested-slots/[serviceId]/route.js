// app/api/v1/appointments/suggested-slots/[serviceId]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const { serviceId } = await params; // Await params avant utilisation
    const preference = searchParams.get('preference');
    const date = searchParams.get('date');

    console.log('📍 Suggested slots - Paramètres reçus:', {
      serviceId,
      preference,
      date
    });

    // Vérification des paramètres requis
    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: 'Service ID requis' },
        { status: 400 }
      );
    }

    // URL de votre API Express (si vous l'utilisez)
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Option 1: Si vous avez une API Express séparée
    if (process.env.USE_EXPRESS_API === 'true') {
      try {
        // Construire l'URL avec les paramètres
        const queryParams = new URLSearchParams();
        if (preference) queryParams.append('preference', preference);
        if (date) queryParams.append('date', date);

        const apiUrl = `${API_BASE_URL}/api/v1/appointments/suggested-slots/${serviceId}?${queryParams}`;
        console.log('🔗 Proxy vers API Express:', apiUrl);

        // Faire la requête vers votre API Express
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Transférer les headers d'authentification si nécessaire
            ...(request.headers.get('authorization') && {
              'authorization': request.headers.get('authorization')
            })
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Express API error:', errorData);
          return NextResponse.json(
            { success: false, error: 'Failed to fetch suggested slots from Express API' },
            { status: response.status }
          );
        }

        const data = await response.json();
        return NextResponse.json(data);

      } catch (expressError) {
        console.error('Error proxying to Express API:', expressError);
        return NextResponse.json(
          { success: false, error: 'Express API connection failed' },
          { status: 500 }
        );
      }
    }

    // Option 2: Logique directe dans Next.js (recommandé)
    // Générer des créneaux suggérés basés sur les préférences
    const suggestedSlots = await generateSuggestedSlots(serviceId, preference, date);

    return NextResponse.json({
      success: true,
      data: {
        serviceId,
        preference,
        date,
        suggestedSlots
      }
    });

  } catch (error) {
    console.error('Error in suggested-slots API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Générer des créneaux suggérés basés sur les préférences
 */
async function generateSuggestedSlots(serviceId, preference, date) {
  try {
    // Définir les créneaux par défaut selon les préférences
    const timeSlots = {
      morning: [
        { time: '09:00', label: '9h00 - 10h00' },
        { time: '10:00', label: '10h00 - 11h00' },
        { time: '11:00', label: '11h00 - 12h00' }
      ],
      afternoon: [
        { time: '14:00', label: '14h00 - 15h00' },
        { time: '15:00', label: '15h00 - 16h00' },
        { time: '16:00', label: '16h00 - 17h00' }
      ],
      evening: [
        { time: '18:00', label: '18h00 - 19h00' },
        { time: '19:00', label: '19h00 - 20h00' },
        { time: '20:00', label: '20h00 - 21h00' }
      ]
    };

    // Sélectionner les créneaux selon la préférence
    let selectedSlots = [];
    
    if (preference && timeSlots[preference]) {
      selectedSlots = timeSlots[preference];
    } else {
      // Si pas de préférence, proposer tous les créneaux
      selectedSlots = [
        ...timeSlots.morning,
        ...timeSlots.afternoon,
        ...timeSlots.evening
      ];
    }

    // Si une date spécifique est fournie, vérifier la disponibilité
    if (date) {
      // Ici vous pourriez vérifier en base de données les créneaux déjà pris
      // Pour l'instant, on simule que tous les créneaux sont disponibles
      console.log(`📅 Vérification disponibilité pour le ${date}`);
      
      // TODO: Implémenter la vérification en base de données
      // const unavailableSlots = await checkUnavailableSlots(date);
      // selectedSlots = selectedSlots.filter(slot => !unavailableSlots.includes(slot.time));
    }

    // Formater les créneaux pour le frontend
    const formattedSlots = selectedSlots.map((slot, index) => ({
      id: `${serviceId}-${date || 'any'}-${slot.time}`,
      startTime: slot.time,
      endTime: calculateEndTime(slot.time, 60), // 60 minutes par défaut
      duration: 60,
      label: slot.label,
      available: true,
      period: determinePeriod(slot.time),
      price: null // À déterminer selon le service
    }));

    console.log(`✅ ${formattedSlots.length} créneaux générés pour ${preference || 'toute la journée'}`);
    
    return formattedSlots;

  } catch (error) {
    console.error('Erreur génération créneaux:', error);
    throw error;
  }
}

/**
 * Calculer l'heure de fin basée sur l'heure de début et la durée
 */
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  
  return endDate.toTimeString().slice(0, 5); // Format HH:mm
}

/**
 * Déterminer la période de la journée
 */
function determinePeriod(time) {
  const hour = parseInt(time.split(':')[0]);
  
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Vérifier les créneaux non disponibles (à implémenter)
 */
async function checkUnavailableSlots(date) {
  // TODO: Implémenter la vérification en base de données
  // const { db } = await connectToDatabase();
  // const appointments = await db.collection('appointments')
  //   .find({ date: date, status: { $ne: 'cancelled' } })
  //   .toArray();
  // return appointments.map(apt => apt.time);
  
  // Pour l'instant, retourner un tableau vide (tous disponibles)
  return [];
}