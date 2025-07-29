import { NextRequest, NextResponse } from 'next/server';

// Configuration Next.js pour forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Configuration de votre API existante
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'; // Port de votre API

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de requête de la requête Next.js
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // Construire l'URL vers votre API existante
    const apiUrl = `${API_BASE_URL}/api/v1/services${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔄 Proxy vers:', apiUrl);
    
    // Faire l'appel vers votre API existante
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Ajouter d'autres headers si nécessaire (auth, etc.)
      },
    });

    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Récupérer les données JSON
    const data = await response.json();
    
    console.log('✅ Données reçues de l\'API:', data);
    
    // Retourner les données vers le frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Erreur lors du proxy vers l\'API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur de connexion à l\'API',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Erreur POST vers l\'API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/services${queryString ? `?${queryString}` : ''}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Erreur PUT vers l\'API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/services${queryString ? `?${queryString}` : ''}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Erreur DELETE vers l\'API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
