'use client';

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus, AlertCircle } from 'lucide-react';

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  description?: string;
  error?: string;
  errors?: string[];
  warnings?: string[];
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'neon' | 'rgpd';
  indeterminate?: boolean;
  loading?: boolean;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(({
  label,
  description,
  error,
  errors = [],
  warnings = [],
  size = 'md',
  variant = 'default',
  indeterminate = false,
  loading = false,
  className = '',
  checked = false,
  disabled = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = error || errors.length > 0;
  const hasWarning = warnings.length > 0;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getVariantClasses = () => {
    const baseClasses = 'rounded border-2 transition-all duration-300 cursor-pointer';
    
    switch (variant) {
      case 'glass':
        return cn(baseClasses, 'bg-white/5 backdrop-blur-sm border-white/20');
      case 'neon':
        return cn(baseClasses, 'bg-gray-900 border-[#00F5FF]/30');
      case 'rgpd':
        return cn(baseClasses, 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30');
      default:
        return cn(baseClasses, 'bg-gray-800 border-gray-600');
    }
  };

  const getStateClasses = () => {
    if (hasError) return 'border-red-500 bg-red-500/10';
    if (checked || indeterminate) {
      switch (variant) {
        case 'neon':
          return 'border-[#00F5FF] bg-[#00F5FF]/20 shadow-[0_0_10px_rgba(0,245,255,0.3)]';
        case 'rgpd':
          return 'border-blue-400 bg-gradient-to-br from-blue-500/30 to-purple-500/30';
        default:
          return 'border-[#00F5FF] bg-[#00F5FF]/20';
      }
    }
    return '';
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        {/* Checkbox Container */}
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled || loading}
            className="sr-only"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {/* Custom Checkbox */}
          <div
            className={cn(
              sizeClasses[size],
              getVariantClasses(),
              getStateClasses(),
              {
                'opacity-50 cursor-not-allowed': disabled || loading,
                'animate-pulse': loading
              }
            )}
            onClick={() => !disabled && !loading && props.onChange?.({
              target: { checked: !checked }
            } as React.ChangeEvent<HTMLInputElement>)}
          >
            {/* Check Icon */}
            {checked && !indeterminate && (
              <Check 
                className={cn(
                  iconSizeClasses[size],
                  'text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  'animate-scale-in'
                )} 
              />
            )}
            
            {/* Indeterminate Icon */}
            {indeterminate && (
              <Minus 
                className={cn(
                  iconSizeClasses[size],
                  'text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  'animate-scale-in'
                )} 
              />
            )}
          </div>

          {/* Focus Ring */}
          {isFocused && (
            <div className={cn(
              'absolute inset-0 rounded border-2 border-[#00F5FF] opacity-50 animate-pulse pointer-events-none',
              sizeClasses[size]
            )} />
          )}

          {/* RGPD Special Effects */}
          {variant === 'rgpd' && (checked || indeterminate) && (
            <div className="absolute inset-0 rounded bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Label and Description */}
        <div className="flex-1 min-w-0">
          {label && (
            <label
              className={cn(
                'block text-sm font-medium cursor-pointer transition-colors duration-200',
                {
                  'text-red-400': hasError,
                  'text-yellow-400': hasWarning && !hasError,
                  'text-gray-300': !hasError && !hasWarning,
                  'opacity-50': disabled
                }
              )}
              onClick={() => !disabled && !loading && props.onChange?.({
                target: { checked: !checked }
              } as React.ChangeEvent<HTMLInputElement>)}
            >
              {label}
              {props.required && <span className="ml-1 text-red-400">*</span>}
            </label>
          )}
          
          {description && (
            <p className={cn(
              'mt-1 text-xs transition-colors duration-200',
              {
                'text-red-300': hasError,
                'text-yellow-300': hasWarning && !hasError,
                'text-gray-400': !hasError && !hasWarning,
                'opacity-50': disabled
              }
            )}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Errors */}
      {hasError && (
        <div className="space-y-1 ml-8">
          {(error ? [error] : errors).map((err, index) => (
            <p key={index} className="text-xs text-red-400 flex items-center space-x-1 animate-slide-in-left">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{err}</span>
            </p>
          ))}
        </div>
      )}

      {/* Warnings */}
      {hasWarning && !hasError && (
        <div className="space-y-1 ml-8">
          {warnings.map((warning, index) => (
            <p key={index} className="text-xs text-yellow-400 flex items-center space-x-1 animate-slide-in-left">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{warning}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;