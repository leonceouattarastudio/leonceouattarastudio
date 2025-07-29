'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className,
  overlayClassName
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        isVisible ? "opacity-100" : "opacity-0",
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          >
            <div 
              className="w-1 h-1 rounded-full opacity-30"
              style={{
                backgroundColor: Math.random() > 0.5 ? '#00F5FF' : '#9D4EDD'
              }}
            />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl",
          "transition-all duration-500 ease-out",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Effet de glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 rounded-2xl blur-xl opacity-50" />
        
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="relative flex items-center justify-between p-6 border-b border-white/10">
            {title && (
              <h2 className="text-xl font-bold text-white">{title}</h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative p-6">
          {children}
        </div>

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full animate-pulse opacity-0 hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </div>
    </div>,
    document.body
  );
};

export { Modal };
export type { ModalProps };