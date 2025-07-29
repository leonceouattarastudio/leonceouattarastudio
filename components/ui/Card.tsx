'use client';

import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
  border?: boolean;
  onClick?: () => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  variant = 'default',
  size = 'md',
  hover = true,
  glow = false,
  border = true,
  onClick,
  ...props
}, ref) => {
  const baseClasses = "relative overflow-hidden transition-all duration-500 ease-out";
  
  const variants = {
    default: "bg-gray-900/50 backdrop-blur-sm",
    glass: "bg-white/5 backdrop-blur-xl border-white/10",
    gradient: "bg-gradient-to-br from-[#00F5FF]/10 to-[#9D4EDD]/10",
    neon: "bg-gray-900/80 border-[#00F5FF]/50 shadow-[0_0_20px_rgba(0,245,255,0.3)]"
  };

  const sizes = {
    sm: "p-4 rounded-lg",
    md: "p-6 rounded-xl",
    lg: "p-8 rounded-2xl",
    xl: "p-12 rounded-3xl"
  };

  const hoverEffects = hover ? "hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#00F5FF]/20" : "";
  const borderClasses = border ? "border border-gray-700/50" : "";
  const glowEffect = glow ? "shadow-[0_0_30px_rgba(157,78,221,0.3)]" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        hoverEffects,
        borderClasses,
        glowEffect,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Effet de particules au hover */}
      {hover && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00F5FF] rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      
      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

Card.displayName = "Card";

export { Card };
export type { CardProps };