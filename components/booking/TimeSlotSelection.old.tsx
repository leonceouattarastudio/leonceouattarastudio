'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, MapPin, Zap, Sun, Sunset, Moon, AlertCircle, Loader2 } from 'lucide-react';
import { Service, TimeSlot } from './AppointmentBooking';

interface TimeSlotSelectionProps {
  service: Service;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onPrevious: () => void;
  selectedTimeSlot: TimeSlot | null;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  service,
  onTimeSlotSelect,
  onPrevious,
  selectedTimeSlot
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [travelTime, setTravelTime] = useState<number | null>(null);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  useEffect(() => {
    // Demander la géolocalisation pour calculer le temps de trajet
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Simuler le calcul du temps de trajet (en production, utiliser Google Maps API)
          setTravelTime(25); // 25 minutes par défaut
        },
        (error) => {
          console.log('Géolocalisation non disponible:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, service]);

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/v1/appointments/available-slots?date=${dateStr}&serviceId=${service.id}`);
      const result = await response.json();
      
      if (result.success) {
        setAvailableSlots(result.data.availableSlots);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des créneaux:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isSunday = date.getDay() === 0;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isSunday,
        isToday,
        isSelected,
        isAvailable: isCurrentMonth && !isPast && !isSunday
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    if (date.getDay() === 0 || date < new Date()) return; // Bloquer dimanches et dates passées
    setSelectedDate(date);
  };

  const handleQuickSlotSelect = async (type: 'first' | 'morning' | 'afternoon' | 'evening') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/appointments/suggested-slots/${service.id}?preference=${type}`);
      const result = await response.json();
      
      if (result.success && result.data.suggestedSlots.length > 0) {
        const firstSlot = result.data.suggestedSlots[0];
        const timeSlot: TimeSlot = {
          startTime: new Date(firstSlot.timeSlots[0].startTime),
          endTime: new Date(firstSlot.timeSlots[0].endTime),
          duration: service.duration.consultationDuration,
          period: type === 'first' ? 'morning' : type as any,
          available: true
        };
        onTimeSlotSelect(timeSlot);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection rapide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSlotsByPeriod = (slots: TimeSlot[]) => {
    if (quickFilter === 'all') return slots;
    
    return slots.filter(slot => {
      const hour = slot.startTime.getHours();
      switch (quickFilter) {
        case 'morning':
          return hour >= 9 && hour < 12;
        case 'afternoon':
          return hour >= 14 && hour < 17;
        case 'evening':
          return hour >= 17 && hour < 19;
        default:
          return true;
      }
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sun className="w-4 h-4" />;
      case 'afternoon':
        return <Sunset className="w-4 h-4" />;
      case 'evening':
        return <Moon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calendarDays = getCalendarDays();
  const filteredSlots = filterSlotsByPeriod(availableSlots);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choisissez votre créneau</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Sélectionnez la date et l'heure qui vous conviennent le mieux pour votre consultation.
        </p>
      </div>

      {/* Service Summary */}
      <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ 
                background: `linear-gradient(135deg, ${service.color.primary}, ${service.color.secondary})` 
              }}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{service.name}</h3>
              <p className="text-gray-400 text-sm">
                Durée : {service.duration.consultationDuration} minutes • 
                Consultation : {service.pricing.priceType === 'hourly' ? 'Gratuite' : 'Incluse'}
              </p>
            </div>
          </div>
          
          {travelTime && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>~{travelTime} min de trajet</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#00F5FF]" />
          <span>Sélection rapide</span>
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => handleQuickSlotSelect('first')}
            disabled={isLoading}
            className="p-4 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm">Premier disponible</div>
          </button>
          <button
            onClick={() => handleQuickSlotSelect('morning')}
            disabled={isLoading}
            className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 hover:border-[#00F5FF]/50 hover:text-white transition-all disabled:opacity-50"
          >
            <Sun className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm">Matin (9h-12h)</div>
          </button>
          <button
            onClick={() => handleQuickSlotSelect('afternoon')}
            disabled={isLoading}
            className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 hover:border-[#00F5FF]/50 hover:text-white transition-all disabled:opacity-50"
          >
            <Sunset className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm">Après-midi (14h-17h)</div>
          </button>
          <button
            onClick={() => handleQuickSlotSelect('evening')}
            disabled={isLoading}
            className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-300 hover:border-[#00F5FF]/50 hover:text-white transition-all disabled:opacity-50"
          >
            <Moon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm">Soirée (17h-19h)</div>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Calendar */}
        <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
          <div className="space-y-6">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day.isAvailable && handleDateSelect(day.date)}
                  disabled={!day.isAvailable}
                  className={`
                    aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all
                    ${!day.isCurrentMonth ? 'text-gray-600' : ''}
                    ${day.isPast || day.isSunday ? 'text-gray-600 cursor-not-allowed' : ''}
                    ${day.isToday ? 'bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30' : ''}
                    ${day.isSelected ? 'bg-[#00F5FF] text-white shadow-lg' : ''}
                    ${day.isAvailable && !day.isSelected && !day.isToday ? 'hover:bg-gray-800 text-gray-300' : ''}
                  `}
                >
                  {day.day}
                  {day.isSunday && day.isCurrentMonth && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#00F5FF] rounded" />
                <span>Sélectionné</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-800 rounded" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-600 rounded" />
                <span>Indisponible</span>
              </div>
            </div>

            {/* Timezone Info */}
            <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
              <Clock className="w-4 h-4 inline mr-1" />
              Fuseau horaire : Europe/Paris (UTC+1)
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Créneaux disponibles</h3>
              {selectedDate && (
                <div className="text-sm text-gray-400">
                  {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              )}
            </div>

            {!selectedDate ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Sélectionnez une date pour voir les créneaux disponibles</p>
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-[#00F5FF] animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Chargement des créneaux...</p>
              </div>
            ) : (
              <>
                {/* Period Filter */}
                <div className="flex space-x-2">
                  {[
                    { id: 'all', label: 'Tous', icon: <Clock className="w-4 h-4" /> },
                    { id: 'morning', label: 'Matin', icon: <Sun className="w-4 h-4" /> },
                    { id: 'afternoon', label: 'Après-midi', icon: <Sunset className="w-4 h-4" /> },
                    { id: 'evening', label: 'Soirée', icon: <Moon className="w-4 h-4" /> }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setQuickFilter(filter.id as any)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        quickFilter === filter.id
                          ? 'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30'
                          : 'bg-gray-800/50 text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter.icon}
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>

                {/* Time Slots Grid */}
                {filteredSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => onTimeSlotSelect(slot)}
                        className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                          selectedTimeSlot && 
                          selectedTimeSlot.startTime.getTime() === slot.startTime.getTime()
                            ? 'bg-[#00F5FF]/20 border-[#00F5FF] text-[#00F5FF]'
                            : 'bg-gray-800/50 border-gray-600 hover:border-[#00F5FF]/50 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {getPeriodIcon(slot.period)}
                          <span className="font-medium">
                            {formatTime(slot.startTime)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {slot.duration} minutes
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Aucun créneau disponible</p>
                    <p className="text-gray-500 text-sm">
                      Essayez une autre date ou contactez-nous directement
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-300 hover:border-gray-500 hover:text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Retour aux services</span>
        </button>

        {selectedTimeSlot && (
          <button
            onClick={() => onTimeSlotSelect(selectedTimeSlot)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl text-white font-medium hover:shadow-lg transition-all"
          >
            <span>Continuer</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelection;