'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Download, Calendar, ArrowRight, Play, Sparkles } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = [
    'Intégration & Développment',
    'Systèmes Web & CMS Personnalisés',
    'Solutions Digitales sur Mesure',
    'Architecture Cloud & DevOps',
    'Développement Full-Stack'
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation machine à écrire
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 1000 : 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && typewriterText === currentPhrase) {
        // Pause avant de commencer à effacer
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typewriterText === '') {
        // Passer à la phrase suivante
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        // Taper ou effacer
        setTypewriterText(prev => 
          isDeleting 
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typewriterText, currentPhraseIndex, isDeleting, phrases]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { value: '50+', label: 'Projets réalisés', icon: '🚀' },
    { value: '6+', label: 'Années d\'expérience', icon: '⚡' },
    { value: '100%', label: 'Satisfaction client', icon: '⭐' }
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Particules flottantes spéciales pour le hero */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={`hero-particle-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          >
            <Sparkles 
              className="w-4 h-4 text-[#00F5FF] opacity-30" 
              style={{
                filter: `hue-rotate(${Math.random() * 60}deg)`
              }}
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Photo professionnelle hexagonale */}
          <div className="mb-12 relative">
            <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56">
              {/* Effet de glow animé */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] opacity-20 animate-pulse blur-xl"></div>
              
              {/* Container hexagonal avec glassmorphisme */}
              <div className="relative w-full h-full">
                <div 
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 245, 255, 0.3)'
                  }}
                >
                  <img 
                    src="https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                    alt="Leonce Ouattara - Intégrateur Développeur"
                    className="w-full h-full object-cover scale-110"
                  />
                  
                  {/* Overlay glassmorphisme */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 to-[#9D4EDD]/10"
                    style={{
                      backdropFilter: 'blur(1px)'
                    }}
                  />
                </div>

                {/* Anneaux orbitaux */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute inset-0 rounded-full border border-[#00F5FF]/30" style={{ transform: 'scale(1.2)' }} />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute inset-0 rounded-full border border-[#9D4EDD]/20" style={{ transform: 'scale(1.4)' }} />
                </div>
              </div>
            </div>

            {/* Badge de statut */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="glass-card px-4 py-2 rounded-full border border-green-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400 font-medium">Disponible pour nouveaux projets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Titre principal avec effet de brillance */}
          <div className="mb-8 relative">
            <h1 className="hero-title text-4xl md:text-7xl font-bold mb-4 leading-tight relative">
              <span className="relative inline-block">
                <span className="gradient-text">Leonce Ouattara</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>
              </span>
              <br />
              <span className="text-white/90">Studio</span>
            </h1>
            
            {/* Sous-titre avec animation machine à écrire */}
            <div className="relative">
              <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-2 min-h-[2.5rem] flex items-center justify-center">
                <span className="gradient-text font-semibold">
                  {typewriterText}
                  <span className="animate-pulse text-[#00F5FF]">|</span>
                </span>
              </p>
              <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                Leonce Ouattara Studio est composé de plusieurs Développeurs Full-Stack, FrontEnd, BackEnd, DevOPS et professionnels du digital spécialisés dans la création d'expériences digitales exceptionnelles pour l'hôtellerie, l'immobilier et les entrepreneurs.
              </p>
            </div>
          </div>

          {/* Stack technique avec animation */}
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-6 tracking-widest">STACK TECHNIQUE</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {['React',, 'Laravel', 'Next.js', 'Node.js', 'Python', 'PHP', 'JAVA', 'Mysql', 'SQLServer', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript', 'Tailwind'].map((tech, index) => (
                <span 
                  key={tech} 
                  className="tech-stack-item px-4 py-2 glass-card rounded-full text-sm border border-gray-700/50 hover:border-[#00F5FF]/50 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Boutons d'action avec effets avancés */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative btn-primary px-8 py-4 rounded-full text-white font-semibold flex items-center space-x-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Calendar className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Prendre RDV</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            
            
            <button className="group px-6 py-4 rounded-full glass-card border border-[#9D4EDD]/30 text-[#9D4EDD] hover:bg-[#9D4EDD]/10 transition-all duration-300 flex items-center space-x-2">
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Voir démo</span>
            </button>
          </div>

          {/* Statistiques avec animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-2xl border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-300 group"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Call-to-action secondaire */}
          <div className="glass-card p-6 rounded-2xl max-w-2xl mx-auto mb-12 border border-gray-700/50">
            <p className="text-gray-300 mb-4">
              🚀 <strong>Nouveau :</strong> Découvrez mes dernières réalisations en IA et automatisation
            </p>
            <button className="text-[#00F5FF] hover:text-[#9D4EDD] transition-colors flex items-center space-x-2 mx-auto">
              <span>Voir les projets récents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll indicator animé */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToAbout}
            className="group flex flex-col items-center space-y-2 animate-bounce hover:animate-none transition-all"
          >
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-[#00F5FF] to-transparent rounded-full mt-2 animate-pulse"></div>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#00F5FF] transition-colors" />
            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">Découvrir</span>
          </button>
        </div>
      </div>

      {/* Effet de particules interactives au survol */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00F5FF] rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#9D4EDD] rounded-full opacity-40 animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#00BFFF] rounded-full opacity-30 animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>
    </section>
  );
};

export default Hero;