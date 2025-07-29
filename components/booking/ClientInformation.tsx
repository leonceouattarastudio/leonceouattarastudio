'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Globe, ChevronLeft, ChevronRight, Shield, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { Service, TimeSlot, ClientData } from './AppointmentBooking';
import { FormInput, FormTextarea, FormSelect, FormCheckbox } from '@/components/forms';

interface ClientInformationProps {
  service: Service;
  timeSlot: TimeSlot;
  onSubmit: (clientData: ClientData, projectData?: any) => void;
  onPrevious: () => void;
  initialData: ClientData;
  isLoading: boolean;
}

const ClientInformation: React.FC<ClientInformationProps> = ({
  service,
  timeSlot,
  onSubmit,
  onPrevious,
  initialData,
  isLoading
}) => {
  const [clientData, setClientData] = useState<ClientData>(initialData);
  const [projectData, setProjectData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryCodes = [
    { value: '+33', label: '🇫🇷 France (+33)' },
    { value: '+32', label: '🇧🇪 Belgique (+32)' },
    { value: '+41', label: '🇨🇭 Suisse (+41)' },
    { value: '+1', label: '🇺🇸 États-Unis (+1)' },
    { value: '+1', label: '🇨🇦 Canada (+1)' },
    { value: '+44', label: '🇬🇧 Royaume-Uni (+44)' },
    { value: '+49', label: '🇩🇪 Allemagne (+49)' },
    { value: '+39', label: '🇮🇹 Italie (+39)' },
    { value: '+34', label: '🇪🇸 Espagne (+34)' },
    { value: '+31', label: '🇳🇱 Pays-Bas (+31)' },
    { value: '+225', label: '🇨🇮 Côte d\'Ivoire (+225)' },
    { value: '+212', label: '🇲🇦 Maroc (+212)' },
    { value: '+216', label: '🇹🇳 Tunisie (+216)' },
    { value: '+213', label: '🇩🇿 Algérie (+213)' }
  ];

  const communicationMethods = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Téléphone' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const projectTypes = [
    { value: 'website', label: 'Site web vitrine' },
    { value: 'webapp', label: 'Application web' },
    { value: 'mobile', label: 'Application mobile' },
    { value: 'ecommerce', label: 'Site e-commerce' },
    { value: 'api', label: 'API / Backend' },
    { value: 'consulting', label: 'Conseil / Audit' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'other', label: 'Autre' }
  ];

  const budgetRanges = [
    { value: '1000-5000', label: '1 000€ - 5 000€' },
    { value: '5000-10000', label: '5 000€ - 10 000€' },
    { value: '10000-20000', label: '10 000€ - 20 000€' },
    { value: '20000-50000', label: '20 000€ - 50 000€' },
    { value: '50000+', label: 'Plus de 50 000€' },
    { value: 'to-discuss', label: 'À discuter' }
  ];

  const timelines = [
    { value: 'asap', label: 'Dès que possible' },
    { value: '1-month', label: 'Dans le mois' },
    { value: '2-3-months', label: '2-3 mois' },
    { value: '3-6-months', label: '3-6 mois' },
    { value: '6-months+', label: 'Plus de 6 mois' },
    { value: 'flexible', label: 'Flexible' }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('project.')) {
      const projectField = field.replace('project.', '');
      setProjectData((prev: any) => ({ ...prev, [projectField]: value }));
    } else if (field.startsWith('client.')) {
      const clientField = field.replace('client.', '');
      setClientData(prev => ({ ...prev, [clientField]: value }));
    } else if (field.startsWith('additionalInfo.')) {
      const infoField = field.replace('additionalInfo.', '');
      setClientData(prev => ({
        ...prev,
        additionalInfo: { ...prev.additionalInfo, [infoField]: value }
      }));
    } else if (field.startsWith('preferences.')) {
      const prefField = field.replace('preferences.', '');
      setClientData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [prefField]: value }
      }));
    } else if (field.startsWith('consents.')) {
      const consentField = field.replace('consents.', '');
      setClientData(prev => ({
        ...prev,
        consents: { ...prev.consents, [consentField]: value }
      }));
    } else {
      setClientData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation des champs obligatoires
    if (!clientData.firstName.trim()) {
      newErrors['firstName'] = 'Le prénom est requis';
    }
    if (!clientData.lastName.trim()) {
      newErrors['lastName'] = 'Le nom est requis';
    }
    if (!clientData.email.trim()) {
      newErrors['email'] = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      newErrors['email'] = 'Format d\'email invalide';
    }
    if (!clientData.phone.trim()) {
      newErrors['phone'] = 'Le téléphone est requis';
    }
    if (!clientData.consents.gdpr) {
      newErrors['consents.gdpr'] = 'Le consentement RGPD est obligatoire';
    }

    // Validation des champs conditionnels selon le service
    service.requirements.clientInfo.forEach(requirement => {
      if (requirement.required) {
        const value = requirement.field === 'projectDescription' 
          ? projectData.description 
          : clientData.additionalInfo[requirement.field];
        
        if (!value || value.toString().trim() === '') {
          newErrors[`additionalInfo.${requirement.field}`] = `${requirement.label} est requis`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(clientData, projectData);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Vos informations</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Complétez vos coordonnées pour finaliser la réservation de votre consultation.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
        <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-500" />
          <span>Récapitulatif de votre réservation</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-400 mb-1">Service sélectionné</div>
            <div className="font-semibold text-[#00F5FF]">{service.name}</div>
            <div className="text-sm text-gray-300">
              {service.pricing.priceType === 'hourly' 
                ? `${service.pricing.basePrice}€/h` 
                : `À partir de ${service.pricing.basePrice.toLocaleString('fr-FR')}€`}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Date et heure</div>
            <div className="font-semibold text-[#9D4EDD]">
              {formatDateTime(timeSlot.startTime)}
            </div>
            <div className="text-sm text-gray-300">
              Durée : {timeSlot.duration} minutes
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Informations personnelles */}
        <div className="glass-card p-8 rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <User className="w-6 h-6 text-[#00F5FF]" />
            <span>Informations personnelles</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Prénom"
              placeholder="Votre prénom"
              value={clientData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              icon={<User className="w-5 h-5" />}
              variant="glass"
              required
            />
            
            <FormInput
              label="Nom"
              placeholder="Votre nom"
              value={clientData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              icon={<User className="w-5 h-5" />}
              variant="glass"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <FormInput
              label="Email"
              type="email"
              placeholder="votre@email.com"
              value={clientData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              variant="glass"
              required
            />
            
            <div className="grid grid-cols-3 gap-2">
              <FormSelect
                label="Code pays"
                options={countryCodes}
                value={clientData.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                variant="glass"
              />
              <div className="col-span-2">
                <FormInput
                  label="Téléphone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={clientData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  icon={<Phone className="w-5 h-5" />}
                  variant="glass"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <FormInput
              label="Entreprise (optionnel)"
              placeholder="Nom de votre entreprise"
              value={clientData.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              icon={<Building className="w-5 h-5" />}
              variant="glass"
            />
          </div>
        </div>

        {/* Informations projet (conditionnelles selon le service) */}
        {service.requirements.clientInfo.length > 0 && (
          <div className="glass-card p-8 rounded-2xl border border-gray-700/50">
            <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Globe className="w-6 h-6 text-[#9D4EDD]" />
              <span>Détails du projet</span>
            </h3>
            
            <div className="space-y-6">
              {service.requirements.clientInfo.map((requirement, index) => {
                const fieldKey = `additionalInfo.${requirement.field}`;
                const value = requirement.field === 'projectDescription' 
                  ? projectData.description || ''
                  : clientData.additionalInfo[requirement.field] || '';

                if (requirement.field === 'projectDescription') {
                  return (
                    <FormTextarea
                      key={index}
                      label={requirement.label}
                      placeholder={requirement.placeholder}
                      value={value}
                      onChange={(e) => handleInputChange('project.description', e.target.value)}
                      error={errors[fieldKey]}
                      hint={requirement.helpText}
                      variant="glass"
                      rows={4}
                      required={requirement.required}
                      maxLength={1000}
                      counter
                    />
                  );
                }

                if (requirement.field === 'budget') {
                  return (
                    <FormSelect
                      key={index}
                      label={requirement.label}
                      options={[
                        { value: '', label: requirement.placeholder },
                        ...budgetRanges
                      ]}
                      value={value}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      error={errors[fieldKey]}
                      hint={requirement.helpText}
                      variant="glass"
                      required={requirement.required}
                    />
                  );
                }

                if (requirement.field === 'timeline') {
                  return (
                    <FormSelect
                      key={index}
                      label={requirement.label}
                      options={[
                        { value: '', label: requirement.placeholder },
                        ...timelines
                      ]}
                      value={value}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      error={errors[fieldKey]}
                      hint={requirement.helpText}
                      variant="glass"
                      required={requirement.required}
                    />
                  );
                }

                return (
                  <FormInput
                    key={index}
                    label={requirement.label}
                    placeholder={requirement.placeholder}
                    value={value}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    error={errors[fieldKey]}
                    hint={requirement.helpText}
                    variant="glass"
                    required={requirement.required}
                  />
                );
              })}

              {/* Champs projet standard */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormSelect
                  label="Type de projet"
                  options={[
                    { value: '', label: 'Sélectionnez le type de projet' },
                    ...projectTypes
                  ]}
                  value={projectData.type || ''}
                  onChange={(e) => handleInputChange('project.type', e.target.value)}
                  variant="glass"
                />
                
                <FormSelect
                  label="Budget prévisionnel"
                  options={[
                    { value: '', label: 'Sélectionnez votre budget' },
                    ...budgetRanges
                  ]}
                  value={projectData.budget || ''}
                  onChange={(e) => handleInputChange('project.budget', e.target.value)}
                  variant="glass"
                />
              </div>
            </div>
          </div>
        )}

        {/* Préférences */}
        <div className="glass-card p-8 rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Globe className="w-6 h-6 text-[#00BFFF]" />
            <span>Préférences de communication</span>
          </h3>
          
          <FormSelect
            label="Méthode de communication préférée"
            options={[
              { value: '', label: 'Sélectionnez votre préférence' },
              ...communicationMethods
            ]}
            value={clientData.preferences.communicationMethod}
            onChange={(e) => handleInputChange('preferences.communicationMethod', e.target.value)}
            variant="glass"
            hint="Comment préférez-vous être contacté pour les suivis ?"
          />
        </div>

        {/* Consentements RGPD */}
        <div className="glass-card p-8 rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-500" />
            <span>Consentements et confidentialité</span>
          </h3>
          
          <div className="space-y-6">
            <FormCheckbox
              label="J'accepte la politique de confidentialité et le traitement de mes données personnelles"
              description={
                <span>
                  Vos données sont traitées conformément au RGPD. 
                  <a href="/politique-confidentialite" target="_blank" className="text-[#00F5FF] hover:underline ml-1">
                    Lire la politique de confidentialité
                    <ExternalLink className="w-3 h-3 inline ml-1" />
                  </a>
                </span>
              }
              checked={clientData.consents.gdpr}
              onChange={(e) => handleInputChange('consents.gdpr', e.target.checked)}
              variant="rgpd"
              required
            />
            {errors['consents.gdpr'] && (
              <div className="text-red-400 text-sm flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors['consents.gdpr']}</span>
              </div>
            )}

            <FormCheckbox
              label="J'accepte de recevoir des communications marketing"
              description="Recevez nos derniers articles, conseils et offres spéciales (optionnel)"
              checked={clientData.consents.marketing}
              onChange={(e) => handleInputChange('consents.marketing', e.target.checked)}
              variant="glass"
            />

            <FormCheckbox
              label="Mémoriser mes informations pour les prochaines réservations"
              description="Vos données seront sauvegardées localement pour faciliter vos futures réservations"
              checked={clientData.consents.dataRetention}
              onChange={(e) => handleInputChange('consents.dataRetention', e.target.checked)}
              variant="glass"
            />
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-blue-300 mb-1">Protection de vos données</div>
                <div className="text-blue-200/80">
                  Vos informations sont chiffrées et stockées de manière sécurisée. 
                  Vous pouvez demander leur suppression à tout moment en nous contactant.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-300 hover:border-gray-500 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Retour au calendrier</span>
          </button>

          <button
            type="submit"
            disabled={isLoading || !clientData.consents.gdpr}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Création en cours...</span>
              </>
            ) : (
              <>
                <span>Confirmer la réservation</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientInformation;