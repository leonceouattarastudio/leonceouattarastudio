'use client';

import React, { useState } from 'react';
import {
  ScrollTriggeredAnimation,
  ScrollTriggeredList,
  ParallaxElement,
  ParallaxBackground,
  HoverEffect,
  MicroInteraction,
  LoadingState,
  PageLoading
} from '@/components/animations';
import { Card, Button } from '@/components/ui';
import { 
  Sparkles, 
  Star, 
  Heart, 
  Zap, 
  ArrowRight, 
  Play, 
  Pause,
  RotateCcw,
  MousePointer,
  Eye,
  Layers
} from 'lucide-react';

const AnimationShowcase = () => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const scrollAnimations = [
    { type: 'fadeIn', label: 'Fade In' },
    { type: 'slideUp', label: 'Slide Up' },
    { type: 'slideDown', label: 'Slide Down' },
    { type: 'slideLeft', label: 'Slide Left' },
    { type: 'slideRight', label: 'Slide Right' },
    { type: 'scaleIn', label: 'Scale In' },
    { type: 'rotateIn', label: 'Rotate In' },
    { type: 'flipIn', label: 'Flip In' }
  ];

  const hoverEffects = [
    { type: 'glow', label: 'Glow Effect' },
    { type: 'lift', label: 'Lift Effect' },
    { type: 'tilt', label: 'Tilt Effect' },
    { type: 'magnetic', label: 'Magnetic Effect' },
    { type: 'ripple', label: 'Ripple Effect' },
    { type: 'particle', label: 'Particle Effect' }
  ];

  const loadingVariants = [
    { type: 'skeleton', label: 'Skeleton' },
    { type: 'shimmer', label: 'Shimmer' },
    { type: 'pulse', label: 'Pulse' },
    { type: 'wave', label: 'Wave' },
    { type: 'dots', label: 'Dots' },
    { type: 'spinner', label: 'Spinner' }
  ];

  const microInteractions = [
    { type: 'bounce', label: 'Bounce' },
    { type: 'pulse', label: 'Pulse' },
    { type: 'shake', label: 'Shake' },
    { type: 'rotate', label: 'Rotate' },
    { type: 'flip', label: 'Flip' }
  ];

  const demoCards = [
    {
      title: "Projet Alpha",
      description: "Application web moderne avec React et Next.js",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Projet Beta",
      description: "Plateforme e-commerce avec paiements intégrés",
      icon: <Star className="w-6 h-6" />,
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Projet Gamma",
      description: "Application mobile cross-platform",
      icon: <Heart className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Projet Delta",
      description: "Dashboard analytics en temps réel",
      icon: <Zap className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Projet Epsilon",
      description: "API REST avec architecture microservices",
      icon: <Layers className="w-6 h-6" />,
      color: "from-orange-500 to-amber-500"
    },
    {
      title: "Projet Zeta",
      description: "Solution IoT avec monitoring avancé",
      icon: <Eye className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500"
    }
  ];

  const handlePageLoadingDemo = () => {
    setIsPageLoading(true);
    setTimeout(() => setIsPageLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Page Loading Demo */}
      <PageLoading 
        isLoading={isPageLoading} 
        variant="overlay" 
        message="Démonstration du chargement..." 
      />

      <div className="container mx-auto px-4 py-16">
        
        {/* Header avec parallax */}
        <ParallaxElement speed={0.3} direction="down">
          <div className="text-center mb-20">
            <ScrollTriggeredAnimation animation="slideDown" duration={1000}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Système d'<span className="gradient-text">Animations</span>
              </h1>
            </ScrollTriggeredAnimation>
            
            <ScrollTriggeredAnimation animation="fadeIn" delay={300}>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-8">
                Découvrez notre collection complète d'animations, d'effets de hover, 
                de transitions et de micro-interactions pour créer des expériences utilisateur exceptionnelles.
              </p>
            </ScrollTriggeredAnimation>

            <ScrollTriggeredAnimation animation="scaleIn" delay={600}>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Play className="w-5 h-5" />}
                  onClick={handlePageLoadingDemo}
                >
                  Démo Loading
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<MousePointer className="w-5 h-5" />}
                >
                  Interactions
                </Button>
              </div>
            </ScrollTriggeredAnimation>
          </div>
        </ParallaxElement>

        {/* Section Scroll Animations */}
        <section className="mb-32">
          <ScrollTriggeredAnimation animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-16">
              Animations au <span className="text-[#00F5FF]">Scroll</span>
            </h2>
          </ScrollTriggeredAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {scrollAnimations.map((anim, index) => (
              <ScrollTriggeredAnimation
                key={anim.type}
                animation={anim.type as any}
                delay={index * 100}
                duration={800}
              >
                <Card variant="glass" size="md" hover>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{anim.label}</h3>
                    <p className="text-gray-400 text-sm">Animation {anim.type}</p>
                  </div>
                </Card>
              </ScrollTriggeredAnimation>
            ))}
          </div>

          {/* Liste avec animation staggered */}
          <ScrollTriggeredAnimation animation="slideUp" delay={200}>
            <h3 className="text-2xl font-bold text-center mb-8">
              Animation de <span className="text-[#9D4EDD]">Liste</span>
            </h3>
          </ScrollTriggeredAnimation>

          <ScrollTriggeredList
            animation="slideLeft"
            stagger={150}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {demoCards.map((card, index) => (
              <Card key={index} variant="gradient" size="md" hover>
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                  <p className="text-gray-400">{card.description}</p>
                </div>
              </Card>
            ))}
          </ScrollTriggeredList>
        </section>

        {/* Section Parallax */}
        <section className="mb-32">
          <ScrollTriggeredAnimation animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-16">
              Effets <span className="text-[#00BFFF]">Parallax</span>
            </h2>
          </ScrollTriggeredAnimation>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ParallaxElement speed={0.2} direction="up">
                <Card variant="neon" size="lg">
                  <h3 className="text-2xl font-bold mb-4">Parallax Lent</h3>
                  <p className="text-gray-300 mb-6">
                    Cet élément se déplace lentement vers le haut pendant le scroll, 
                    créant un effet de profondeur subtil.
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-4 h-4 bg-[#00F5FF] rounded-full animate-pulse" />
                    <div className="w-4 h-4 bg-[#9D4EDD] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="w-4 h-4 bg-[#00BFFF] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                </Card>
              </ParallaxElement>
            </div>

            <div>
              <ParallaxElement speed={0.8} direction="down" scale>
                <Card variant="glass" size="lg">
                  <h3 className="text-2xl font-bold mb-4">Parallax Rapide</h3>
                  <p className="text-gray-300 mb-6">
                    Cet élément se déplace rapidement vers le bas avec un effet de scale, 
                    créant une sensation de mouvement dynamique.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-8 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded opacity-60" />
                    ))}
                  </div>
                </Card>
              </ParallaxElement>
            </div>
          </div>
        </section>

        {/* Section Hover Effects */}
        <section className="mb-32">
          <ScrollTriggeredAnimation animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-16">
              Effets de <span className="text-[#9D4EDD]">Hover</span>
            </h2>
          </ScrollTriggeredAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hoverEffects.map((effect, index) => (
              <ScrollTriggeredAnimation
                key={effect.type}
                animation="scaleIn"
                delay={index * 100}
              >
                <HoverEffect
                  effect={effect.type as any}
                  intensity="medium"
                  color="#00F5FF"
                >
                  <Card variant="glass" size="md" className="cursor-pointer">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MousePointer className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{effect.label}</h3>
                      <p className="text-gray-400">Survolez pour voir l'effet</p>
                    </div>
                  </Card>
                </HoverEffect>
              </ScrollTriggeredAnimation>
            ))}
          </div>
        </section>

        {/* Section Micro-interactions */}
        <section className="mb-32">
          <ScrollTriggeredAnimation animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-16">
              Micro-<span className="text-[#DA70D6]">Interactions</span>
            </h2>
          </ScrollTriggeredAnimation>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {microInteractions.map((interaction, index) => (
              <ScrollTriggeredAnimation
                key={interaction.type}
                animation="flipIn"
                delay={index * 100}
              >
                <MicroInteraction
                  type="button"
                  variant={interaction.type as any}
                >
                  <Card variant="gradient" size="sm" className="cursor-pointer text-center">
                    <div className="p-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <RotateCcw className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold">{interaction.label}</h3>
                      <p className="text-xs text-gray-300 mt-1">Cliquez-moi</p>
                    </div>
                  </Card>
                </MicroInteraction>
              </ScrollTriggeredAnimation>
            ))}
          </div>
        </section>

        {/* Section Loading States */}
        <section className="mb-32">
          <ScrollTriggeredAnimation animation="slideUp">
            <h2 className="text-4xl font-bold text-center mb-16">
              États de <span className="text-[#40E0D0]">Chargement</span>
            </h2>
          </ScrollTriggeredAnimation>

          <Card variant="glass" size="xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingVariants.map((variant, index) => (
                <ScrollTriggeredAnimation
                  key={variant.type}
                  animation="slideUp"
                  delay={index * 100}
                >
                  <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">{variant.label}</h3>
                    <div className="flex justify-center mb-4">
                      <LoadingState
                        variant={variant.type as any}
                        size="lg"
                        color="#00F5FF"
                      />
                    </div>
                    <p className="text-gray-400 text-sm">Loading {variant.type}</p>
                  </div>
                </ScrollTriggeredAnimation>
              ))}
            </div>
          </Card>
        </section>

        {/* Call to Action avec parallax */}
        <ParallaxElement speed={0.1} direction="up">
          <ScrollTriggeredAnimation animation="scaleIn" delay={200}>
            <Card variant="neon" size="xl" className="text-center">
              <div className="space-y-8">
                <div className="w-24 h-24 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold">
                  Prêt à animer votre projet ?
                </h2>
                
                <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                  Utilisez ces animations pour créer des expériences utilisateur 
                  mémorables et engageantes dans vos applications.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <HoverEffect effect="glow" intensity="strong">
                    <Button
                      variant="primary"
                      size="xl"
                      icon={<ArrowRight className="w-6 h-6" />}
                      iconPosition="right"
                    >
                      Commencer maintenant
                    </Button>
                  </HoverEffect>
                  
                  <HoverEffect effect="lift" intensity="medium">
                    <Button
                      variant="outline"
                      size="xl"
                      icon={<Eye className="w-6 h-6" />}
                    >
                      Voir la documentation
                    </Button>
                  </HoverEffect>
                </div>
              </div>
            </Card>
          </ScrollTriggeredAnimation>
        </ParallaxElement>
      </div>
    </div>
  );
};

export default AnimationShowcase;