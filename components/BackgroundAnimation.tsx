'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  text: string;
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface FloatingElement {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  layer: number;
}

const BackgroundAnimation = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  const programmingLanguages = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'HTML', 'CSS',
    'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'Git', 'API', 'REST', 'GraphQL',
    'Redux', 'Tailwind', 'Express', 'Vue.js', 'Angular', 'PHP', 'Laravel', 'Django',
    'Kubernetes', 'Redis', 'MySQL', 'Firebase', 'Vercel', 'Netlify', 'Sass', 'Webpack',
    'Vite', 'Jest', 'Cypress', 'Figma', 'Linux', 'Nginx', 'Jenkins', 'Terraform'
  ];

  const colors = ['#00F5FF', '#9D4EDD', '#00BFFF', '#8A2BE2', '#40E0D0', '#DA70D6'];

  // Initialiser les dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Créer les particules 3D
  const createParticles = useCallback(() => {
    if (dimensions.width === 0) return;

    const newParticles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor(dimensions.width / 20));

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        text: programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)],
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        z: Math.random() * 1000,
        size: Math.random() * 16 + 8,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }

    setParticles(newParticles);
    particlesRef.current = newParticles;
  }, [dimensions]);

  // Créer les éléments flottants avec parallaxe
  const createFloatingElements = useCallback(() => {
    if (dimensions.width === 0) return;

    const newElements: FloatingElement[] = [];
    const elementCount = Math.min(25, Math.floor(dimensions.width / 60));

    for (let i = 0; i < elementCount; i++) {
      newElements.push({
        id: i,
        text: programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)],
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 20 + 12,
        delay: Math.random() * 10,
        duration: Math.random() * 20 + 20,
        layer: Math.floor(Math.random() * 3) + 1
      });
    }

    setFloatingElements(newElements);
  }, [dimensions]);

  // Animation des particules 3D
  const animateParticles = useCallback(() => {
    particlesRef.current = particlesRef.current.map(particle => {
      let newY = particle.y - particle.speed;
      let newOpacity = particle.opacity;
      let newSize = particle.size;

      // Effet de profondeur basé sur Z
      const depthFactor = (1000 - particle.z) / 1000;
      newSize = particle.size * depthFactor;
      newOpacity = particle.opacity * depthFactor;

      // Réinitialiser quand la particule sort de l'écran
      if (newY < -50) {
        newY = dimensions.height + 50;
        particle.x = Math.random() * dimensions.width;
        particle.z = Math.random() * 1000;
      }

      // Mouvement horizontal subtil
      const newX = particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.5;

      // Rotation continue
      const newRotation = particle.rotation + particle.rotationSpeed;

      return {
        ...particle,
        x: newX,
        y: newY,
        rotation: newRotation,
        size: newSize,
        opacity: Math.max(0.1, newOpacity)
      };
    });

    setParticles([...particlesRef.current]);
    animationRef.current = requestAnimationFrame(animateParticles);
  }, [dimensions]);

  // Initialiser les animations
  useEffect(() => {
    if (dimensions.width > 0) {
      createParticles();
      createFloatingElements();
    }
  }, [dimensions, createParticles, createFloatingElements]);

  // Démarrer l'animation des particules
  useEffect(() => {
    if (particles.length > 0) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, animateParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient de base espace profond */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#0F0F1A] to-[#0A0A0B]" />
      
      {/* Effet de nébuleuse */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F5FF] rounded-full blur-[120px] opacity-20 animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#9D4EDD] rounded-full blur-[100px] opacity-15 animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#00BFFF] rounded-full blur-[80px] opacity-10 animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Particules 3D animées */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute font-mono font-medium transition-all duration-75 select-none"
            style={{
              left: particle.x,
              top: particle.y,
              fontSize: `${particle.size}px`,
              color: particle.color,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg) translateZ(${particle.z}px)`,
              textShadow: `0 0 10px ${particle.color}40`,
              filter: `blur(${Math.max(0, (particle.z - 500) / 100)}px)`,
              zIndex: Math.floor(1000 - particle.z)
            }}
          >
            {particle.text}
          </div>
        ))}
      </div>

      {/* Éléments flottants avec parallaxe */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="floating-element text-gray-600 font-mono font-medium select-none"
            style={{
              left: element.x,
              top: element.y,
              fontSize: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              opacity: 0.1 + (element.layer * 0.05),
              transform: `translateZ(${element.layer * 100}px)`,
              filter: `blur(${element.layer * 0.5}px)`,
              zIndex: element.layer
            }}
          >
            {element.text}
          </div>
        ))}
      </div>

      {/* Étoiles scintillantes */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          >
            <div className="w-full h-full bg-white rounded-full animate-ping" />
          </div>
        ))}
      </div>

      {/* Particules de poussière cosmique */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 15 + 10}s`
            }}
            className="animate-pulse"
          />
        ))}
      </div>

      {/* Rayons lumineux */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#00F5FF] to-transparent opacity-20 animate-pulse" 
             style={{ animationDuration: '6s' }} />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-[#9D4EDD] to-transparent opacity-15 animate-pulse" 
             style={{ animationDuration: '8s', animationDelay: '3s' }} />
      </div>

      {/* Effet de vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#0A0A0B] opacity-60" />
    </div>
  );
};

export default BackgroundAnimation;