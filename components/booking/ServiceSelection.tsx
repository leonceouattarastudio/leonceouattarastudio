'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Euro, Star, ChevronRight, Code, Smartphone, Globe, Database, Cloud, Shield, Users, Check } from 'lucide-react';
import { Service } from './AppointmentBooking';

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
  selectedService: Service | null;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  onServiceSelect,
  selectedService
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const categories = [
    { id: 'web-development', label: 'Développement Web', icon: <Code className="w-5 h-5" /> },
    { id: 'mobile-development', label: 'Applications Mobile', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'ecommerce', label: 'E-commerce', icon: <Globe className="w-5 h-5" /> },
    { id: 'backend-architecture', label: 'Architecture Backend', icon: <Database className="w-5 h-5" /> },
    { id: 'cloud-devops', label: 'Cloud & DevOps', icon: <Cloud className="w-5 h-5" /> },
    { id: 'security-audit', label: 'Sécurité & Audit', icon: <Shield className="w-5 h-5" /> },
    { id: 'consulting', label: 'Consultation', icon: <Users className="w-5 h-5" /> }
  ];

  const priceRanges = [
    { id: 'under-2000', label: 'Moins de 2 000€', min: 0, max: 2000 },
    { id: '2000-3000', label: '2 000€ - 3 000€', min: 2000, max: 3000 },
    { id: '3000-4000', label: '3 000€ - 4 000€', min: 3000, max: 4000 },
    { id: 'over-4000', label: 'Plus de 4 000€', min: 4000, max: Infinity }
  ];

  const durationRanges = [
    { id: 'short', label: 'Court (< 60h)', max: 60 },
    { id: 'medium', label: 'Moyen (60-100h)', min: 60, max: 100 },
    { id: 'long', label: 'Long (> 100h)', min: 100 }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory, selectedPriceRange, selectedDuration]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/v1/services');
      const result = await response.json();
      
      if (result.success) {
        setServices(result.data.services);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    } finally {
      setIsLoading(false);
    }
  }; 

  
  const filterServices = () => {
    let filtered = [...services];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filtre par prix
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.id === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(service => {
          const price = service.pricing.basePrice;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // Filtre par durée
    if (selectedDuration) {
      const range = durationRanges.find(r => r.id === selectedDuration);
      if (range) {
        filtered = filtered.filter(service => {
          const hours = service.duration.estimatedHours;
          return (!range.min || hours >= range.min) && (!range.max || hours <= range.max);
        });
      }
    }

    setFilteredServices(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedPriceRange('');
    setSelectedDuration('');
  };

  const getServiceIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Code': <Code className="w-8 h-8" />,
      'Smartphone': <Smartphone className="w-8 h-8" />,
      'Globe': <Globe className="w-8 h-8" />,
      'Database': <Database className="w-8 h-8" />,
      'Cloud': <Cloud className="w-8 h-8" />,
      'Shield': <Shield className="w-8 h-8" />,
      'Users': <Users className="w-8 h-8" />
    };
    return icons[iconName] || <Code className="w-8 h-8" />;
  };

  const formatPrice = (service: Service) => {
    if (service.pricing.customPricing) {
      return 'Sur devis';
    }
    
    const price = service.pricing.basePrice.toLocaleString('fr-FR');
    if (service.pricing.priceType === 'hourly') {
      return `${price}€/h`;
    }
    return `À partir de ${price}€`;
  };

  const formatDuration = (service: Service) => {
    const hours = service.duration.estimatedHours;
    if (hours < 8) {
      return `${hours}h`;
    }
    const days = Math.ceil(hours / 8);
    return `${days} jour${days > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00F5FF]/30 rounded-full animate-spin mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-transparent border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">Chargement des services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choisissez votre service</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Sélectionnez le service qui correspond à vos besoins. Chaque service inclut une consultation personnalisée.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl border border-gray-700/50">
        <div className="space-y-6">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl focus:border-[#00F5FF] focus:outline-none text-white placeholder-gray-400"
            />
          </div>

          {/* Filter Categories */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Catégorie</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Toutes les catégories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id 
                        ? 'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category.icon}
                    <span className="text-sm">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Budget</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPriceRange('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedPriceRange === '' 
                      ? 'bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Tous les budgets
                </button>
                {priceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedPriceRange === range.id 
                        ? 'bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-sm">{range.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Durée estimée</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedDuration('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedDuration === '' 
                      ? 'bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30' 
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Toutes les durées
                </button>
                {durationRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedDuration(range.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedDuration === range.id 
                        ? 'bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-sm">{range.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory || selectedPriceRange || selectedDuration) && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedService?.id === service.id 
                ? 'scale-105 z-10' 
                : 'hover:scale-102'
            }`}
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
            onClick={() => onServiceSelect(service)}
          >
            {/* Service Card */}
            <div className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 ${
              selectedService?.id === service.id
                ? 'border-[#00F5FF] shadow-lg shadow-[#00F5FF]/20'
                : 'border-gray-700/50 hover:border-[#00F5FF]/30'
            }`}>
              
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      background: `linear-gradient(135deg, ${service.color.primary}, ${service.color.secondary})` 
                    }}
                  >
                    {getServiceIcon(service.icon)}
                  </div>
                  
                  {service.pricing.priceType === 'hourly' && (
                    <div className="px-3 py-1 bg-[#9D4EDD]/20 text-[#9D4EDD] rounded-full text-sm">
                      Horaire
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00F5FF] transition-colors">
                  {service.name}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {service.shortDescription}
                </p>

                {/* Price and Duration */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Euro className="w-4 h-4 text-[#00F5FF]" />
                    <span className="font-bold text-[#00F5FF]">
                      {formatPrice(service)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#9D4EDD]" />
                    <span className="text-sm text-gray-300">
                      {formatDuration(service)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="px-6 pb-4">
                <div className="space-y-2">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{service.features.length - 3} autres fonctionnalités
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies */}
              <div className="px-6 pb-6">
                <div className="flex flex-wrap gap-2">
                  {service.technologies.slice(0, 4).map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-800/50 text-gray-300 rounded text-xs border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {service.technologies.length > 4 && (
                    <span className="px-2 py-1 bg-gray-800/50 text-gray-400 rounded text-xs">
                      +{service.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6">
                <button className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  selectedService?.id === service.id
                    ? 'bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-600 hover:border-[#00F5FF]/50'
                }`}>
                  <span>
                    {selectedService?.id === service.id ? 'Service sélectionné' : 'Sélectionner ce service'}
                  </span>
                  {selectedService?.id === service.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>

              {/* Selection Indicator */}
              {selectedService?.id === service.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-[#00F5FF] rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Description Tooltip */}
            {hoveredService === service.id && (
              <div className="absolute top-0 left-full ml-4 w-80 z-20 pointer-events-none">
                <div className="glass-card p-6 rounded-2xl border border-[#00F5FF]/30 shadow-2xl">
                  <h4 className="font-bold text-lg mb-3 text-[#00F5FF]">{service.name}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-sm text-gray-200 mb-2">Fonctionnalités incluses :</h5>
                      <div className="space-y-1">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-[#00F5FF] rounded-full" />
                            <span className="text-xs text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-sm text-gray-200 mb-2">Livrables :</h5>
                      <div className="space-y-1">
                        {service.deliverables.map((deliverable, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Star className="w-3 h-3 text-[#9D4EDD]" />
                            <span className="text-xs text-gray-300">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <div className="text-center py-20">
          <div className="glass-card p-12 rounded-2xl max-w-md mx-auto">
            <Filter className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun service trouvé</h3>
            <p className="text-gray-400 mb-6">
              Essayez de modifier vos critères de recherche ou supprimez certains filtres.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#00F5FF] text-white rounded-lg hover:bg-[#0099CC] transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      )}

      {/* Service Count */}
      <div className="text-center text-gray-500 text-sm">
        {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default ServiceSelection;