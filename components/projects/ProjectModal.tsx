'use client';

import React, { useEffect } from 'react';
import { X, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin, Link2, Eye, Heart, MessageCircle, ExternalLink, Github, Star, Award, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  stack: string[];
  features: string[];
  results: string;
  duration: string;
  year: string;
  type: string;
  githubUrl: string;
  liveUrl: string;
  color: string;
  client?: {
    name: string;
    company: string;
    testimonial?: string;
    rating?: number;
  };
  caseStudy: {
    challenge: string;
    solution: string;
    implementation: string;
    results: string[];
    metrics: {
      name: string;
      value: string;
      description: string;
    }[];
    lessons: string[];
  };
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const shareUrl = `${window.location.origin}/projects/${project.id}`;
  const shareTitle = `Découvrez le projet ${project.title} par Leonce Ouattara`;

  const handleShare = (platform: string) => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        return;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-[95vh] max-w-6xl mx-4 my-4 bg-[#0A0A0B] rounded-2xl border border-gray-700/50 overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#0A0A0B]/95 backdrop-blur-sm border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-[#00F5FF]/20 text-[#00F5FF] rounded-full text-sm">
              {project.category}
            </span>
            <span className="px-3 py-1 bg-[#9D4EDD]/20 text-[#9D4EDD] rounded-full text-sm">
              {project.type}
            </span>
            <span className="text-sm text-gray-400">{project.year}</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(95vh-80px)] overflow-y-auto">
          <div className="p-8">
            
            {/* Project Header */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              
              {/* Project Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#00F5FF]" />
                      <span className="text-sm text-gray-300">Durée</span>
                    </div>
                    <p className="font-semibold">{project.duration}</p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-[#9D4EDD]" />
                      <span className="text-sm text-gray-300">Année</span>
                    </div>
                    <p className="font-semibold">{project.year}</p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-[#00F5FF]" />
                    <span>Technologies utilisées</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-lg text-white font-medium hover:shadow-lg transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Voir le projet</span>
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:border-gray-500 hover:text-white transition-all"
                  >
                    <Github className="w-5 h-5" />
                    <span>Code source</span>
                  </a>
                </div>
              </div>

              {/* Project Image */}
              <div className="relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
              </div>
            </div>

            {/* Case Study */}
            <div className="space-y-12">
              
              {/* Challenge */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span>Défi & Problématique</span>
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {project.caseStudy.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span>Solution Proposée</span>
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {project.caseStudy.solution}
                </p>
              </div>

              {/* Implementation */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span>Implémentation</span>
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  {project.caseStudy.implementation}
                </p>
                
                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fonctionnalités clés développées :</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[#00F5FF] rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results & Metrics */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span>Résultats & Impact</span>
                </h2>
                
                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {project.caseStudy.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-6 bg-gray-800/30 rounded-xl">
                      <div className="text-3xl font-bold gradient-text mb-2">{metric.value}</div>
                      <div className="text-lg font-semibold mb-2">{metric.name}</div>
                      <div className="text-sm text-gray-400">{metric.description}</div>
                    </div>
                  ))}
                </div>

                {/* Results List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bénéfices obtenus :</h3>
                  <div className="space-y-3">
                    {project.caseStudy.results.map((result, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lessons Learned */}
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span>Leçons Apprises</span>
                </h2>
                <div className="space-y-4">
                  {project.caseStudy.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Testimonial */}
              {project.client?.testimonial && (
                <div className="glass-card p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Témoignage Client</span>
                  </h2>
                  
                  <div className="relative">
                    <div className="text-6xl text-[#00F5FF] opacity-20 absolute -top-4 -left-2">"</div>
                    <blockquote className="text-lg text-gray-300 italic leading-relaxed pl-8">
                      {project.client.testimonial}
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                    <div>
                      <div className="font-semibold text-white">{project.client.name}</div>
                      <div className="text-sm text-gray-400">{project.client.company}</div>
                    </div>
                    {project.client.rating && (
                      <div className="flex items-center space-x-1">
                        {[...Array(project.client.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="border-t border-gray-700/50 pt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Partager cette étude de cas</span>
                </h3>
                
                <div className="flex flex-wrap gap-4 pb-8">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter X</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Copier le lien</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;