'use client';

import { useEffect, useState } from 'react';
import { 
  ExternalLink, 
  Github, 
  Code, 
  Smartphone, 
  Globe,
  ArrowRight,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Eye
} from 'lucide-react';
import ProjectModal from './projects/ProjectModal';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('projects');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      id: 1,
      title: "HotelBooking Pro",
      category: "Hôtellerie",
      description: "Plateforme complète de réservation hôtelière avec gestion des disponibilités en temps réel",
      image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800",
      stack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Stripe"],
      features: [
        "Réservations en temps réel",
        "Paiements sécurisés",
        "Dashboard analytics",
        "API mobile-first",
        "Notifications automatiques",
        "Gestion multi-hôtels"
      ],
      results: "+40% de réservations directes",
      duration: "3 mois",
      year: "2024",
      type: "Web App",
      githubUrl: "https://github.com",
      liveUrl: "https://demo.com",
      color: "from-blue-500 to-cyan-500",
      client: {
        name: "Marie Dubois",
        company: "Hôtel Le Moderne",
        testimonial: "Grâce à cette solution, notre taux de réservations directes a augmenté de 40% et nous avons réduit nos commissions OTA de manière significative.",
        rating: 5
      },
      caseStudy: {
        challenge: "L'hôtel Le Moderne faisait face à une forte dépendance aux plateformes de réservation tierces (Booking.com, Expedia) qui prélevaient des commissions importantes (15-20%). Le système de réservation existant était obsolète et ne permettait pas de gérer efficacement les disponibilités en temps réel, causant des surbookings fréquents.",
        solution: "Développement d'une plateforme de réservation moderne avec un moteur de disponibilités en temps réel, intégration de paiements sécurisés, et un système de gestion centralisé. L'accent a été mis sur l'expérience utilisateur pour encourager les réservations directes.",
        implementation: "Utilisation de Next.js pour une interface rapide et SEO-friendly, Node.js avec Redis pour la gestion temps réel des disponibilités, PostgreSQL pour les données persistantes, et Stripe pour les paiements sécurisés. Mise en place d'un système de notifications automatiques et d'un dashboard analytics complet.",
        results: [
          "Augmentation de 40% des réservations directes",
          "Réduction de 60% des commissions OTA",
          "Élimination complète des surbookings",
          "Amélioration de 35% de la satisfaction client",
          "ROI de 300% en 6 mois"
        ],
        metrics: [
          { name: "Réservations directes", value: "+40%", description: "Augmentation vs année précédente" },
          { name: "Temps de réservation", value: "2 min", description: "Moyenne par réservation" },
          { name: "Taux de conversion", value: "12%", description: "Visiteurs → Réservations" }
        ],
        lessons: [
          "L'importance d'une UX fluide pour réduire l'abandon de panier dans l'hôtellerie",
          "La gestion temps réel des disponibilités est cruciale pour éviter les surbookings",
          "Les notifications automatiques améliorent significativement l'expérience client",
          "Un bon SEO peut réduire la dépendance aux OTA"
        ]
      }
    },
    {
      id: 2,
      title: "ImmoConnect",
      category: "Immobilier",
      description: "CRM immobilier avec intégration MLS et outils de prospection automatisée",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
      stack: ["React", "Python", "MongoDB", "AWS", "WebRTC"],
      features: [
        "Gestion des annonces",
        "Visites virtuelles",
        "CRM avancé",
        "Reporting automatique",
        "Prospection automatisée",
        "Intégration MLS"
      ],
      results: "+65% de productivité",
      duration: "4 mois",
      year: "2024",
      type: "SaaS Platform",
      githubUrl: "https://github.com",
      liveUrl: "https://demo.com",
      color: "from-purple-500 to-violet-500",
      client: {
        name: "Jean-Pierre Martin",
        company: "Century 21 Prestige",
        testimonial: "Cette plateforme a révolutionné notre façon de travailler. Nous avons doublé notre productivité et nos clients adorent les visites virtuelles.",
        rating: 5
      },
      caseStudy: {
        challenge: "L'agence Century 21 Prestige utilisait plusieurs outils disparates pour gérer ses annonces, ses clients et ses visites. Cette fragmentation causait des pertes de temps importantes, des doublons dans les données, et une expérience client dégradée. Les agents passaient plus de temps en administration qu'en prospection.",
        solution: "Création d'une plateforme CRM unifiée intégrant la gestion d'annonces, les visites virtuelles WebRTC, la prospection automatisée, et les rapports en temps réel. Intégration avec les systèmes MLS existants pour synchroniser automatiquement les données.",
        implementation: "Frontend React pour une interface moderne et responsive, backend Python avec FastAPI pour les performances, MongoDB pour la flexibilité des données immobilières, AWS pour l'infrastructure cloud, et WebRTC pour les visites virtuelles haute qualité.",
        results: [
          "Augmentation de 65% de la productivité des agents",
          "Réduction de 50% du temps administratif",
          "Augmentation de 80% des visites virtuelles",
          "Amélioration de 45% de la satisfaction client",
          "Croissance de 30% du chiffre d'affaires"
        ],
        metrics: [
          { name: "Productivité agents", value: "+65%", description: "Gain de temps quotidien" },
          { name: "Visites virtuelles", value: "200+", description: "Par mois en moyenne" },
          { name: "Temps de réponse", value: "< 2h", description: "Réponse aux prospects" }
        ],
        lessons: [
          "L'unification des outils métier génère des gains de productivité exponentiels",
          "Les visites virtuelles sont devenues indispensables dans l'immobilier moderne",
          "L'automatisation de la prospection libère du temps pour la relation client",
          "L'intégration MLS évite la ressaisie et les erreurs"
        ]
      }
    },
    {
      id: 3,
      title: "EcoShop",
      category: "E-commerce",
      description: "Marketplace écologique avec système de recommandations IA et logistique verte",
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
      stack: ["Vue.js", "Django", "PostgreSQL", "Docker", "AI/ML"],
      features: [
        "Recommandations IA",
        "Paiements multiples",
        "Logistique optimisée",
        "App mobile native",
        "Calcul empreinte carbone",
        "Programme de fidélité vert"
      ],
      results: "+120% de conversion",
      duration: "5 mois",
      year: "2023",
      type: "E-commerce",
      githubUrl: "https://github.com",
      liveUrl: "https://demo.com",
      color: "from-green-500 to-emerald-500",
      client: {
        name: "Sophie Laurent",
        company: "EcoVert Marketplace",
        testimonial: "Le système de recommandations IA a transformé notre business. Nos clients trouvent exactement ce qu'ils cherchent et notre taux de conversion a explosé.",
        rating: 5
      },
      caseStudy: {
        challenge: "EcoVert Marketplace voulait se différencier dans le secteur e-commerce saturé en se positionnant sur l'écologie. Le défi était de créer une expérience d'achat engageante tout en sensibilisant les consommateurs à l'impact environnemental de leurs achats. Le taux de conversion était faible (2%) et les clients avaient du mal à découvrir des produits pertinents.",
        solution: "Développement d'une marketplace avec un système de recommandations IA basé sur les préférences écologiques, un calculateur d'empreinte carbone en temps réel, et un programme de fidélité récompensant les achats responsables. Optimisation de la logistique pour réduire l'impact environnemental.",
        implementation: "Vue.js pour une interface utilisateur moderne, Django REST Framework pour l'API, PostgreSQL pour les données relationnelles, algorithmes de machine learning pour les recommandations, et Docker pour le déploiement. Intégration d'APIs de calcul carbone et de solutions de livraison verte.",
        results: [
          "Augmentation de 120% du taux de conversion",
          "Croissance de 200% du panier moyen",
          "Réduction de 30% de l'empreinte carbone logistique",
          "Fidélisation de 85% des clients",
          "Expansion à 5 nouveaux pays"
        ],
        metrics: [
          { name: "Taux de conversion", value: "4.4%", description: "Vs 2% initialement" },
          { name: "Panier moyen", value: "89€", description: "Augmentation de 200%" },
          { name: "Score satisfaction", value: "4.8/5", description: "Avis clients moyens" }
        ],
        lessons: [
          "L'IA de recommandation doit être transparente pour gagner la confiance",
          "Les consommateurs sont prêts à payer plus pour des produits écologiques",
          "La gamification de l'écologie augmente l'engagement",
          "La logistique verte est un avantage concurrentiel majeur"
        ]
      }
    }
  ];

  const stats = [
    {
      icon: <Code className="w-8 h-8" />,
      value: "50+",
      label: "Projets terminés",
      color: "text-[#00F5FF]"
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "100%",
      label: "Satisfaction client",
      color: "text-[#9D4EDD]"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "5+",
      label: "Années d'expérience",
      color: "text-[#00F5FF]"
    }
  ];

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-6">
              Mes <span className="gradient-text">projets</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Découvrez une sélection de mes réalisations récentes, des solutions innovantes qui ont transformé les entreprises de mes clients.
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 rounded-2xl text-center">
                <div className={`${stat.color} mb-4 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Projets principaux */}
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div key={project.id} className={`project-card glass-card p-8 rounded-2xl border border-gray-700 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex gap-8 items-center`}>
                
                {/* Image du projet */}
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-4">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#00F5FF] rounded-full hover:bg-[#0099CC] transition-colors">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </a>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#9D4EDD] rounded-full hover:bg-[#7B2CBF] transition-colors">
                          <Github className="w-6 h-6 text-white" />
                        </a>
                        <button 
                          onClick={() => {
                            setSelectedProject(project);
                            setIsModalOpen(true);
                          }}
                          className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                        >
                          <FileText className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu du projet */}
                <div className="lg:w-1/2 space-y-6">
                  <div>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded-full text-sm">
                        {project.category}
                      </span>
                      <span className="text-gray-500 text-sm">{project.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                  </div>

                  {/* Infos projet */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-[#00F5FF]" />
                        <span className="text-sm text-gray-300">Durée</span>
                      </div>
                      <p className="text-sm text-gray-400">{project.duration}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-[#9D4EDD]" />
                        <span className="text-sm text-gray-300">Type</span>
                      </div>
                      <p className="text-sm text-gray-400">{project.type}</p>
                    </div>
                  </div>

                  {/* Stack technique */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-300">Stack technique</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-300">Fonctionnalités clés</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {project.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-[#00F5FF] rounded-full"></div>
                          <span className="text-sm text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Résultats */}
                  <div className="bg-gradient-to-r from-[#00F5FF]/10 to-[#9D4EDD]/10 p-4 rounded-xl">
                    <h4 className="text-sm font-semibold mb-2 text-[#00F5FF]">Résultats obtenus</h4>
                    <p className="text-white font-medium">{project.results}</p>
                  </div>

                  {/* Bouton étude de cas */}
                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        setSelectedProject(project);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Voir l'étude de cas</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call-to-action */}
          <div className="text-center mt-16">
            <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Intéressé par mon travail ?</h3>
              <p className="text-gray-400 mb-6">
                Explorez tous mes projets sur GitHub ou contactez-moi pour discuter de votre idée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary px-6 py-3 rounded-full text-white font-medium flex items-center space-x-2 hover:shadow-lg transition-all">
                  <Github className="w-5 h-5" />
                  <span>Voir GitHub</span>
                </button>
                <button className="px-6 py-3 rounded-full border border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-white transition-all flex items-center space-x-2">
                  <span>Démarrer un projet</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </section>
  );
};

export default Projects;