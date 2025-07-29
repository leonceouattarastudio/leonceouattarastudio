'use client';

import React from 'react';

interface LoadingStateProps {
  variant?: 'skeleton' | 'shimmer' | 'pulse' | 'wave' | 'dots' | 'spinner';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'skeleton',
  size = 'md',
  className = '',
  color = '#00F5FF',
  count = 1
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4';
      case 'md':
        return 'h-6';
      case 'lg':
        return 'h-8';
      case 'xl':
        return 'h-12';
      default:
        return 'h-6';
    }
  };

  const renderSkeleton = () => (
    <div className={`bg-gray-700 rounded animate-pulse ${getSizeClasses()} ${className}`} />
  );

  const renderShimmer = () => (
    <div className={`relative overflow-hidden bg-gray-700 rounded ${getSizeClasses()} ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );

  const renderPulse = () => (
    <div 
      className={`rounded animate-pulse ${getSizeClasses()} ${className}`}
      style={{ backgroundColor: `${color}40` }}
    />
  );

  const renderWave = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`bg-current rounded-full animate-wave ${getSizeClasses()}`}
          style={{ 
            color,
            animationDelay: `${i * 0.1}s`,
            width: size === 'sm' ? '4px' : size === 'md' ? '6px' : size === 'lg' ? '8px' : '12px'
          }}
        />
      ))}
    </div>
  );

  const renderDots = () => (
    <div className={`flex space-x-2 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

  const renderSpinner = () => (
    <div 
      className={`animate-spin rounded-full border-2 border-transparent ${getSizeClasses()} ${className}`}
      style={{ 
        borderTopColor: color,
        borderRightColor: `${color}40`,
        width: size === 'sm' ? '16px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '48px'
      }}
    />
  );

  const renderVariant = () => {
    switch (variant) {
      case 'skeleton':
        return renderSkeleton();
      case 'shimmer':
        return renderShimmer();
      case 'pulse':
        return renderPulse();
      case 'wave':
        return renderWave();
      case 'dots':
        return renderDots();
      case 'spinner':
        return renderSpinner();
      default:
        return renderSkeleton();
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, i) => (
          <div key={i}>{renderVariant()}</div>
        ))}
      </div>
    );
  }

  return renderVariant();
};

// Composant pour les états de chargement de page
interface PageLoadingProps {
  isLoading: boolean;
  variant?: 'overlay' | 'inline' | 'minimal';
  message?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  isLoading,
  variant = 'overlay',
  message = 'Chargement...'
}) => {
  if (!isLoading) return null;

  const renderOverlay = () => (
    <div className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-[#00F5FF]/30 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-[#9D4EDD]/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            <div className="absolute inset-0 border-4 border-transparent border-b-[#9D4EDD] rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
        <p className="text-white text-lg font-medium">{message}</p>
        <div className="mt-4 flex justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#00F5FF] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderInline = () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <LoadingState variant="spinner" size="lg" color="#00F5FF" />
        <p className="text-gray-400 mt-4">{message}</p>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="flex items-center space-x-3">
      <LoadingState variant="dots" size="sm" color="#00F5FF" />
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  );

  switch (variant) {
    case 'overlay':
      return renderOverlay();
    case 'inline':
      return renderInline();
    case 'minimal':
      return renderMinimal();
    default:
      return renderOverlay();
  }
};

export default LoadingState;