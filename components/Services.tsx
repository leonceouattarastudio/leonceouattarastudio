'use client';

import { useEffect, useState } from 'react';
import { 
  Code, 
  Smartphone, 
  Globe, 
  Database, 
  Cloud, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Settings,
  Monitor,
  Server,
  Sparkles,
  ExternalLink,
  Play,
  Clock,
  Euro
} from 'lucide-react';

const Services = () => {
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

    const element = document.getElementById('services');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Développement Web",
      description: "Applications web modernes et performantes avec React, Next.js et Node.js. Interface utilisateur intuitive et expérience optimisée.",
      features: [
        "Single Page Applications (SPA)",
        "Progressive Web Apps (PWA)",
        "API REST & GraphQL",
        "Interfaces responsives",
        "Optimisation SEO",
        "Tests automatisés"
      ],
      stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
      color: "from-[#00F5FF] to-[#0099CC]",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
      borderColor: "border-[#00F5FF]/30",
      price: "2 500€",
      duration: "2-4 semaines",
      deliverables: [
        "Code source complet",
        "Documentation technique",
        "Formation utilisateur",
        "Support 3 mois inclus"
      ]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Applications Mobile",
      description: "Développement d'applications mobiles performantes pour iOS et Android avec React Native et Flutter.",
      features: [
        "Applications React Native",
        "Applications Flutter",
        "App Store Optimization",
        "Notifications push",
        "Géolocalisation",
        "Paiements in-app"
      ],
      stack: ["React Native", "Flutter", "Firebase", "Redux", "Expo", "TypeScript"],
      color: "from-[#9D4EDD] to-[#7B2CBF]",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-violet-500/10",
      borderColor: "border-[#9D4EDD]/30",
      price: "3 500€",
      duration: "3-6 semaines",
      deliverables: [
        "Apps iOS & Android",
        "Publication stores",
        "Analytics intégrées",
        "Maintenance 6 mois"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Sites E-commerce",
      description: "Solutions e-commerce sur mesure avec gestion des paiements, stocks et analytics avancées.",
      features: [
        "Boutique Shopify/WooCommerce",
        "Paiements Stripe/PayPal",
        "Gestion des stocks",
        "Analytics avancées",
        "Marketing automation",
        "Multi-devises"
      ],
      stack: ["Shopify", "WooCommerce", "Stripe", "Analytics", "WordPress", "PHP"],
      color: "from-[#00F5FF] to-[#00BFFF]",
      bgColor: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
      borderColor: "border-[#00BFFF]/30",
      price: "4 000€",
      duration: "4-8 semaines",
      deliverables: [
        "Boutique complète",
        "Tunnel de vente",
        "Dashboard admin",
        "Formation e-commerce"
      ]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Architecture Backend",
      description: "Conception et développement d'architectures backend performantes avec bases de données optimisées.",
      features: [
        "Architecture microservices",
        "Bases de données MongoDB/PostgreSQL",
        "Cache Redis/Elasticsearch",
        "Tests automatisés",
        "Documentation API",
        "Monitoring avancé"
      ],
      stack: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Redis", "Docker"],
      color: "from-[#9D4EDD] to-[#DA70D6]",
      bgColor: "bg-gradient-to-br from-violet-500/10 to-pink-500/10",
      borderColor: "border-[#DA70D6]/30",
      price: "3 000€",
      duration: "3-5 semaines",
      deliverables: [
        "API complète",
        "Base de données",
        "Documentation",
        "Tests unitaires"
      ]
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Cloud & DevOps",
      description: "Déploiement et gestion d'infrastructure cloud avec CI/CD et monitoring avancé.",
      features: [
        "Infrastructure AWS/Azure/GCP",
        "Conteneurisation Docker/Kubernetes",
        "Pipeline CI/CD",
        "Monitoring & alertes",
        "Sauvegardes automatiques",
        "Scalabilité automatique"
      ],
      stack: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Prometheus"],
      color: "from-[#00F5FF] to-[#40E0D0]",
      bgColor: "bg-gradient-to-br from-cyan-500/10 to-teal-500/10",
      borderColor: "border-[#40E0D0]/30",
      price: "2 000€",
      duration: "2-4 semaines",
      deliverables: [
        "Infrastructure cloud",
        "Pipeline déploiement",
        "Monitoring setup",
        "Documentation ops"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité & Audit",
      description: "Audit de sécurité complet et mise en conformité RGPD avec monitoring sécurisé.",
      features: [
        "Tests d'intrusion",
        "Chiffrement des données",
        "Conformité RGPD",
        "Monitoring sécurisé",
        "Authentification 2FA",
        "Audit de code"
      ],
      stack: ["Security Tools", "OWASP", "SSL/TLS", "Compliance", "Penetration Testing"],
      color: "from-[#9D4EDD] to-[#8A2BE2]",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10",
      borderColor: "border-[#8A2BE2]/30",
      price: "1 500€",
      duration: "1-3 semaines",
      deliverables: [
        "Rapport d'audit",
        "Plan de sécurisation",
        "Mise en conformité",
        "Formation sécurité"
      ]
    }
  ];

  const process = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Analyse",
      description: "Étude approfondie de vos besoins et définition des objectifs",
      color: "text-[#00F5FF]"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Conception",
      description: "Design UX/UI et architecture technique détaillée",
      color: "text-[#9D4EDD]"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Développement",
      description: "Implémentation avec méthodologie agile et tests",
      color: "text-[#00BFFF]"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Déploiement",
      description: "Mise en production et formation utilisateurs",
      color: "text-[#DA70D6]"
    }
  ];

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={`service-particle-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          >
            <Sparkles 
              className="w-2 h-2 text-[#9D4EDD] opacity-20" 
              style={{
                filter: `hue-rotate(${Math.random() * 120}deg)`
              }}
            />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* En-tête de section */}
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
                Mes <span className="gradient-text">Services</span>
              </h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full"></div>
            </div>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed mt-8">
              Solutions complètes pour vos projets digitaux, de la conception au déploiement, avec un focus sur la performance et l'expérience utilisateur.
            </p>
          </div>

          {/* Grille des services */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <div key={index} className={`service-card glass-card rounded-3xl border ${service.borderColor} ${service.bgColor} overflow-hidden group hover:border-opacity-60 transition-all duration-500`}>
                
                {/* En-tête avec icône et titre */}
                <div className="p-8 pb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Fonctionnalités */}
                <div className="px-8 pb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Fonctionnalités incluses</span>
                  </h4>
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stack technique */}
                <div className="px-8 pb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-500" />
                    <span>Technologies utilisées</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.stack.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700 hover:border-[#00F5FF]/50 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Livrables */}
                <div className="px-8 pb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-purple-500" />
                    <span>Ce que vous recevez</span>
                  </h4>
                  <div className="space-y-2">
                    {service.deliverables.map((deliverable, deliverableIndex) => (
                      <div key={deliverableIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer avec prix et CTA */}
                <div className="px-8 pb-8">
                  <div className="border-t border-gray-700/50 pt-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          <Clock className="w-4 h-4 text-[#00F5FF]" />
                          <span className="text-xs text-gray-400">Durée</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-300">{service.duration}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          <Euro className="w-4 h-4 text-[#9D4EDD]" />
                          <span className="text-xs text-gray-400">À partir de</span>
                        </div>
                        <div className="text-lg font-bold gradient-text">{service.price}</div>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 border border-[#00F5FF]/30 rounded-xl text-[#00F5FF] hover:bg-gradient-to-r hover:from-[#00F5FF]/30 hover:to-[#9D4EDD]/30 hover:border-[#00F5FF]/50 transition-all duration-300 flex items-center justify-center space-x-2 group/btn">
                      <span className="font-medium">Demander un devis</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Effet de particules au hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '1s'
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Processus de travail */}
          <div className="glass-card p-12 rounded-3xl border border-gray-700/50 mb-16">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Mon <span className="gradient-text">processus</span> de travail
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <div key={index} className="text-center group relative">
                  {/* Ligne de connexion */}
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-current to-transparent opacity-30"></div>
                  )}
                  
                  <div className={`w-16 h-16 mx-auto mb-6 glass-card rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 ${step.color}`}>
                    {step.icon}
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-3 group-hover:text-white transition-colors">
                    {step.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>

                  {/* Numéro d'étape */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call-to-action final */}
          <div className="text-center">
            <div className="glass-card p-12 rounded-3xl max-w-4xl mx-auto border border-gray-700/50 hover:border-[#00F5FF]/30 transition-all duration-500 group relative overflow-hidden">
              {/* Effet de fond animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/5 to-[#9D4EDD]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold mb-6 group-hover:text-white transition-colors">
                  Prêt à démarrer votre projet ?
                </h3>
                
                <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto group-hover:text-gray-300 transition-colors">
                  Obtenez un devis personnalisé et gratuit en 24h. Discutons de vos besoins et objectifs pour créer la solution parfaite.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary px-8 py-4 rounded-full text-white font-semibold flex items-center space-x-3 group/btn relative overflow-hidden">
                    <span className="relative z-10">Demander un devis</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  </button>
                  
                  <button className="px-8 py-4 rounded-full border-2 border-[#9D4EDD] text-[#9D4EDD] hover:bg-[#9D4EDD] hover:text-white transition-all duration-300 flex items-center space-x-3">
                    <Play className="w-5 h-5" />
                    <span className="font-semibold">Voir portfolio</span>
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

export default Services;