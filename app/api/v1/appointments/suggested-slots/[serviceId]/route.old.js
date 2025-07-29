// app/api/v1/appointments/suggested-slots/[serviceId]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const { serviceId } = params;
    const preference = searchParams.get('preference');
    const date = searchParams.get('date');

    // URL de votre API Express
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
    
    // Construire l'URL avec les paramètres
    const queryParams = new URLSearchParams();
    if (preference) queryParams.append('preference', preference);
    if (date) queryParams.append('date', date);

    const apiUrl = `${API_BASE_URL}/api/v1/appointments/suggested-slots/${serviceId}?${queryParams}`;

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
        { error: 'Failed to fetch suggested slots' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying to Express API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
