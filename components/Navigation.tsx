'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Code, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = [
    { id: 'hero', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'services', label: 'Services' },
    { id: 'sectors', label: 'Secteurs' },
    { id: 'projects', label: 'Projets' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
    { id: 'booking', label: 'RDV', href: '/booking' },
  ];

  const socialLinks = [
    { 
      icon: <Github className="w-5 h-5" />, 
      href: "https://github.com/leonceouattarastudio", 
      label: "GitHub",
      color: "hover:text-gray-300"
    },
    { 
      icon: <Linkedin className="w-5 h-5" />, 
      href: "https://linkedin.com/in/company/leonce-ouattara-studio", 
      label: "LinkedIn",
      color: "hover:text-blue-400"
    },
    { 
      icon: <Mail className="w-5 h-5" />, 
      href: "mailto:leonce-ouattara-studio@outlook.com", 
      label: "Email",
      color: "hover:text-[#00F5FF]"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setIsScrolled(scrollTop > 50);
      setScrollProgress(progress);
      
      // Détection de la section active avec offset pour la navigation
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Offset pour la navigation sticky
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Barre de progression du scroll */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] z-[60] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 backdrop-blur-xl bg-[#0A0A0B]/80 border-b border-white/10 shadow-2xl' 
          : 'py-6 bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            
            {/* Logo avec animation */}
            <div 
              className={`flex items-center space-x-3 cursor-pointer group transition-all duration-300 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}
              onClick={() => scrollToSection('hero')}
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 ${
                  isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`} />
                <div className={`relative bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <Code className={`text-white transition-all duration-300 ${
                    isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                  } group-hover:rotate-12`} />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className={`font-bold gradient-text transition-all duration-300 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}>
                  Leonce Ouattara
                </span>
                <span className={`text-gray-400 transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-sm'
                }`}>
                  Studio
                </span>
              </div>
            </div>

            {/* Navigation Desktop */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => item.href ? window.location.href = item.href : scrollToSection(item.id)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 group ${
                      activeSection === item.id 
                        ? 'text-white bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Effet de hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Indicateur de section active */}
                    {activeSection === item.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Réseaux sociaux */}
              <div className="flex items-center space-x-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 ${social.color} hover:scale-110 hover:bg-white/10 group`}
                    title={social.label}
                  >
                    <div className="relative">
                      {social.icon}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Bouton CTA */}
              <button 
                onClick={() => scrollToSection('contact')}
                className="relative px-6 py-2 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full text-white font-medium text-sm overflow-hidden group hover:shadow-lg hover:shadow-[#00F5FF]/25 transition-all duration-300"
              >
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>

            {/* Menu Mobile Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden relative p-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 group"
            >
              <div className="relative w-6 h-6">
                <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
                  <Menu className="w-6 h-6" />
                </div>
                <div className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}>
                  <X className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>

          {/* Menu Mobile */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? 'max-h-screen opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => item.href ? window.location.href = item.href : scrollToSection(item.id)}
                    className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      activeSection === item.id 
                        ? 'text-white bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD]' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    
                    {/* Effet de slide */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  </button>
                ))}
              </div>

              {/* Réseaux sociaux mobile */}
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/10">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full bg-white/5 border border-white/10 transition-all duration-300 ${social.color} hover:scale-110 hover:bg-white/10 group`}
                    title={social.label}
                  >
                    <div className="relative">
                      {social.icon}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </div>
                  </a>
                ))}
              </div>

              {/* CTA Mobile */}
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-xl text-white font-medium overflow-hidden group relative"
              >
                <span className="relative z-10">Prendre contact</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay pour fermer le menu mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;