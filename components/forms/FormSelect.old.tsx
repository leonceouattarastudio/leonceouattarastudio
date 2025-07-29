'use client';

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, AlertCircle, Check, Loader2 } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  errors?: string[];
  warnings?: string[];
  success?: boolean;
  loading?: boolean;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'neon';
  hint?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  errors = [],
  warnings = [],
  success = false,
  loading = false,
  options,
  placeholder = 'Sélectionnez une option',
  size = 'md',
  variant = 'default',
  hint,
  className = '',
  value = '',
  disabled = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = error || errors.length > 0;
  const hasWarning = warnings.length > 0;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variantClasses = {
    default: 'bg-gray-800 border-gray-600 focus:border-[#00F5FF]',
    glass: 'bg-white/5 backdrop-blur-sm border-white/10 focus:border-[#00F5FF]/50',
    neon: 'bg-gray-900 border-[#00F5FF]/30 focus:border-[#00F5FF] focus:shadow-[0_0_20px_rgba(0,245,255,0.3)]'
  };

  const getStateClasses = () => {
    if (hasError) return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/20';
    if (hasWarning) return 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20';
    return '';
  };

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className={cn(
          'block text-sm font-medium transition-colors duration-200',
          {
            'text-red-400': hasError,
            'text-green-400': success && !hasError,
            'text-yellow-400': hasWarning && !hasError && !success,
            'text-gray-300': !hasError && !success && !hasWarning
          }
        )}>
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          value={value}
          disabled={disabled || loading}
          className={cn(
            'w-full rounded-xl border transition-all duration-300 text-white appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-opacity-20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            variantClasses[variant],
            getStateClasses(),
            'pr-12', // Space for icons
            {
              'animate-pulse': loading
            },
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-gray-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Icons Container */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
          {/* Loading */}
          {loading && (
            <Loader2 className="w-5 h-5 text-[#00F5FF] animate-spin" />
          )}

          {/* Success */}
          {success && !loading && !hasError && (
            <Check className="w-5 h-5 text-green-400" />
          )}

          {/* Error */}
          {hasError && !loading && (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}

          {/* Warning */}
          {hasWarning && !hasError && !loading && !success && (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}

          {/* Chevron */}
          {!loading && (
            <ChevronDown className={cn(
              'w-5 h-5 transition-all duration-200',
              {
                'text-red-400': hasError,
                'text-green-400': success && !hasError,
                'text-yellow-400': hasWarning && !hasError && !success,
                'text-gray-400': !hasError && !success && !hasWarning && !isFocused,
                'text-[#00F5FF]': isFocused && !hasError && !success && !hasWarning,
                'rotate-180': isFocused
              }
            )} />
          )}
        </div>

        {/* Focus Ring Animation */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl border-2 border-[#00F5FF] opacity-50 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Hint */}
      {hint && !hasError && !hasWarning && (
        <p className="text-xs text-gray-400">{hint}</p>
      )}

      {/* Errors */}
      {hasError && (
        <div className="space-y-1">
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
        <div className="space-y-1">
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

FormSelect.displayName = 'FormSelect';

export default FormSelect;