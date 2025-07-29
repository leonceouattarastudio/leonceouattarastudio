'use client';

import { useEffect, useState } from 'react';
import { 
  Hotel, 
  Home, 
  Briefcase, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Target
} from 'lucide-react';

const Sectors = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('sectors');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const sectors = [
    {
      icon: <Hotel className="w-12 h-12" />,
      title: "Hôtellerie & Restauration",
      description: "Solutions digitales pour optimiser l'expérience client et la gestion opérationnelle",
      features: [
        "Systèmes de réservation en ligne",
        "Applications de commande mobile",
        "Gestion des avis clients",
        "Solutions de paiement intégrées"
      ],
      projects: "15+ projets réalisés",
      color: "from-[#00F5FF] to-[#0099CC]",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: "Immobilier",
      description: "Plateformes digitales pour agents, promoteurs et gestionnaires de biens",
      features: [
        "Portails d'annonces immobilières",
        "CRM spécialisé immobilier",
        "Tours virtuels 360°",
        "Gestion locative automatisée"
      ],
      projects: "12+ projets réalisés",
      color: "from-[#9D4EDD] to-[#7B2CBF]",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-violet-500/10"
    },
    {
      icon: <Briefcase className="w-12 h-12" />,
      title: "Entrepreneurs & PME",
      description: "Solutions sur mesure pour accélérer la croissance des entreprises",
      features: [
        "Sites vitrine et e-commerce",
        "Applications métier",
        "Automatisation des processus",
        "Intégrations ERP/CRM"
      ],
      projects: "25+ projets réalisés",
      color: "from-[#00F5FF] to-[#9D4EDD]",
      bgColor: "bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice - Hôtel Le Moderne",
      content: "Grâce à Leonce, notre taux de réservations directes a augmenté de 40%. Une solution parfaitement adaptée à nos besoins.",
      rating: 5
    },
    {
      name: "Jean-Pierre Martin",
      role: "Agent immobilier - Century 21",
      content: "La plateforme développée nous a permis de doubler notre productivité. Interface intuitive et fonctionnalités avancées.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "CEO - StartupTech",
      content: "Un accompagnement exceptionnel du concept à la mise en production. Résultats au-delà de nos espérances.",
      rating: 5
    }
  ];

  const advantages = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Expertise sectorielle",
      description: "Compréhension approfondie des enjeux métier"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "ROI mesurable",
      description: "Solutions orientées performance et résultats"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Accompagnement complet",
      description: "De la conception à la formation utilisateurs"
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Solutions évolutives",
      description: "Architecture adaptée à votre croissance"
    }
  ];

  return (
    <section id="sectors" className="section-padding">
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-6">
              Secteurs d'<span className="gradient-text">expertise</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Spécialisé dans trois secteurs clés, je développe des solutions digitales qui transforment votre activité et génèrent des résultats concrets.
            </p>
          </div>

          {/* Grille des secteurs */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {sectors.map((sector, index) => (
              <div key={index} className={`service-card glass-card p-8 rounded-2xl border border-gray-700 ${sector.bgColor}`}>
                <div className={`bg-gradient-to-r ${sector.color} p-4 rounded-2xl w-fit mb-6`}>
                  <div className="text-white">
                    {sector.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4">{sector.title}</h3>
                <p className="text-gray-400 mb-6">{sector.description}</p>
                
                <div className="space-y-3 mb-6">
                  {sector.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#00F5FF]">{sector.projects}</span>
                  <button className="flex items-center space-x-2 text-[#00F5FF] hover:text-[#9D4EDD] transition-colors">
                    <span>Voir projets</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Avantages */}
          <div className="glass-card p-8 rounded-2xl mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Pourquoi me faire <span className="gradient-text">confiance</span> ?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 glass-card rounded-full flex items-center justify-center">
                    <div className="text-[#00F5FF]">
                      {advantage.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{advantage.title}</h4>
                  <p className="text-gray-400 text-sm">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Témoignages */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">
              Ce que disent mes <span className="gradient-text">clients</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call-to-action */}
          <div className="text-center">
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Votre secteur n'est pas listé ?</h3>
              <p className="text-gray-400 mb-6">
                Chaque projet est unique. Discutons de vos besoins spécifiques et voyons comment mes compétences peuvent s'adapter à votre domaine.
              </p>
              <button className="btn-primary px-8 py-3 rounded-full text-white font-medium flex items-center space-x-2 mx-auto hover:shadow-lg transition-all">
                <span>Parlons de votre projet</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sectors;