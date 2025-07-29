'use client';

import { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  pulse?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  glow = false,
  pulse = false,
  disabled,
  ...props
}, ref) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] text-white hover:shadow-lg hover:shadow-[#00F5FF]/25 hover:scale-105",
    secondary: "bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-700 hover:border-gray-500",
    outline: "border-2 border-[#00F5FF] text-[#00F5FF] hover:bg-[#00F5FF] hover:text-white",
    ghost: "text-gray-300 hover:bg-white/10 hover:text-white",
    gradient: "bg-gradient-to-r from-[#9D4EDD] to-[#DA70D6] text-white hover:from-[#7B2CBF] hover:to-[#9D4EDD]",
    neon: "bg-transparent border border-[#00F5FF] text-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.3)] hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] hover:bg-[#00F5FF]/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-12 py-6 text-xl rounded-3xl"
  };

  const glowEffect = glow ? "shadow-[0_0_20px_rgba(157,78,221,0.4)]" : "";
  const pulseEffect = pulse ? "animate-pulse" : "";

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        glowEffect,
        pulseEffect,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Effet de brillance au hover */}
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Contenu du bouton */}
      <div className="relative z-10 flex items-center space-x-2">
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="group-hover:scale-110 transition-transform">
            {icon}
          </span>
        )}
        
        <span>{children}</span>
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="group-hover:scale-110 group-hover:translate-x-1 transition-transform">
            {icon}
          </span>
        )}
      </div>

      {/* Particules au hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    </button>
  );
});

Button.displayName = "Button";

export { Button };
export type { ButtonProps };