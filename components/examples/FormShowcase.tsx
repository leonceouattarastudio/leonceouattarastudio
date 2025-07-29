'use client';

import React, { useState } from 'react';
import {
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  PasswordStrengthIndicator,
  FormSubmitButton,
  useForm
} from '@/components/forms';
import { Card } from '@/components/ui';
import { ScrollTriggeredAnimation } from '@/components/animations';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building, 
  MapPin,
  CreditCard,
  Calendar,
  Globe,
  MessageSquare,
  Shield,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

const FormShowcase = () => {
  const [currentDemo, setCurrentDemo] = useState<'contact' | 'registration' | 'payment'>('contact');

  // Contact Form
  const contactForm = useForm({
    fields: {
      name: {
        rules: { required: true, minLength: 2, maxLength: 50 },
        validateOnChange: true
      },
      email: {
        rules: { required: true, email: true },
        validateOnChange: true
      },
      phone: {
        rules: { phone: true },
        validateOnChange: true
      },
      company: {
        rules: { maxLength: 100 }
      },
      subject: {
        rules: { required: true },
        validateOnChange: true
      },
      message: {
        rules: { required: true, minLength: 10, maxLength: 1000 },
        validateOnChange: true
      },
      newsletter: {
        initialValue: false
      },
      rgpd: {
        rules: { required: true },
        validateOnChange: true
      }
    },
    validateOnSubmit: true
  });

  // Registration Form
  const registrationForm = useForm({
    fields: {
      firstName: {
        rules: { required: true, minLength: 2 },
        validateOnChange: true
      },
      lastName: {
        rules: { required: true, minLength: 2 },
        validateOnChange: true
      },
      email: {
        rules: { required: true, email: true },
        validateOnChange: true
      },
      password: {
        rules: { 
          required: true, 
          minLength: 8,
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          custom: (value) => {
            if (value && value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
            return null;
          }
        },
        validateOnChange: true
      },
      confirmPassword: {
        rules: { 
          required: true,
          custom: (value) => {
            if (value !== registrationForm.values.password) {
              return 'Les mots de passe ne correspondent pas';
            }
            return null;
          }
        },
        validateOnChange: true
      },
      birthDate: {
        rules: { required: true }
      },
      country: {
        rules: { required: true }
      },
      terms: {
        rules: { required: true }
      }
    }
  });

  // Payment Form
  const paymentForm = useForm({
    fields: {
      cardNumber: {
        rules: { 
          required: true,
          pattern: /^\d{16}$/,
          custom: (value) => {
            if (value && !/^\d{16}$/.test(value.replace(/\s/g, ''))) {
              return 'Numéro de carte invalide';
            }
            return null;
          }
        },
        validateOnChange: true
      },
      expiryDate: {
        rules: { required: true, pattern: /^(0[1-9]|1[0-2])\/\d{2}$/ },
        validateOnChange: true
      },
      cvv: {
        rules: { required: true, pattern: /^\d{3,4}$/ },
        validateOnChange: true
      },
      cardName: {
        rules: { required: true, minLength: 2 },
        validateOnChange: true
      },
      billingAddress: {
        rules: { required: true },
        validateOnChange: true
      },
      city: {
        rules: { required: true },
        validateOnChange: true
      },
      postalCode: {
        rules: { required: true, pattern: /^\d{5}$/ },
        validateOnChange: true
      },
      saveCard: {
        initialValue: false
      }
    }
  });

  const subjectOptions = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'general', label: 'Question générale' },
    { value: 'project', label: 'Nouveau projet' },
    { value: 'support', label: 'Support technique' },
    { value: 'partnership', label: 'Partenariat' }
  ];

  const countryOptions = [
    { value: '', label: 'Sélectionnez votre pays' },
    { value: 'fr', label: 'France' },
    { value: 'be', label: 'Belgique' },
    { value: 'ch', label: 'Suisse' },
    { value: 'ca', label: 'Canada' },
    { value: 'other', label: 'Autre' }
  ];

  const handleContactSubmit = contactForm.onSubmit(async (values) => {
    console.log('Contact form submitted:', values);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  const handleRegistrationSubmit = registrationForm.onSubmit(async (values) => {
    console.log('Registration form submitted:', values);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  const handlePaymentSubmit = paymentForm.onSubmit(async (values) => {
    console.log('Payment form submitted:', values);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  const demos = [
    { id: 'contact', label: 'Formulaire de Contact', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'registration', label: 'Inscription', icon: <User className="w-5 h-5" /> },
    { id: 'payment', label: 'Paiement', icon: <CreditCard className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <ScrollTriggeredAnimation animation="slideDown">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Formulaires <span className="gradient-text">Modernes</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Découvrez notre système de formulaires avec validation en temps réel, 
              états visuels avancés et expérience utilisateur exceptionnelle.
            </p>
          </div>
        </ScrollTriggeredAnimation>

        {/* Demo Selector */}
        <ScrollTriggeredAnimation animation="slideUp" delay={200}>
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setCurrentDemo(demo.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    currentDemo === demo.id
                      ? 'bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {demo.icon}
                  <span className="font-medium">{demo.label}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollTriggeredAnimation>

        {/* Forms */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Form */}
          <ScrollTriggeredAnimation animation="slideLeft" delay={400}>
            <Card variant="glass" size="xl">
              <div className="space-y-8">
                
                {/* Contact Form */}
                {currentDemo === 'contact' && (
                  <>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Contactez-nous</h2>
                      <p className="text-gray-400">Nous répondons sous 24h</p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput
                          {...contactForm.getFieldProps('name')}
                          label="Nom complet"
                          placeholder="Votre nom"
                          icon={<User className="w-5 h-5" />}
                          variant="glass"
                          required
                        />
                        <FormInput
                          {...contactForm.getFieldProps('email')}
                          type="email"
                          label="Email"
                          placeholder="votre@email.com"
                          icon={<Mail className="w-5 h-5" />}
                          variant="glass"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput
                          {...contactForm.getFieldProps('phone')}
                          type="tel"
                          label="Téléphone"
                          placeholder="+33 6 12 34 56 78"
                          icon={<Phone className="w-5 h-5" />}
                          variant="glass"
                        />
                        <FormInput
                          {...contactForm.getFieldProps('company')}
                          label="Entreprise"
                          placeholder="Nom de votre entreprise"
                          icon={<Building className="w-5 h-5" />}
                          variant="glass"
                        />
                      </div>

                      <FormSelect
                        {...contactForm.getFieldProps('subject')}
                        label="Sujet"
                        options={subjectOptions}
                        variant="glass"
                        required
                      />

                      <FormTextarea
                        {...contactForm.getFieldProps('message')}
                        label="Message"
                        placeholder="Décrivez votre projet ou votre demande..."
                        rows={5}
                        variant="glass"
                        counter
                        maxLength={1000}
                        autoResize
                        required
                      />

                      <div className="space-y-4">
                        <FormCheckbox
                          {...contactForm.getFieldProps('newsletter')}
                          label="Recevoir la newsletter"
                          description="Recevez nos derniers articles et conseils tech"
                          variant="glass"
                        />

                        <FormCheckbox
                          {...contactForm.getFieldProps('rgpd')}
                          label="J'accepte la politique de confidentialité"
                          description="Vos données sont traitées conformément au RGPD"
                          variant="rgpd"
                          required
                        />
                      </div>

                      <FormSubmitButton
                        loading={contactForm.isSubmitting}
                        disabled={!contactForm.isValid}
                        fullWidth
                        size="lg"
                      >
                        Envoyer le message
                      </FormSubmitButton>
                    </form>
                  </>
                )}

                {/* Registration Form */}
                {currentDemo === 'registration' && (
                  <>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#9D4EDD] to-[#DA70D6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Créer un compte</h2>
                      <p className="text-gray-400">Rejoignez notre communauté</p>
                    </div>

                    <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput
                          {...registrationForm.getFieldProps('firstName')}
                          label="Prénom"
                          placeholder="Votre prénom"
                          icon={<User className="w-5 h-5" />}
                          variant="neon"
                          required
                        />
                        <FormInput
                          {...registrationForm.getFieldProps('lastName')}
                          label="Nom"
                          placeholder="Votre nom"
                          icon={<User className="w-5 h-5" />}
                          variant="neon"
                          required
                        />
                      </div>

                      <FormInput
                        {...registrationForm.getFieldProps('email')}
                        type="email"
                        label="Email"
                        placeholder="votre@email.com"
                        icon={<Mail className="w-5 h-5" />}
                        variant="neon"
                        required
                      />

                      <FormInput
                        {...registrationForm.getFieldProps('password')}
                        type="password"
                        label="Mot de passe"
                        placeholder="Votre mot de passe"
                        icon={<Lock className="w-5 h-5" />}
                        variant="neon"
                        showPasswordToggle
                        required
                      />

                      {registrationForm.values.password && (
                        <PasswordStrengthIndicator
                          password={registrationForm.values.password}
                          showSuggestions
                        />
                      )}

                      <FormInput
                        {...registrationForm.getFieldProps('confirmPassword')}
                        type="password"
                        label="Confirmer le mot de passe"
                        placeholder="Confirmez votre mot de passe"
                        icon={<Lock className="w-5 h-5" />}
                        variant="neon"
                        showPasswordToggle
                        required
                      />

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput
                          {...registrationForm.getFieldProps('birthDate')}
                          type="date"
                          label="Date de naissance"
                          icon={<Calendar className="w-5 h-5" />}
                          variant="neon"
                          required
                        />
                        <FormSelect
                          {...registrationForm.getFieldProps('country')}
                          label="Pays"
                          options={countryOptions}
                          variant="neon"
                          required
                        />
                      </div>

                      <FormCheckbox
                        {...registrationForm.getFieldProps('terms')}
                        label="J'accepte les conditions d'utilisation"
                        description="En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité"
                        variant="rgpd"
                        required
                      />

                      <FormSubmitButton
                        loading={registrationForm.isSubmitting}
                        disabled={!registrationForm.isValid}
                        fullWidth
                        size="lg"
                        variant="success"
                      >
                        Créer mon compte
                      </FormSubmitButton>
                    </form>
                  </>
                )}

                {/* Payment Form */}
                {currentDemo === 'payment' && (
                  <>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Informations de paiement</h2>
                      <p className="text-gray-400">Paiement sécurisé SSL</p>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <FormInput
                        {...paymentForm.getFieldProps('cardNumber')}
                        label="Numéro de carte"
                        placeholder="1234 5678 9012 3456"
                        icon={<CreditCard className="w-5 h-5" />}
                        variant="glass"
                        maxLength={19}
                        required
                      />

                      <div className="grid grid-cols-2 gap-6">
                        <FormInput
                          {...paymentForm.getFieldProps('expiryDate')}
                          label="Date d'expiration"
                          placeholder="MM/AA"
                          icon={<Calendar className="w-5 h-5" />}
                          variant="glass"
                          maxLength={5}
                          required
                        />
                        <FormInput
                          {...paymentForm.getFieldProps('cvv')}
                          label="CVV"
                          placeholder="123"
                          icon={<Shield className="w-5 h-5" />}
                          variant="glass"
                          maxLength={4}
                          required
                        />
                      </div>

                      <FormInput
                        {...paymentForm.getFieldProps('cardName')}
                        label="Nom sur la carte"
                        placeholder="Nom tel qu'il apparaît sur la carte"
                        icon={<User className="w-5 h-5" />}
                        variant="glass"
                        required
                      />

                      <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Adresse de facturation</h3>
                        
                        <div className="space-y-4">
                          <FormInput
                            {...paymentForm.getFieldProps('billingAddress')}
                            label="Adresse"
                            placeholder="123 Rue de la Paix"
                            icon={<MapPin className="w-5 h-5" />}
                            variant="glass"
                            required
                          />

                          <div className="grid md:grid-cols-2 gap-6">
                            <FormInput
                              {...paymentForm.getFieldProps('city')}
                              label="Ville"
                              placeholder="Paris"
                              icon={<Building className="w-5 h-5" />}
                              variant="glass"
                              required
                            />
                            <FormInput
                              {...paymentForm.getFieldProps('postalCode')}
                              label="Code postal"
                              placeholder="75001"
                              icon={<MapPin className="w-5 h-5" />}
                              variant="glass"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <FormCheckbox
                        {...paymentForm.getFieldProps('saveCard')}
                        label="Enregistrer cette carte"
                        description="Pour des paiements plus rapides à l'avenir"
                        variant="glass"
                      />

                      <FormSubmitButton
                        loading={paymentForm.isSubmitting}
                        disabled={!paymentForm.isValid}
                        fullWidth
                        size="lg"
                        variant="success"
                        icon={<Shield className="w-5 h-5" />}
                      >
                        Payer maintenant
                      </FormSubmitButton>
                    </form>
                  </>
                )}
              </div>
            </Card>
          </ScrollTriggeredAnimation>

          {/* Features */}
          <ScrollTriggeredAnimation animation="slideRight" delay={600}>
            <div className="space-y-8">
              
              {/* Features List */}
              <Card variant="neon" size="lg">
                <div className="space-y-6">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-[#00F5FF] mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Fonctionnalités Avancées</h3>
                    <p className="text-gray-400">Tout ce dont vous avez besoin pour des formulaires modernes</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                        title: 'Validation en temps réel',
                        description: 'Feedback immédiat pendant la saisie'
                      },
                      {
                        icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
                        title: 'États visuels avancés',
                        description: 'Erreurs, succès, warnings et loading'
                      },
                      {
                        icon: <Shield className="w-5 h-5 text-blue-400" />,
                        title: 'Sécurité renforcée',
                        description: 'Validation côté client et serveur'
                      },
                      {
                        icon: <Sparkles className="w-5 h-5 text-purple-400" />,
                        title: 'Animations fluides',
                        description: 'Transitions et micro-interactions'
                      },
                      {
                        icon: <Globe className="w-5 h-5 text-cyan-400" />,
                        title: 'Accessibilité',
                        description: 'Conforme aux standards WCAG'
                      },
                      {
                        icon: <User className="w-5 h-5 text-pink-400" />,
                        title: 'UX optimisée',
                        description: 'Expérience utilisateur intuitive'
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
                        <div className="flex-shrink-0 mt-0.5">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Form Stats */}
              <Card variant="glass" size="lg">
                <div className="text-center space-y-6">
                  <h3 className="text-xl font-bold">Statistiques du Formulaire</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00F5FF] mb-2">
                        {currentDemo === 'contact' ? contactForm.isDirty ? '✓' : '○' : 
                         currentDemo === 'registration' ? registrationForm.isDirty ? '✓' : '○' :
                         paymentForm.isDirty ? '✓' : '○'}
                      </div>
                      <div className="text-sm text-gray-400">Modifié</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#9D4EDD] mb-2">
                        {currentDemo === 'contact' ? contactForm.isValid ? '✓' : '✗' : 
                         currentDemo === 'registration' ? registrationForm.isValid ? '✓' : '✗' :
                         paymentForm.isValid ? '✓' : '✗'}
                      </div>
                      <div className="text-sm text-gray-400">Valide</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Validation en temps réel activée</p>
                    <p>• Feedback visuel immédiat</p>
                    <p>• Soumission AJAX sécurisée</p>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollTriggeredAnimation>
        </div>
      </div>
    </div>
  );
};

export default FormShowcase;