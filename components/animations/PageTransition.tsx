'use client';

import React, { ReactNode } from 'react';
import { usePageTransition } from '@/hooks/usePageTransition';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = ''
}) => {
  const { isTransitioning, transitionStage, duration } = usePageTransition();

  const getTransitionStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      willChange: 'transform, opacity'
    };

    switch (transitionStage) {
      case 'leaving':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateY(20px) scale(0.98)'
        };
      case 'entering':
        return {
          ...baseStyle,
          opacity: 0,
          transform: 'translateY(-20px) scale(0.98)'
        };
      default:
        return {
          ...baseStyle,
          opacity: 1,
          transform: 'translateY(0) scale(1)'
        };
    }
  };

  return (
    <div className={className} style={getTransitionStyle()}>
      {children}
      {isTransitioning && (
        <div className="fixed inset-0 bg-[#0A0A0B] z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 animate-pulse" />
        </div>
      )}
    </div>
  );
};

// Composant pour les transitions de route
interface RouteTransitionProps {
  children: ReactNode;
  variant?: 'slide' | 'fade' | 'scale' | 'rotate';
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  variant = 'slide'
}) => {
  const { isTransitioning, transitionStage } = usePageTransition();

  const getVariantStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform, opacity'
    };

    if (!isTransitioning) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: 'translateX(0) scale(1) rotate(0deg)'
      };
    }

    switch (variant) {
      case 'slide':
        return {
          ...baseStyle,
          opacity: transitionStage === 'leaving' ? 0 : 1,
          transform: transitionStage === 'leaving' 
            ? 'translateX(-100px)' 
            : transitionStage === 'entering' 
            ? 'translateX(100px)' 
            : 'translateX(0)'
        };
      case 'fade':
        return {
          ...baseStyle,
          opacity: transitionStage === 'idle' ? 1 : 0
        };
      case 'scale':
        return {
          ...baseStyle,
          opacity: transitionStage === 'idle' ? 1 : 0,
          transform: transitionStage === 'idle' ? 'scale(1)' : 'scale(0.9)'
        };
      case 'rotate':
        return {
          ...baseStyle,
          opacity: transitionStage === 'idle' ? 1 : 0,
          transform: transitionStage === 'leaving' 
            ? 'rotate(-5deg) scale(0.95)' 
            : transitionStage === 'entering' 
            ? 'rotate(5deg) scale(0.95)' 
            : 'rotate(0deg) scale(1)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={getVariantStyle()}>
      {children}
    </div>
  );
};

export default PageTransition;