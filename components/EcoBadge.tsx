'use client';

import React, { useState } from 'react';
import { Leaf, X, Info } from 'lucide-react';

const EcoBadge = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      {/* Badge principal */}
      <div className="fixed bottom-4 left-4 z-40">
        <div 
          className="group cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-600/80 backdrop-blur-sm rounded-full border border-green-500/30 hover:bg-green-600/90 transition-all duration-300 shadow-lg">
            <Leaf className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-medium">Éco-performant</span>
            <Info className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      {/* Modal d'information */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Modal Content */}
          <div className="relative max-w-md mx-4 bg-[#0A0A0B] rounded-2xl border border-green-500/30 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Site Éco-performant</h3>
                    <p className="text-green-100 text-sm">CO₂ Friendly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400 mb-1">0.2g</div>
                  <div className="text-xs text-gray-400">CO₂ par visite</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400 mb-1">A+</div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Optimisations écologiques :</h4>
                <div className="space-y-2">
                  {[
                    'Images optimisées et compressées',
                    'Code minifié et tree-shaking',
                    'Hébergement vert (énergies renouvelables)',
                    'Cache intelligent et CDN',
                    'Lazy loading des ressources',
                    'Fonts système privilégiées'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <h4 className="font-semibold text-white mb-2">Impact environnemental :</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Ce site génère <strong className="text-green-400">95% moins de CO₂</strong> qu'un site web moyen, 
                  équivalent à planter <strong className="text-green-400">2 arbres par an</strong> pour compenser son empreinte carbone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                >
                  Parfait !
                </button>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setIsVisible(false);
                  }}
                  className="px-4 py-2 border border-gray-600 hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  Masquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EcoBadge;