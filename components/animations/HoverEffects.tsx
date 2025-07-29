'use client';

import React, { ReactNode, useState, useRef } from 'react';

interface HoverEffectProps {
  children: ReactNode;
  className?: string;
  effect?: 'glow' | 'lift' | 'tilt' | 'magnetic' | 'ripple' | 'particle';
  intensity?: 'subtle' | 'medium' | 'strong';
  color?: string;
  disabled?: boolean;
}

export const HoverEffect: React.FC<HoverEffectProps> = ({
  children,
  className = '',
  effect = 'lift',
  intensity = 'medium',
  color = '#00F5FF',
  disabled = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const getEffectStyle = (): React.CSSProperties => {
    if (disabled || !isHovered) {
      return {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, box-shadow, filter'
      };
    }

    const intensityMap = {
      subtle: 0.5,
      medium: 1,
      strong: 1.5
    };

    const factor = intensityMap[intensity];

    switch (effect) {
      case 'glow':
        return {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 ${20 * factor}px ${color}40, 0 0 ${40 * factor}px ${color}20`,
          filter: `brightness(${1 + 0.1 * factor})`,
          willChange: 'transform, box-shadow, filter'
        };

      case 'lift':
        return {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateY(-${8 * factor}px) scale(${1 + 0.02 * factor})`,
          boxShadow: `0 ${10 * factor}px ${30 * factor}px rgba(0, 0, 0, 0.3)`,
          willChange: 'transform, box-shadow'
        };

      case 'tilt':
        if (!elementRef.current) return {};
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((mousePosition.y - centerY) / centerY) * 10 * factor;
        const rotateY = ((mousePosition.x - centerX) / centerX) * 10 * factor;
        
        return {
          transition: 'all 0.1s ease-out',
          transform: `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(${1 + 0.02 * factor})`,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        };

      case 'magnetic':
        if (!elementRef.current) return {};
        const magnetRect = elementRef.current.getBoundingClientRect();
        const magnetCenterX = magnetRect.width / 2;
        const magnetCenterY = magnetRect.height / 2;
        const magnetX = (mousePosition.x - magnetCenterX) * 0.1 * factor;
        const magnetY = (mousePosition.y - magnetCenterY) * 0.1 * factor;
        
        return {
          transition: 'all 0.1s ease-out',
          transform: `translate(${magnetX}px, ${magnetY}px) scale(${1 + 0.02 * factor})`,
          willChange: 'transform'
        };

      case 'ripple':
        return {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          willChange: 'transform'
        };

      case 'particle':
        return {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `scale(${1 + 0.05 * factor})`,
          filter: `brightness(${1 + 0.2 * factor})`,
          willChange: 'transform, filter'
        };

      default:
        return {};
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={getEffectStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {/* Effet ripple */}
      {effect === 'ripple' && isHovered && (
        <div
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
            width: 20,
            height: 20,
            backgroundColor: color,
            opacity: 0.3
          }}
        />
      )}
      
      {/* Effet particules */}
      {effect === 'particle' && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: color,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour les micro-interactions sur les boutons
interface MicroInteractionProps {
  children: ReactNode;
  className?: string;
  type?: 'button' | 'link' | 'card';
  variant?: 'bounce' | 'pulse' | 'shake' | 'rotate' | 'flip';
}

export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  className = '',
  type = 'button',
  variant = 'bounce'
}) => {
  const [isActive, setIsActive] = useState(false);

  const getAnimationClass = () => {
    if (!isActive) return '';

    switch (variant) {
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'shake':
        return 'animate-shake';
      case 'rotate':
        return 'animate-spin';
      case 'flip':
        return 'animate-flip';
      default:
        return '';
    }
  };

  const handleInteraction = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 600);
  };

  return (
    <div
      className={`${className} ${getAnimationClass()} transition-all duration-300 cursor-pointer`}
      onClick={handleInteraction}
      onMouseDown={type === 'button' ? handleInteraction : undefined}
    >
      {children}
    </div>
  );
};

export default HoverEffect;