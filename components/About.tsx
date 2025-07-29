'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Code, 
  Users, 
  Target, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animation staggered pour les cartes
          setTimeout(() => {
            values.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 200);
            });
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Excellence Technique",
      description: "Code propre, architecture scalable et bonnes pratiques de développement",
      color: "from-[#00F5FF] to-[#0099CC]",
      bgColor: "bg-[#00F5FF]/10",
      borderColor: "border-[#00F5FF]/30"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Approche Humaine",
      description: "Écoute active, communication claire et collaboration étroite avec mes clients",
      color: "from-[#9D4EDD] to-[#7B2CBF]",
      bgColor: "bg-[#9D4EDD]/10",
      borderColor: "border-[#9D4EDD]/30"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Orienté Résultats",
      description: "Solutions pragmatiques qui génèrent de la valeur business mesurable",
      color: "from-[#00F5FF] to-[#00BFFF]",
      bgColor: "bg-[#00BFFF]/10",
      borderColor: "border-[#00BFFF]/30"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Innovation Continue",
      description: "Veille technologique constante et adaptation aux dernières tendances",
      color: "from-[#9D4EDD] to-[#DA70D6]",
      bgColor: "bg-[#DA70D6]/10",
      borderColor: "border-[#DA70D6]/30"
    }
  ];

  const skills = [
    { name: 'Frontend Development', level: 95, color: '#00F5FF' },
    { name: 'Backend Development', level: 90, color: '#9D4EDD' },
    { name: 'Database Design', level: 85, color: '#00BFFF' },
    { name: 'Cloud & DevOps', level: 80, color: '#DA70D6' },
    { name: 'UI/UX Design', level: 75, color: '#00F5FF' },
    { name: 'Mobile Development', level: 70, color: '#9D4EDD' }
  ];

  const achievements = [
    { icon: <Star className="w-5 h-5" />, text: "Certifié AWS Cloud Practitioner" },
    { icon: <Zap className="w-5 h-5" />, text: "Expert Next.js & React Ecosystem" },
    { icon: <Shield className="w-5 h-5" />, text: "Spécialiste Architecture Microservices" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "5+ années d'expérience terrain" }
  ];

  return (
    <section ref={sectionRef} id="about" className="section-padding relative overflow-hidden">
      {/* Particules de fond spécifiques à la section */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={`about-particle-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          >
            <Sparkles 
              className="w-3 h-3 text-[#00F5FF] opacity-20" 
              style={{
                filter: `hue-rotate(${Math.random() * 120}deg)`
              }}
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* En-tête de section avec effet reveal */}
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="section-title text-4xl md:text-5xl font-bold mb-6 relative">
                À propos de <span className="gradient-text relative">
                  moi
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>
                </span>
              </h2>
              
              {/* Ligne décorative animée */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed mt-8">
              Concepteur & Fondateur de Leonce Ouattara Studio, Intégrateur Développeur passionné par la création de solutions digitales innovantes qui transforment les entreprises et créent de la valeur durable.
            </p>
          </div>

          {/* Layout deux colonnes principal */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Colonne gauche - Photo et informations personnelles */}
            <div className="space-y-8">
              {/* Photo professionnelle avec effet glassmorphisme avancé */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl">
                  {/* Effet de glow animé */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  
                  {/* Container principal avec glassmorphisme */}
                  <div className="relative glass-card p-2 rounded-3xl border-2 border-white/20 group-hover:border-[#00F5FF]/50 transition-all duration-500">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img 
                        src="https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop"
                        alt="Leonce Ouattara - Expert IT"
                        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Overlay glassmorphisme avec gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent"></div>
                      
                      {/* Badge flottant */}
                      <div className="absolute top-4 right-4">
                        <div className="glass-card px-3 py-1 rounded-full border border-green-500/30">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 font-medium">Disponible</span>
                          </div>
                        </div>
                      </div>

                      {/* Informations en overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1">Leonce Ouattara</h3>
                        <p className="text-[#00F5FF] text-sm font-medium">Intégrateur Développeur & Consultant Digital</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques flottantes */}
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 space-y-4">
                  <div className="glass-card p-4 rounded-xl border border-[#00F5FF]/30 text-center">
                    <div className="text-2xl font-bold gradient-text">50+</div>
                    <div className="text-xs text-gray-400">Projets</div>
                  </div>
                  <div className="glass-card p-4 rounded-xl border border-[#9D4EDD]/30 text-center">
                    <div className="text-2xl font-bold gradient-text">5+</div>
                    <div className="text-xs text-gray-400">Années</div>
                  </div>
                </div>
              </div>

              {/* Compétences avec barres animées */}
              <div className="glass-card p-8 rounded-3xl border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-500">
                <h3 className="text-2xl font-bold mb-8 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <span className="gradient-text">Mes compétences</span>
                </h3>
                
                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div key={index} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-300 font-medium">{skill.name}</span>
                        <span className="text-sm font-bold" style={{ color: skill.color }}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1500 ease-out relative overflow-hidden"
                            style={{ 
                              width: isVisible ? `${skill.level}%` : '0%',
                              backgroundColor: skill.color,
                              boxShadow: `0 0 10px ${skill.color}40`
                            }}
                          >
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse"></div>
                          </div>
                        </div>
                        
                        {/* Particules flottantes sur la barre */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 rounded-full animate-ping"
                              style={{
                                backgroundColor: skill.color,
                                left: `${Math.random() * skill.level}%`,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: '2s'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite - Texte et valeurs */}
            <div className="space-y-8">
              {/* Texte principal avec effet glassmorphisme */}
              <div className="glass-card p-8 rounded-3xl border border-gray-700/50 hover:border-[#9D4EDD]/30 transition-all duration-500 group">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#9D4EDD] to-[#DA70D6] rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="gradient-text">Mon parcours</span>
                </h3>
                
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    Fort de plus de <span className="text-[#00F5FF] font-semibold">6 années d'expérience</span> dans le développement web et mobile, j'accompagne les entreprises dans leur transformation digitale. Ma spécialité ? Créer des solutions sur mesure qui répondent parfaitement aux besoins métier.
                  </p>
                  
                  <p>
                    Autodidacte passionné et perfectionniste, je privilégie les <span className="text-[#9D4EDD] font-semibold">technologies modernes</span> et les architectures scalables pour garantir la pérennité de vos projets.
                  </p>

                  <p>
                    Mon approche combine <span className="text-[#00F5FF] font-semibold">excellence technique</span> et <span className="text-[#9D4EDD] font-semibold">vision business</span> pour livrer des solutions qui génèrent un impact mesurable sur votre activité.
                  </p>
                </div>

                {/* Certifications et achievements */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 group/item">
                        <div className="text-green-500 group-hover/item:scale-110 transition-transform">
                          {achievement.icon}
                        </div>
                        <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">
                          {achievement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cartes de valeurs avec animations staggered */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div 
                    key={index} 
                    className={`group relative overflow-hidden transition-all duration-700 ${
                      visibleCards.includes(index) 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                  >
                    {/* Effet de glow au hover */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${value.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                    
                    <div className={`relative glass-card p-6 rounded-2xl border ${value.borderColor} hover:border-opacity-60 transition-all duration-500 ${value.bgColor} group-hover:bg-opacity-20`}>
                      {/* Icône avec effet de rotation */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500`}>
                        <div className="text-white group-hover:scale-110 transition-transform">
                          {value.icon}
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold mb-3 group-hover:text-white transition-colors">
                        {value.title}
                      </h4>
                      
                      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                        {value.description}
                      </p>

                      {/* Effet de particules au hover */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '1s'
                            }}
                          />
                        ))}
                      </div>

                      {/* Ligne décorative animée */}
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call-to-action avec effet glassmorphisme */}
              <div className="glass-card p-8 rounded-3xl border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-500 text-center group relative overflow-hidden">
                {/* Effet de fond animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/5 to-[#9D4EDD]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                    Prêt à collaborer ?
                  </h3>
                  
                  <p className="text-gray-400 mb-8 group-hover:text-gray-300 transition-colors">
                    Discutons de votre projet et voyons comment je peux vous aider à atteindre vos objectifs digitaux.
                  </p>
                  
                  <button className="btn-primary px-8 py-4 rounded-full text-white font-semibold flex items-center space-x-3 mx-auto group/btn relative overflow-hidden">
                    <span className="relative z-10">Contactez-moi</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;