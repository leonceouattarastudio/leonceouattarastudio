'use client';

import React from 'react';
import { Check, Calendar, Clock, User, Mail, Phone, MapPin, Download, Share2, ArrowRight, Star, Gift } from 'lucide-react';
import { BookingData } from './AppointmentBooking';

interface BookingConfirmationProps {
  bookingData: BookingData;
  bookingResult: any;
  onNewBooking: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingData,
  bookingResult,
  onNewBooking
}) => {
  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Obtenir l'ID de manière sécurisée
  const getAppointmentId = () => {
    if (bookingResult?._id) {
      return bookingResult._id;
    }
    if (bookingResult?.appointment?.id) {
      return bookingResult.appointment.id;
    }
    if (bookingResult?.data?._id) {
      return bookingResult.data._id;
    }
    // Générer un ID temporaire si aucun n'est trouvé
    return Date.now().toString(36).toUpperCase();
  };

  const appointmentId = getAppointmentId();

  const handleDownloadICS = () => {
    // Générer et télécharger le fichier ICS
    const startTime = bookingData.timeSlot!.startTime;
    const endTime = bookingData.timeSlot!.endTime;
    
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Leonce Ouattara Studio//Appointment//FR
BEGIN:VEVENT
UID:${appointmentId}@leonceouattara.com
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:Consultation - ${bookingData.service!.name}
DESCRIPTION:Rendez-vous avec Leonce Ouattara\\nService: ${bookingData.service!.name}\\nDurée: ${bookingData.timeSlot!.duration} minutes
LOCATION:Visioconférence
ORGANIZER:CN=Leonce Ouattara:MAILTO:leonce-ouattara-studio@outlook.com
ATTENDEE:CN=${bookingData.client.firstName} ${bookingData.client.lastName}:MAILTO:${bookingData.client.email}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT2H
ACTION:EMAIL
DESCRIPTION:Rappel: Rendez-vous dans 2 heures
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rdv-leonce-ouattara-${formatICSDate(startTime)}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rendez-vous confirmé - Leonce Ouattara Studio',
        text: `J'ai réservé une consultation "${bookingData.service!.name}" avec Leonce Ouattara`,
        url: window.location.origin
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      const text = `J'ai réservé une consultation "${bookingData.service!.name}" avec Leonce Ouattara - ${window.location.origin}`;
      navigator.clipboard.writeText(text);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const dateTime = formatDateTime(bookingData.timeSlot!.startTime);

  return (
    <div className="space-y-8">
      
      {/* Success Header */}
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-4 text-green-400">
          Rendez-vous confirmé !
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Votre consultation a été réservée avec succès. Un email de confirmation vous a été envoyé.
        </p>
      </div>

      {/* Booking Details */}
      <div className="glass-card p-8 rounded-2xl border border-green-500/30">
        <h3 className="text-2xl font-bold mb-6 text-center">Détails de votre rendez-vous</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Service Info */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-[#00F5FF]" />
                <span>Service réservé</span>
              </h4>
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <div className="font-bold text-[#00F5FF] text-lg">{bookingData.service!.name}</div>
                <div className="text-gray-300 text-sm mt-1">{bookingData.service!.shortDescription}</div>
                <div className="text-gray-400 text-sm mt-2">
                  Consultation : {bookingData.service!.duration.consultationDuration} minutes
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#9D4EDD]" />
                <span>Date et heure</span>
              </h4>
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <div className="font-bold text-[#9D4EDD] text-lg">{dateTime.date}</div>
                <div className="text-gray-300 flex items-center space-x-2 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{dateTime.time}</span>
                  <span className="text-gray-500">•</span>
                  <span>{bookingData.timeSlot!.duration} min</span>
                </div>
                <div className="text-gray-400 text-sm mt-2 flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Visioconférence (lien envoyé par email)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-[#00BFFF]" />
                <span>Vos informations</span>
              </h4>
              <div className="bg-gray-800/30 p-4 rounded-xl space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{bookingData.client.firstName} {bookingData.client.lastName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{bookingData.client.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{bookingData.client.countryCode} {bookingData.client.phone}</span>
                </div>
                {bookingData.client.company && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{bookingData.client.company}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2">
                <Gift className="w-5 h-5 text-[#DA70D6]" />
                <span>Référence</span>
              </h4>
              <div className="bg-gray-800/30 p-4 rounded-xl">
                <div className="font-mono text-[#DA70D6] text-lg">
                  #{appointmentId.slice(-8).toUpperCase()}
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  Conservez cette référence pour toute correspondance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="glass-card p-8 rounded-2xl border border-gray-700/50">
        <h3 className="text-xl font-bold mb-6">Prochaines étapes</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-[#00F5FF] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div>
              <div className="font-semibold">Email de confirmation envoyé</div>
              <div className="text-gray-400 text-sm">
                Vérifiez votre boîte mail (et vos spams) pour l'email de confirmation avec le lien de visioconférence.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-[#9D4EDD] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div>
              <div className="font-semibold">Rappels automatiques</div>
              <div className="text-gray-400 text-sm">
                Vous recevrez des rappels 2 jours et 2 heures avant votre rendez-vous.
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-[#00BFFF] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <div>
              <div className="font-semibold">Préparation du rendez-vous</div>
              <div className="text-gray-400 text-sm">
                Préparez vos questions et documents relatifs à votre projet pour optimiser notre échange.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={handleDownloadICS}
          className="flex items-center justify-center space-x-2 p-4 bg-gray-800 border border-gray-600 rounded-xl text-gray-300 hover:border-gray-500 hover:text-white transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Télécharger .ics</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 p-4 bg-gray-800 border border-gray-600 rounded-xl text-gray-300 hover:border-gray-500 hover:text-white transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>Partager</span>
        </button>

        <button
          onClick={onNewBooking}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl text-white font-medium hover:shadow-lg transition-all"
        >
          <span>Nouveau RDV</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Contact Info */}
      <div className="text-center glass-card p-6 rounded-2xl border border-gray-700/50">
        <h4 className="font-semibold mb-4">Besoin d'aide ou de modifications ?</h4>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a 
            href="mailto:leonce-ouattara-studio@outlook.com" 
            className="flex items-center space-x-2 text-[#00F5FF] hover:underline"
          >
            <Mail className="w-4 h-4" />
            <span>leonce-ouattara-studio@outlook.com</span>
          </a>
          <a 
            href="tel:+22505451307390" 
            className="flex items-center space-x-2 text-[#9D4EDD] hover:underline"
          >
            <Phone className="w-4 h-4" />
            <span>+225 05 45 13 07 39</span>
          </a>
        </div>
        <p className="text-gray-500 text-xs mt-4">
          Vous pouvez annuler ou reporter votre rendez-vous jusqu'à 24h avant la date prévue.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;