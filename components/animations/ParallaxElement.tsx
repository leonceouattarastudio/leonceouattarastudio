'use client';

import React, { ReactNode } from 'react';
import { useParallax } from '@/hooks/useParallax';
import { ParallaxConfig } from '@/lib/animations';

interface ParallaxElementProps extends ParallaxConfig {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  disabled?: boolean;
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  className = '',
  as: Component = 'div',
  speed = 0.5,
  direction = 'up',
  scale = false,
  rotate = false,
  disabled = false
}) => {
  const { elementRef, transform } = useParallax({
    speed,
    direction,
    scale,
    rotate,
    disabled
  });

  const style: React.CSSProperties = {
    transform,
    willChange: 'transform'
  };

  return (
    <Component
      ref={elementRef}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};

// Composant pour les backgrounds parallax
interface ParallaxBackgroundProps extends ParallaxConfig {
  src: string;
  alt?: string;
  className?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  src,
  alt = '',
  className = '',
  speed = 0.3,
  direction = 'up',
  overlay = false,
  overlayColor = 'black',
  overlayOpacity = 0.5,
  disabled = false
}) => {
  const { elementRef, transform } = useParallax({
    speed,
    direction,
    disabled
  });

  return (
    <div ref={elementRef} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `${transform} scale(1.1)`,
          willChange: 'transform'
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity
          }}
        />
      )}
    </div>
  );
};

export default ParallaxElement;