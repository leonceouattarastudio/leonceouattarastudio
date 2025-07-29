'use client';

import { 
  Code, 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  Heart,
  ExternalLink,
  Globe,
  Hotel,
  Home,
  Briefcase,
  Smartphone,
  Database,
  Cloud,
  Shield
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Accueil', href: '#hero' },
    { name: 'À propos', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    { name: 'Développement Web', href: '#services', icon: <Code className="w-4 h-4" /> },
    { name: 'Applications Mobile', href: '#services', icon: <Smartphone className="w-4 h-4" /> },
    { name: 'Sites E-commerce', href: '#services', icon: <Globe className="w-4 h-4" /> },
    { name: 'Architecture Backend', href: '#services', icon: <Database className="w-4 h-4" /> },
    { name: 'Cloud & DevOps', href: '#services', icon: <Cloud className="w-4 h-4" /> },
    { name: 'Sécurité & Audit', href: '#services', icon: <Shield className="w-4 h-4" /> }
  ];

  const sectors = [
    { name: 'Hôtellerie & Restauration', href: '#sectors', icon: <Hotel className="w-4 h-4" /> },
    { name: 'Immobilier', href: '#sectors', icon: <Home className="w-4 h-4" /> },
    { name: 'Entrepreneurs & PME', href: '#sectors', icon: <Briefcase className="w-4 h-4" /> }
  ];

  const legalLinks = [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/politique-confidentialite' },
    { name: 'Conditions générales', href: '/conditions-generales' },
    { name: 'RGPD', href: '/rgpd' }
  ];

  const socialLinks = [
    { 
      icon: <Github className="w-5 h-5" />, 
      href: "https://github.com/leonce-ouattara/", 
      label: "GitHub",
      color: "hover:text-gray-300"
    },
    { 
      icon: <Linkedin className="w-5 h-5" />, 
      href: "https://www.linkedin.com/in/leonce-ouattara/", 
      label: "LinkedIn",
      color: "hover:text-blue-400"
    },
    { 
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>, 
      href: "https://x.com/Sacerdoceroyalv", 
      label: "Twitter X",
      color: "hover:text-blue-400"
    }
  ];

  return (
    <>
      <footer className="relative bg-[#0A0A0B] border-t border-gray-800/50 overflow-hidden">
        {/* Contenu principal du footer */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
              
              {/* Informations principales */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl blur-md opacity-50"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-bold gradient-text">Leonce Ouattara</span>
                    <div className="text-gray-400 text-sm">Studio</div>
                  </div>
                </div>
                
                <p className="text-gray-400 leading-relaxed max-w-md">
                  Expert IT passionné par la création de solutions digitales innovantes. 
                  Spécialisé dans le développement web moderne et les architectures scalables 
                  pour transformer votre vision en réalité digitale.
                </p>
                
                {/* Coordonnées avec glassmorphisme */}
                <div className="glass-card p-6 rounded-2xl border border-gray-700/50 space-y-4">
                  <div className="flex items-center space-x-3 text-gray-400 hover:text-[#00F5FF] transition-colors group">
                    <Mail className="w-5 h-5 text-[#00F5FF] group-hover:scale-110 transition-transform" />
                    <span>leonce.ouattara@outlook.fr</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400 hover:text-[#00F5FF] transition-colors group">
                    <Phone className="w-5 h-5 text-[#00F5FF] group-hover:scale-110 transition-transform" />
                    <span>+225 05 45 13 07 39</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400 hover:text-[#00F5FF] transition-colors group">
                    <MapPin className="w-5 h-5 text-[#00F5FF] group-hover:scale-110 transition-transform" />
                    <span>Abidjan, Côte d'Ivoire</span>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 glass-card rounded-xl border border-gray-700/50 transition-all hover:scale-110 hover:border-[#00F5FF]/50 ${social.color} group`}
                      title={social.label}
                    >
                      <div className="relative">
                        {social.icon}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6 relative">
                  Services
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#00F5FF] to-transparent"></div>
                </h3>
                <ul className="space-y-3">
                  {services.map((service, index) => (
                    <li key={index}>
                      <a 
                        href={service.href}
                        className="flex items-center space-x-3 text-gray-400 hover:text-[#00F5FF] transition-all duration-300 group"
                      >
                        <div className="text-[#00F5FF] group-hover:scale-110 transition-transform">
                          {service.icon}
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform">
                          {service.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secteurs d'expertise */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6 relative">
                  Secteurs d'Expertise
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#9D4EDD] to-transparent"></div>
                </h3>
                <ul className="space-y-3">
                  {sectors.map((sector, index) => (
                    <li key={index}>
                      <a 
                        href={sector.href}
                        className="flex items-center space-x-3 text-gray-400 hover:text-[#9D4EDD] transition-all duration-300 group"
                      >
                        <div className="text-[#9D4EDD] group-hover:scale-110 transition-transform">
                          {sector.icon}
                        </div>
                        <span className="group-hover:translate-x-1 transition-transform">
                          {sector.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mentions légales et Newsletter */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 relative">
                    Mentions Légales
                    <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#00BFFF] to-transparent"></div>
                  </h3>
                  <ul className="space-y-3">
                    {legalLinks.map((link, index) => (
                      <li key={index}>
                        <a 
                          href={link.href}
                          className="text-gray-400 hover:text-[#00BFFF] transition-colors flex items-center space-x-2 group"
                        >
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{link.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
                  <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Recevez mes derniers articles et conseils tech
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:border-[#00F5FF] focus:outline-none text-white text-sm backdrop-blur-sm"
                    />
                    <button className="w-full btn-primary py-3 rounded-xl text-white font-medium text-sm hover:shadow-lg transition-all">
                      S'abonner
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Pas de spam. Désabonnement en 1 clic.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur avec effet glassmorphisme */}
          <div className="border-t border-gray-800/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                
                {/* Copyright avec effet glassmorphisme */}
                <div className="glass-card px-6 py-3 rounded-full border border-gray-700/30">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>© {currentYear} L... Fait à Abidjan</span>
                    <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                </div>

                {/* Statut et technologies */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-gray-700/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full pulse-animation"></div>
                    <span className="text-gray-400">Disponible pour nouveaux projets</span>
                  </div>
                </div>
              </div>

              {/* Ligne de navigation rapide */}
              <div className="flex justify-center mt-6 pt-6 border-t border-gray-800/30">
                <div className="flex items-center space-x-8">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-gray-400 hover:text-[#00F5FF] transition-colors text-sm font-medium"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Texte "LEONCE OUATTARA STUDIO" en bas de page - visible à 100% */}
        <div className="relative border-t border-gray-800/30 py-8 overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] bg-clip-text text-transparent select-none animate-pulse">
              LEONCE OUATTARA STUDIO
            </div>
          </div>
        </div>

        {/* Particules de fond */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={`footer-particle-${i}`}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 4 + 3}s`
              }}
            >
              <div 
                className="w-1 h-1 rounded-full opacity-30"
                style={{
                  backgroundColor: Math.random() > 0.5 ? '#00F5FF' : '#9D4EDD'
                }}
              />
            </div>
          ))}
        </div>
      </footer>

      {/* Bouton retour en haut flottant avec glassmorphisme */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-32 right-8 p-4 glass-card border border-[#00F5FF]/30 rounded-full hover:border-[#00F5FF]/60 transition-all hover:scale-110 shadow-2xl group z-40"
        title="Retour en haut"
      >
        <ArrowUp className="w-6 h-6 text-[#00F5FF] group-hover:text-white transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </button>
    </>
  );
};

export default Footer;