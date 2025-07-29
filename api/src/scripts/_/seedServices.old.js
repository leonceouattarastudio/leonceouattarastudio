const mongoose = require('mongoose');
const Service = require('../models/Service');
const logger = require('../config/logger');

// Données des services basées sur la section "Mes Services"
const servicesData = [
  {
    name: "Développement Web",
    category: "web-development",
    description: "Applications web modernes et performantes avec React, Next.js et Node.js. Interface utilisateur intuitive et expérience optimisée avec des fonctionnalités avancées.",
    shortDescription: "Applications web modernes avec React, Next.js et Node.js",
    features: [
      "Single Page Applications (SPA)",
      "Progressive Web Apps (PWA)",
      "API REST & GraphQL",
      "Interfaces responsives",
      "Optimisation SEO",
      "Tests automatisés"
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    deliverables: [
      "Code source complet",
      "Documentation technique",
      "Formation utilisateur",
      "Support 3 mois inclus"
    ],
    pricing: {
      basePrice: 2500,
      currency: "EUR",
      priceType: "project",
      customPricing: false
    },
    duration: {
      estimatedHours: 80,
      consultationDuration: 90,
      flexibleDuration: true
    },
    availability: {
      requiresConsultation: true,
      advanceBooking: { min: 48, max: 2160 },
      bufferTime: { before: 30, after: 30 }
    },
    requirements: {
      clientInfo: [
        {
          field: "projectDescription",
          required: true,
          label: "Description du projet",
          placeholder: "Décrivez votre projet web en détail",
          helpText: "Plus vous êtes précis, mieux nous pourrons vous conseiller"
        },
        {
          field: "technicalRequirements",
          required: false,
          label: "Exigences techniques",
          placeholder: "Technologies spécifiques, intégrations...",
          helpText: "Mentionnez toute contrainte technique particulière"
        },
        {
          field: "budget",
          required: true,
          label: "Budget prévisionnel",
          placeholder: "Votre budget pour ce projet",
          helpText: "Cela nous aide à adapter notre proposition"
        },
        {
          field: "timeline",
          required: true,
          label: "Délai souhaité",
          placeholder: "Quand souhaitez-vous lancer le projet ?",
          helpText: "Date de lancement idéale"
        }
      ],
      documents: ["brief", "mockups", "existing-code"],
      preparationSteps: [
        "Préparer un brief détaillé du projet",
        "Rassembler les éléments visuels existants",
        "Lister les fonctionnalités souhaitées",
        "Définir les objectifs business"
      ]
    },
    displayOrder: 1,
    icon: "Code",
    color: {
      primary: "#00F5FF",
      secondary: "#0099CC"
    }
  },
  {
    name: "Applications Mobile",
    category: "mobile-development",
    description: "Développement d'applications mobiles performantes pour iOS et Android avec React Native et Flutter. Applications natives et cross-platform.",
    shortDescription: "Applications mobiles iOS et Android avec React Native et Flutter",
    features: [
      "Applications React Native",
      "Applications Flutter",
      "App Store Optimization",
      "Notifications push",
      "Géolocalisation",
      "Paiements in-app"
    ],
    technologies: ["React Native", "Flutter", "Firebase", "Redux", "Expo", "TypeScript"],
    deliverables: [
      "Apps iOS & Android",
      "Publication stores",
      "Analytics intégrées",
      "Maintenance 6 mois"
    ],
    pricing: {
      basePrice: 3500,
      currency: "EUR",
      priceType: "project",
      customPricing: false
    },
    duration: {
      estimatedHours: 120,
      consultationDuration: 90,
      flexibleDuration: true
    },
    availability: {
      requiresConsultation: true,
      advanceBooking: { min: 72, max: 2160 },
      bufferTime: { before: 30, after: 30 }
    },
    requirements: {
      clientInfo: [
        {
          field: "projectDescription",
          required: true,
          label: "Concept de l'application",
          placeholder: "Décrivez votre idée d'application mobile",
          helpText: "Fonctionnalités principales, public cible, objectifs"
        },
        {
          field: "technicalRequirements",
          required: false,
          label: "Plateformes ciblées",
          placeholder: "iOS, Android, ou les deux ?",
          helpText: "Précisez les versions minimales supportées"
        }
      ],
      documents: ["brief", "mockups", "specifications"],
      preparationSteps: [
        "Définir le concept et les fonctionnalités",
        "Étudier la concurrence",
        "Préparer les wireframes ou mockups",
        "Planifier la stratégie de lancement"
      ]
    },
    displayOrder: 2,
    icon: "Smartphone",
    color: {
      primary: "#9D4EDD",
      secondary: "#7B2CBF"
    }
  },
  {
    name: "Sites E-commerce",
    category: "ecommerce",
    description: "Solutions e-commerce sur mesure avec gestion des paiements, stocks et analytics avancées. Boutiques performantes et sécurisées.",
    shortDescription: "Solutions e-commerce complètes avec paiements et gestion des stocks",
    features: [
      "Boutique Shopify/WooCommerce",
      "Paiements Stripe/PayPal",
      "Gestion des stocks",
      "Analytics avancées",
      "Marketing automation",
      "Multi-devises"
    ],
    technologies: ["Shopify", "WooCommerce", "Stripe", "Analytics", "WordPress", "PHP"],
    deliverables: [
      "Boutique complète",
      "Tunnel de vente",
      "Dashboard admin",
      "Formation e-commerce"
    ],
    pricing: {
      basePrice: 4000,
      currency: "EUR",
      priceType: "project",
      customPricing: false
    },
    duration: {
      estimatedHours: 100,
      consultationDuration: 120,
      flexibleDuration: true
    },
    availability: {
      requiresConsultation: true,
      advanceBooking: { min: 72, max: 2160 },
      bufferTime: { before: 30, after: 30 }
    },
    requirements: {
      clientInfo: [
        {
          field: "projectDescription",
          required: true,
          label: "Type de boutique",
          placeholder: "Produits vendus, modèle économique...",
          helpText: "Décrivez votre activité e-commerce"
        },
        {
          field: "currentSolution",
          required: false,
          label: "Solution actuelle",
          placeholder: "Avez-vous déjà une boutique en ligne ?",
          helpText: "Migration ou création from scratch"
        }
      ],
      documents: ["brief", "analytics", "existing-code"],
      preparationSteps: [
        "Analyser la concurrence",
        "Définir le catalogue produits",
        "Choisir les moyens de paiement",
        "Planifier la logistique"
      ]
    },
    displayOrder: 3,
    icon: "Globe",
    color: {
      primary: "#00F5FF",
      secondary: "#00BFFF"
    }
  },
  {
    name: "Architecture Backend",
    category: "backend-architecture",
    description: "Conception et développement d'architectures backend performantes avec bases de données optimisées et APIs robustes.",
    shortDescription: "Architectures backend performantes avec APIs et bases de données",
    features: [
      "Architecture microservices",
      "Bases de données MongoDB/PostgreSQL",
      "Cache Redis/Elasticsearch",
      "Tests automatisés",
      "Documentation API",
      "Monitoring avancé"
    ],
    technologies: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Redis", "Docker"],
    deliverables: [
      "API complète",
      "Base de données",
      "Documentation",
      "Tests unitaires"
    ],
    pricing: {
      basePrice: 3000,
      currency: "EUR",
      priceType: "project",
      customPricing: false
    },
    duration: {
      estimatedHours: 80,
      consultationDuration: 90,
      flexibleDuration: true
    },
    availability: {
      requiresConsultation: true,
      advanceBooking: { min: 48, max: 2160 },
      bufferTime: { before: 30, after: 30 }
    },
    requirements: {
      clientInfo: [
        {
          field: "technicalRequirements",
          required: true,
          label: "Besoins techniques",
          placeholder: "APIs, bases de données, performances...",
          helpText: "Décrivez vos besoins backend en détail"
        },
        {
          field: "teamSize",
          required: false,
          label: "Taille de l'équipe",
          placeholder: "Combien de développeurs utiliseront l'API ?",
          helpText: "Pour dimensionner l'architecture"
        }
      ],
      documents: ["specifications", "existing-code"],
      preparationSteps: [
        "Analyser les besoins en performance",
        "Définir les endpoints API",
        "Choisir les technologies",
        "Planifier la scalabilité"
      ]
    },
    displayOrder: 4,
    icon: "Database",
    color: {
      primary: "#9D4EDD",
      secondary: "#DA70D6"
    }
  },
  {
    name: "Cloud & DevOps",
    category: "cloud-devops",
    description: "Déploiement et gestion d'infrastructure cloud avec CI/CD et monitoring avancé. Solutions AWS, Azure et GCP.",
    shortDescription: "Infrastructure cloud et DevOps avec CI/CD et monitoring",
    features: [
      "Infrastructure AWS/Azure/GCP",
      "Conteneurisation Docker/Kubernetes",
      "Pipeline CI/CD",
      "Monitoring & alertes",
      "Sauvegardes automatiques",
      "Scalabilité automatique"
    ],
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Prometheus"],
    deliverables: [
      "Infrastructure cloud",
      "Pipeline déploiement",
      "Monitoring setup",
      "Documentation ops"
    ],
    pricing: {
      basePrice: 2000,
      currency: "EUR",
      priceType: "project",
      customPricing: false
    },
    duration: {
      estimatedHours: 60,
      consultationDuration: 90,
      flexibleDuration: true
    },
    availability: {
      requiresConsultation: true,
      advanceBooking: { min: 48, max: 2160 },
      bufferTime: { before: 30, after: 30 }
    },
    requirements: {
      clientInfo: [
        {
          field: "currentSolution",
          required: true,
          label: "Infrastructure actuelle",
          placeholder: "Serveurs, hébergement, outils utilisés...",
          helpText: "Décrivez votre setup actuel"
        },
        {
          field: "technicalRequirements",
          required: true,
          label: "Objectifs DevOps",
          placeholder: "Automatisation, monitoring, scalabilité...",
          helpText: "Quels sont vos objectifs prioritaires ?"
        }
      ],
      documents: ["specifications", "existing-code"],
      preparationSteps: [
        "Auditer l'infrastructure existante",
        "Définir les objectifs de performance",
        "Choisir les outils DevOps",
        "Planifier la migration"
      ]
    },
    displayOrder: 5,
    icon: "Cloud",
    color: {
      primary: "#00F5FF",
      secondary: "#40E0D0"
    }
  },
  {
    name: "Sécurité & Audit",
    category: "security-audit",
    description: "Audit de sécurité complet et mise en conformité RGPD avec monitoring sécurisé et tests d'intrusion.",
    shortDescription: "Audit sécurité et conformité RGPD avec tests d'intrusion",
    features: [
      "Tests d'intrusion",
      "Chiffrement des données",
      "Conformité RGPD",
      "Monitoring sécurisé",
      "Authentification 2FA",
      "Audit de code"
    ],
    technologies: ["Security Tools", "OWASP", "SSL/TLS", "Compliance", "Penetration Testing"],
    deliverables: [
      "Rapport d'audit",
      "Plan de sécurisation",
      "Mise en conformité",
      "Formation sécurité"
    ],
    pricing: {
      basePrice: 1500,
      currency: "EUR",
      priceType: "project",
      customPricing: false
    },
    duration: {
      estimatedHours: 40,
      consultationDuration: 60,
      flexibleDuration: false
    },
    availability: {
      requiresConsultation: true,
      advanceBooking: { min: 24, max: 1440 },
      bufferTime: { before: 15, after: 15 }
    },
    requirements: {
      clientInfo: [
        {
          field: "currentSolution",
          required: true,
          label: "Système à auditer",
          placeholder: "Application, site web, infrastructure...",
          helpText: "Décrivez ce qui doit être audité"
        },
        {
          field: "technicalRequirements",
          required: false,
          label: "Contraintes spécifiques",
          placeholder: "Conformité, certifications requises...",
          helpText: "Normes ou certifications à respecter"
        }
      ],
      documents: ["specifications", "existing-code"],
      preparationSteps: [
        "Identifier les assets critiques",
        "Définir le périmètre d'audit",
        "Préparer les accès nécessaires",
        "Planifier les tests"
      ]
    },
    displayOrder: 6,
    icon: "Shield",
    color: {
      primary: "#9D4EDD",
      secondary: "#8A2BE2"
    }
  },
  {
    name: "Consultation Stratégique",
    category: "consulting",
    description: "Conseil stratégique en transformation digitale, choix technologiques et optimisation des processus métier.",
    shortDescription: "Conseil stratégique en transformation digitale et technologies",
    features: [
      "Audit technologique",
      "Stratégie digitale",
      "Choix d'architecture",
      "Optimisation processus",
      "Formation équipes",
      "Accompagnement projet"
    ],
    technologies: ["Méthodologies Agile", "Architecture", "Strategy", "Process Optimization"],
    deliverables: [
      "Rapport d'audit",
      "Stratégie digitale",
      "Roadmap technique",
      "Plan de formation"
    ],
    pricing: {
      basePrice: 150,
      currency: "EUR",
      priceType: "hourly",
      customPricing: false
    },
    duration: {
      estimatedHours: 4,
      consultationDuration: 60,
      flexibleDuration: true
    },
    availability: {
      requiresConsultation: false,
      advanceBooking: { min: 24, max: 720 },
      bufferTime: { before: 15, after: 15 }
    },
    requirements: {
      clientInfo: [
        {
          field: "company",
          required: true,
          label: "Entreprise",
          placeholder: "Nom de votre entreprise",
          helpText: "Pour adapter le conseil à votre contexte"
        },
        {
          field: "projectDescription",
          required: true,
          label: "Problématique",
          placeholder: "Décrivez votre problématique ou objectif",
          helpText: "Plus c'est précis, plus le conseil sera pertinent"
        },
        {
          field: "teamSize",
          required: false,
          label: "Taille de l'équipe",
          placeholder: "Combien de personnes dans votre équipe tech ?",
          helpText: "Pour adapter les recommandations"
        }
      ],
      documents: ["brief", "specifications"],
      preparationSteps: [
        "Préparer les questions spécifiques",
        "Rassembler la documentation existante",
        "Définir les objectifs de la consultation",
        "Préparer le contexte business"
      ]
    },
    displayOrder: 7,
    icon: "Users",
    color: {
      primary: "#00BFFF",
      secondary: "#1E90FF"
    }
  }
];

// Fonction pour initialiser les services
const seedServices = async () => {
  try {
    // Vérifier si des services existent déjà
    const existingServices = await Service.countDocuments();
    
    if (existingServices > 0) {
      logger.info(`${existingServices} services already exist. Skipping seed.`);
      return;
    }

    // Créer les services
    const services = await Service.insertMany(servicesData);
    
    logger.info(`Successfully seeded ${services.length} services`);
    
    // Afficher un résumé
    services.forEach(service => {
      logger.info(`- ${service.name} (${service.category}) - ${service.formattedPrice}`);
    });

  } catch (error) {
    logger.error('Error seeding services:', error);
    throw error;
  }
};

// Fonction pour mettre à jour les services existants
const updateServices = async () => {
  try {
    for (const serviceData of servicesData) {
      await Service.findOneAndUpdate(
        { category: serviceData.category },
        serviceData,
        { upsert: true, new: true }
      );
    }
    
    logger.info('Services updated successfully');
  } catch (error) {
    logger.error('Error updating services:', error);
    throw error;
  }
};

module.exports = {
  seedServices,
  updateServices,
  servicesData
};

// Exécuter le script si appelé directement
if (require.main === module) {
  const connectDB = require('../config/database');
  
  connectDB().then(async () => {
    try {
      await seedServices();
      process.exit(0);
    } catch (error) {
      logger.error('Seed failed:', error);
      process.exit(1);
    }
  });
}