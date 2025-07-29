'use client';

import { useEffect, useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    project: '',
    message: '',
    rgpd: false
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('contact');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    // Simulation d'envoi
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        budget: '',
        project: '',
        message: '',
        rgpd: false
      });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      value: "leonce.ouattara@outlook.fr",
      link: "mailto:leonce.ouattara@outlook.fr"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      value: "+225 05 45 13 07 39",
      link: "tel:+22505451307390"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Localisation",
      value: "Abidjan, Côte d'Ivoire",
      link: "https://maps.google.com"
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="w-6 h-6" />,
      name: "GitHub",
      url: "https://github.com/leonce-ouattara/",
      color: "hover:text-gray-400"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/leonce-ouattara/",
      color: "hover:text-blue-400"
    },
    {
      icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>,
      name: "Twitter X",
      url: "https://x.com/Sacerdoceroyalv",
      color: "hover:text-blue-400"
    }
  ];

  const availability = [
    { day: "Lundi - Vendredi", time: "9h00 - 18h00" },
    { day: "Samedi", time: "10h00 - 16h00" },
    { day: "Dimanche", time: "Fermé" }
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <h2 className="section-title text-3xl md:text-4xl font-bold mb-6">
              Contactez-<span className="gradient-text">moi</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Vous avez un projet en tête ? Discutons-en ! Je suis disponible pour de nouvelles collaborations et toujours ravi d'échanger sur vos idées.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Informations de contact */}
            <div className="lg:col-span-1 space-y-8">
              {/* Coordonnées */}
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6">Mes coordonnées</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <a 
                      key={index}
                      href={info.link}
                      className="flex items-center space-x-4 hover:text-[#00F5FF] transition-colors group"
                    >
                      <div className="text-[#00F5FF] group-hover:scale-110 transition-transform">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{info.title}</p>
                        <p className="font-medium">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Disponibilités */}
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#9D4EDD]" />
                  <span>Disponibilités</span>
                </h3>
                <div className="space-y-4">
                  {availability.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{slot.day}</span>
                      <span className="text-[#00F5FF] font-medium">{slot.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full pulse-animation"></div>
                    <span className="text-sm text-gray-400">Statut actuel</span>
                  </div>
                  <p className="text-green-400 font-medium">Disponible pour nouveaux projets</p>
                  <a 
                    href="/booking"
                    className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-[#00F5FF]/20 text-[#00F5FF] rounded-lg hover:bg-[#00F5FF]/30 transition-colors text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Réserver un créneau</span>
                  </a>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-6">Suivez-moi</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 glass-card rounded-full transition-all hover:scale-110 ${social.color}`}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Démarrons votre projet</h3>
                
                {formStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-green-400">Merci ! Votre message a été envoyé avec succès.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Entreprise</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white"
                        placeholder="Nom de votre entreprise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget estimé</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white"
                      >
                        <option value="">Sélectionnez un budget</option>
                        <option value="1000-5000">1 000€ - 5 000€</option>
                        <option value="5000-10000">5 000€ - 10 000€</option>
                        <option value="10000-20000">10 000€ - 20 000€</option>
                        <option value="20000+">20 000€+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Type de projet *</label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white"
                    >
                      <option value="">Sélectionnez un type de projet</option>
                      <option value="website">Site web vitrine</option>
                      <option value="ecommerce">Site e-commerce</option>
                      <option value="webapp">Application web</option>
                      <option value="mobile">Application mobile</option>
                      <option value="api">API / Backend</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white resize-none"
                      placeholder="Décrivez votre projet, vos besoins, vos objectifs..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="rgpd"
                      id="rgpd"
                      checked={formData.rgpd}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4 text-[#00F5FF] bg-gray-800 border-gray-600 rounded focus:ring-[#00F5FF] focus:ring-2"
                    />
                    <label htmlFor="rgpd" className="text-sm text-gray-400">
                      J'accepte que mes données soient utilisées pour répondre à ma demande. 
                      <a href="#" className="text-[#00F5FF] hover:underline"> Politique de confidentialité</a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'sending' || !formData.rgpd}
                    className="w-full btn-primary py-3 rounded-lg text-white font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Prise de rendez-vous */}
              <div className="glass-card p-8 rounded-2xl mt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-[#9D4EDD]" />
                  <span>Ou prenez rendez-vous directement</span>
                </h3>
                <p className="text-gray-400 mb-6">
                  Préférez-vous discuter de vive voix ? Réservez un créneau de 30 minutes gratuit pour échanger sur votre projet.
                </p>
                <a href="/booking" className="btn-primary px-6 py-3 rounded-lg text-white font-medium flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Réserver un créneau</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;