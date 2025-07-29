'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Send, Check, AlertCircle } from 'lucide-react';

interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  fullWidth?: boolean;
  pulse?: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
  loading = false,
  success = false,
  error = false,
  loadingText = 'Envoi en cours...',
  successText = 'Envoyé !',
  errorText = 'Erreur',
  icon,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  pulse = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] hover:from-[#00BFFF] hover:to-[#8A2BE2]',
    secondary: 'bg-gray-700 hover:bg-gray-600 border border-gray-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
  };

  const getCurrentContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingText}</span>
        </>
      );
    }
    
    if (success) {
      return (
        <>
          <Check className="w-5 h-5" />
          <span>{successText}</span>
        </>
      );
    }
    
    if (error) {
      return (
        <>
          <AlertCircle className="w-5 h-5" />
          <span>{errorText}</span>
        </>
      );
    }

    return (
      <>
        {icon || <Send className="w-5 h-5" />}
        <span>{children}</span>
      </>
    );
  };

  const getStateClasses = () => {
    if (success) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (error) return 'bg-gradient-to-r from-red-500 to-pink-500';
    return variantClasses[variant];
  };

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold text-white transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-opacity-50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'flex items-center justify-center space-x-2',
        'transform hover:scale-105 active:scale-95',
        sizeClasses[size],
        getStateClasses(),
        {
          'w-full': fullWidth,
          'animate-pulse': pulse || loading,
          'shadow-lg hover:shadow-xl': !disabled,
          'focus:ring-[#00F5FF]': variant === 'primary',
          'focus:ring-green-500': variant === 'success' || success,
          'focus:ring-red-500': variant === 'danger' || error,
          'focus:ring-gray-500': variant === 'secondary'
        },
        className
      )}
      {...props}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center space-x-2">
        {getCurrentContent()}
      </div>

      {/* Success ripple effect */}
      {success && (
        <div className="absolute inset-0 bg-green-400 opacity-30 animate-ping rounded-xl" />
      )}

      {/* Error shake effect */}
      {error && (
        <div className="absolute inset-0 animate-shake" />
      )}
    </button>
  );
};

export default FormSubmitButton;