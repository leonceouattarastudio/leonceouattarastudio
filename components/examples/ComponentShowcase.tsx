'use client';

import { useState } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  FormField, 
  FormLabel, 
  FormInput, 
  FormTextarea, 
  FormSelect, 
  FormError, 
  FormSuccess,
  LoadingSpinner,
  LoadingOverlay,
  ScrollReveal,
  ScrollRevealList,
  ScrollRevealText,
  useLoading
} from '@/components/ui';
import { 
  Mail, 
  User, 
  Lock, 
  Send, 
  Star, 
  Heart, 
  Zap, 
  Sparkles,
  ArrowRight,
  Download,
  Play
} from 'lucide-react';

const ComponentShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { isLoading, startLoading, stopLoading } = useLoading();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    
    // Simulation d'envoi
    setTimeout(() => {
      stopLoading();
      setIsModalOpen(false);
      setFormData({ name: '', email: '', message: '', category: '' });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const cardExamples = [
    {
      title: "Card Default",
      description: "Carte standard avec glassmorphisme",
      variant: "default" as const
    },
    {
      title: "Card Glass",
      description: "Effet de verre avec blur avancé",
      variant: "glass" as const
    },
    {
      title: "Card Gradient",
      description: "Arrière-plan avec gradient coloré",
      variant: "gradient" as const
    },
    {
      title: "Card Neon",
      description: "Effet néon avec glow lumineux",
      variant: "neon" as const
    }
  ];

  const buttonExamples = [
    { variant: "primary" as const, label: "Primary", icon: <Star className="w-4 h-4" /> },
    { variant: "secondary" as const, label: "Secondary", icon: <Heart className="w-4 h-4" /> },
    { variant: "outline" as const, label: "Outline", icon: <Zap className="w-4 h-4" /> },
    { variant: "gradient" as const, label: "Gradient", icon: <Sparkles className="w-4 h-4" /> },
    { variant: "neon" as const, label: "Neon", icon: <ArrowRight className="w-4 h-4" /> }
  ];

  const spinnerExamples = [
    { variant: "default" as const, label: "Default" },
    { variant: "gradient" as const, label: "Gradient" },
    { variant: "dots" as const, label: "Dots" },
    { variant: "pulse" as const, label: "Pulse" },
    { variant: "orbit" as const, label: "Orbit" }
  ];

  const selectOptions = [
    { value: '', label: 'Sélectionnez une catégorie' },
    { value: 'general', label: 'Question générale' },
    { value: 'support', label: 'Support technique' },
    { value: 'business', label: 'Partenariat' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <ScrollReveal animation="slideDown">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Composants <span className="gradient-text">UI</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Découvrez notre collection de composants React réutilisables avec des designs modernes et des animations fluides.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Section */}
        <ScrollReveal animation="slideUp" delay={200}>
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Composants <span className="text-[#00F5FF]">Card</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cardExamples.map((example, index) => (
                <Card 
                  key={index}
                  variant={example.variant}
                  size="md"
                  hover={true}
                  glow={example.variant === 'neon'}
                >
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-4 text-[#00F5FF]" />
                    <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                    <p className="text-gray-400 text-sm">{example.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Buttons Section */}
        <ScrollReveal animation="slideUp" delay={400}>
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Composants <span className="text-[#9D4EDD]">Button</span>
            </h2>
            <Card variant="glass" size="lg">
              <div className="space-y-8">
                
                {/* Variants */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    {buttonExamples.map((example, index) => (
                      <Button
                        key={index}
                        variant={example.variant}
                        icon={example.icon}
                        iconPosition="left"
                      >
                        {example.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tailles</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm" variant="primary">Small</Button>
                    <Button size="md" variant="primary">Medium</Button>
                    <Button size="lg" variant="primary">Large</Button>
                    <Button size="xl" variant="primary">Extra Large</Button>
                  </div>
                </div>

                {/* States */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">États</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" loading>Loading</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                    <Button variant="gradient" glow>With Glow</Button>
                    <Button variant="neon" pulse>With Pulse</Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </ScrollReveal>

        {/* Loading Spinners Section */}
        <ScrollReveal animation="slideUp" delay={600}>
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Composants <span className="text-[#00BFFF]">Loading</span>
            </h2>
            <Card variant="glass" size="lg">
              <div className="space-y-8">
                
                {/* Spinner Variants */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Variants de Spinner</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {spinnerExamples.map((example, index) => (
                      <div key={index} className="text-center">
                        <div className="mb-4 flex justify-center">
                          <LoadingSpinner variant={example.variant} size="lg" />
                        </div>
                        <p className="text-sm text-gray-400">{example.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loading Overlay Example */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Loading Overlay</h3>
                  <LoadingOverlay 
                    isLoading={isLoading} 
                    message="Chargement en cours..."
                    spinner={{ variant: 'gradient', size: 'lg' }}
                  >
                    <div className="bg-gray-800/50 p-8 rounded-xl text-center">
                      <p className="text-gray-300 mb-4">Contenu à charger</p>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          startLoading();
                          setTimeout(stopLoading, 3000);
                        }}
                      >
                        Démarrer le chargement
                      </Button>
                    </div>
                  </LoadingOverlay>
                </div>
              </div>
            </Card>
          </section>
        </ScrollReveal>

        {/* Form Section */}
        <ScrollReveal animation="slideUp" delay={800}>
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Composants <span className="text-[#DA70D6]">Form</span>
            </h2>
            <Card variant="glass" size="lg">
              <Form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField>
                    <FormLabel htmlFor="name" required>Nom complet</FormLabel>
                    <FormInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      icon={<User className="w-5 h-5" />}
                      error={formErrors.name}
                    />
                    {formErrors.name && <FormError>{formErrors.name}</FormError>}
                  </FormField>

                  <FormField>
                    <FormLabel htmlFor="email" required>Email</FormLabel>
                    <FormInput
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      icon={<Mail className="w-5 h-5" />}
                      success={formData.email.includes('@')}
                    />
                    {formData.email.includes('@') && (
                      <FormSuccess>Email valide</FormSuccess>
                    )}
                  </FormField>
                </div>

                <FormField>
                  <FormLabel htmlFor="category">Catégorie</FormLabel>
                  <FormSelect
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    options={selectOptions}
                  />
                </FormField>

                <FormField>
                  <FormLabel htmlFor="message" required>Message</FormLabel>
                  <FormTextarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Votre message..."
                    rows={4}
                  />
                </FormField>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    icon={<Send className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Envoyer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                    icon={<Play className="w-4 h-4" />}
                  >
                    Ouvrir Modal
                  </Button>
                </div>
              </Form>
            </Card>
          </section>
        </ScrollReveal>

        {/* Scroll Reveal Section */}
        <ScrollReveal animation="slideUp" delay={1000}>
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Animations <span className="text-[#40E0D0]">ScrollReveal</span>
            </h2>
            
            {/* Text Animation */}
            <Card variant="gradient" size="lg" className="mb-8">
              <ScrollRevealText
                text="Ce texte apparaît lettre par lettre au scroll"
                className="text-2xl font-bold text-center"
                letterDelay={30}
                wordDelay={150}
              />
            </Card>

            {/* List Animation */}
            <ScrollRevealList
              staggerDelay={150}
              animation="slideLeft"
              className="grid md:grid-cols-3 gap-6"
            >
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} variant="glass" size="md">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">{item}</span>
                    </div>
                    <h3 className="text-lg font-semibold">Élément {item}</h3>
                    <p className="text-gray-400 text-sm">Animation avec délai</p>
                  </div>
                </Card>
              ))}
            </ScrollRevealList>
          </section>
        </ScrollReveal>

        {/* Call to Action */}
        <ScrollReveal animation="scaleIn" delay={1200}>
          <Card variant="neon" size="xl" className="text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Prêt à utiliser ces composants ?
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Tous ces composants sont réutilisables, personnalisables et optimisés pour les performances.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Download className="w-5 h-5" />}
                  glow
                >
                  Télécharger
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Documentation
                </Button>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Exemple de Modal"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-gray-300">
            Ceci est un exemple de modal avec glassmorphisme et animations fluides.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <LoadingSpinner variant="gradient" size="md" />
            <LoadingSpinner variant="orbit" size="md" />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(false)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComponentShowcase;