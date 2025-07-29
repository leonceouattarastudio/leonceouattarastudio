'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, User, Building, Globe, ChevronLeft, ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import ServiceSelection from './ServiceSelection';
import TimeSlotSelection from './TimeSlotSelection';
import ClientInformation from './ClientInformation';
import BookingConfirmation from './BookingConfirmation';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  features: string[];
  technologies: string[];
  deliverables: string[];
  pricing: {
    basePrice: number;
    currency: string;
    priceType: string;
    customPricing: boolean;
  };
  duration: {
    estimatedHours: number;
    consultationDuration: number;
    flexibleDuration: boolean;
  };
  requirements: {
    clientInfo: Array<{
      field: string;
      required: boolean;
      label: string;
      placeholder: string;
      helpText: string;
    }>;
    documents: string[];
    preparationSteps: string[];
  };
  icon: string;
  color: {
    primary: string;
    secondary: string;
  };
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  duration: number;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface ClientData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  company?: string;
  additionalInfo: Record<string, any>;
  preferences: {
    communicationMethod: string;
    language: string;
    timezone: string;
  };
  consents: {
    gdpr: boolean;
    marketing: boolean;
    dataRetention: boolean;
  };
}

export interface BookingData {
  service: Service | null;
  timeSlot: TimeSlot | null;
  client: ClientData;
  project?: {
    type: string;
    budget: string;
    timeline: string;
    description: string;
  };
}

const AppointmentBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    timeSlot: null,
    client: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '+33',
      additionalInfo: {},
      preferences: {
        communicationMethod: 'email',
        language: 'fr',
        timezone: 'Europe/Paris'
      },
      consents: {
        gdpr: false,
        marketing: false,
        dataRetention: false
      }
    }
  });
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Charger les données sauvegardées du client récurrent
  useEffect(() => {
    const savedClientData = localStorage.getItem('leonce-studio-client-data');
    if (savedClientData) {
      try {
        const parsedData = JSON.parse(savedClientData);
        setBookingData(prev => ({
          ...prev,
          client: { ...prev.client, ...parsedData }
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des données client:', error);
      }
    }
  }, []);

  const handleServiceSelect = (service: Service) => {
    setBookingData(prev => ({ ...prev, service }));
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setBookingData(prev => ({ ...prev, timeSlot }));
    setCurrentStep(3);
  };

  const handleClientDataSubmit = async (clientData: ClientData, projectData?: any) => {
    setIsLoading(true);
    
    try {
      // Sauvegarder les données client si consentement
      if (clientData.consents.dataRetention) {
        const dataToSave = {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
          countryCode: clientData.countryCode,
          company: clientData.company,
          preferences: clientData.preferences
        };
        localStorage.setItem('leonce-studio-client-data', JSON.stringify(dataToSave));
      }
  
      // Préparer les données selon le format attendu par l'API
      const appointmentData = {
        // Champs obligatoires attendus par l'API
        name: `${clientData.firstName} ${clientData.lastName}`,
        email: clientData.email,
        phone: clientData.phone,
        service: bookingData.service?.name, // Nom du service au lieu de l'ID
        date: bookingData.timeSlot?.startTime.toISOString().split('T')[0], // Format YYYY-MM-DD
        time: bookingData.timeSlot?.startTime.toTimeString().slice(0, 5), // Format HH:mm
        message: projectData?.description || '', // Message optionnel
        
        // Données supplémentaires (optionnelles, pour extension future)
        serviceId: bookingData.service?.id,
        clientData: clientData,
        projectData: projectData
      };
  
      console.log('📤 Données envoyées à l\'API:', appointmentData);
  
      // Appel API pour créer le rendez-vous
      const response = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });
  
      const result = await response.json();
      console.log('📥 Réponse de l\'API:', result);
  
      if (result.success) {
        setBookingResult(result.data);
        setCurrentStep(4);
      } else {
        throw new Error(result.error || 'Erreur lors de la création du rendez-vous');
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert(`Une erreur est survenue lors de la réservation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData(prev => ({
      ...prev,
      service: null,
      timeSlot: null
    }));
    setBookingResult(null);
  };

  const steps = [
    { number: 1, title: 'Service', description: 'Choisissez votre prestation' },
    { number: 2, title: 'Créneau', description: 'Sélectionnez votre horaire' },
    { number: 3, title: 'Informations', description: 'Vos coordonnées' },
    { number: 4, title: 'Confirmation', description: 'Récapitulatif' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Prendre <span className="gradient-text">Rendez-vous</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Réservez votre consultation en quelques clics. Processus simple et sécurisé.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 border border-gray-600'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`font-semibold ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD]'
                      : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && (
            <ServiceSelection
              onServiceSelect={handleServiceSelect}
              selectedService={bookingData.service}
            />
          )}

          {currentStep === 2 && bookingData.service && (
            <TimeSlotSelection
              service={bookingData.service}
              onTimeSlotSelect={handleTimeSlotSelect}
              onPrevious={handlePreviousStep}
              selectedTimeSlot={bookingData.timeSlot}
            />
          )}

          {currentStep === 3 && bookingData.service && bookingData.timeSlot && (
            <ClientInformation
              service={bookingData.service}
              timeSlot={bookingData.timeSlot}
              onSubmit={handleClientDataSubmit}
              onPrevious={handlePreviousStep}
              initialData={bookingData.client}
              isLoading={isLoading}
            />
          )}

          {currentStep === 4 && bookingResult && (
            <BookingConfirmation
              bookingData={bookingData}
              bookingResult={bookingResult}
              onNewBooking={resetBooking}
            />
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#00F5FF] animate-spin mx-auto mb-4" />
              <p className="text-white text-lg font-medium">Création de votre rendez-vous...</p>
              <p className="text-gray-400 mt-2">Veuillez patienter quelques instants</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;