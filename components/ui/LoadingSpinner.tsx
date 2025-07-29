'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'dots' | 'pulse' | 'orbit';
  className?: string;
  color?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default', 
  className,
  color = '#00F5FF'
}: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const sizeValues = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64
  };

  if (variant === 'gradient') {
    return (
      <div className={cn("relative", sizes[size], className)}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] animate-spin">
          <div className="absolute inset-1 rounded-full bg-gray-900" />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00F5FF] to-transparent animate-ping opacity-20" />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-[#00F5FF] animate-pulse",
              size === 'sm' ? 'w-2 h-2' : 
              size === 'md' ? 'w-3 h-3' :
              size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("relative", sizes[size], className)}>
        <div className="absolute inset-0 rounded-full bg-[#00F5FF] animate-ping opacity-20" />
        <div className="absolute inset-2 rounded-full bg-[#9D4EDD] animate-ping opacity-40" style={{ animationDelay: '0.5s' }} />
        <div className="absolute inset-4 rounded-full bg-[#00F5FF] animate-pulse" />
      </div>
    );
  }

  if (variant === 'orbit') {
    const centerSize = sizeValues[size];
    const orbitRadius = centerSize * 0.4;
    
    return (
      <div className={cn("relative", sizes[size], className)}>
        {/* Centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse" />
        </div>
        
        {/* Orbites */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 animate-spin"
            style={{
              animationDuration: `${2 + i * 0.5}s`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
            }}
          >
            <div
              className="absolute w-1 h-1 bg-[#9D4EDD] rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translateY(-${orbitRadius}px)`,
                opacity: 0.8 - i * 0.2
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn("relative", sizes[size], className)}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill={color}
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      
      {/* Effet de glow */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-30 animate-pulse"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

// Composant de loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: LoadingSpinnerProps;
  message?: string;
  className?: string;
}

const LoadingOverlay = ({ 
  isLoading, 
  children, 
  spinner = {}, 
  message,
  className 
}: LoadingOverlayProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <div className="text-center">
            <LoadingSpinner {...spinner} />
            {message && (
              <p className="mt-4 text-white text-sm font-medium">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook pour gérer les états de loading
import { useState } from 'react';

const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const toggleLoading = () => setIsLoading(prev => !prev);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setIsLoading
  };
};

export { LoadingSpinner, LoadingOverlay, useLoading };
export type { LoadingSpinnerProps, LoadingOverlayProps };