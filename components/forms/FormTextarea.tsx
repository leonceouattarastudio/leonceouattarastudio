'use client';

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  errors?: string[];
  warnings?: string[];
  success?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'neon';
  hint?: string;
  counter?: boolean;
  maxLength?: number;
  autoResize?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  error,
  errors = [],
  warnings = [],
  success = false,
  loading = false,
  size = 'md',
  variant = 'default',
  hint,
  counter = false,
  maxLength,
  autoResize = false,
  className = '',
  value = '',
  disabled = false,
  rows = 4,
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

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Auto-resize functionality
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = 'auto';
      target.style.height = `${target.scrollHeight}px`;
    }
    props.onInput?.(e);
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

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          disabled={disabled || loading}
          rows={rows}
          className={cn(
            'w-full rounded-xl border transition-all duration-300 text-white placeholder-gray-400 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-opacity-20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            sizeClasses[size],
            variantClasses[variant],
            getStateClasses(),
            {
              'pr-10': loading || success || hasError || hasWarning,
              'animate-pulse': loading,
              'resize-y': !autoResize,
              'overflow-hidden': autoResize
            },
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          maxLength={maxLength}
          {...props}
        />

        {/* Status Icons */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {loading && (
            <Loader2 className="w-5 h-5 text-[#00F5FF] animate-spin" />
          )}

          {success && !loading && !hasError && (
            <Check className="w-5 h-5 text-green-400" />
          )}

          {hasError && !loading && (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}

          {hasWarning && !hasError && !loading && !success && (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        {/* Focus Ring Animation */}
        {isFocused && (
          <div className="absolute inset-0 rounded-xl border-2 border-[#00F5FF] opacity-50 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Counter */}
      {counter && maxLength && (
        <div className="flex justify-end">
          <span className={cn(
            'text-xs transition-colors duration-200',
            {
              'text-red-400': value.toString().length > maxLength * 0.9,
              'text-yellow-400': value.toString().length > maxLength * 0.8,
              'text-gray-400': value.toString().length <= maxLength * 0.8
            }
          )}>
            {value.toString().length}/{maxLength}
          </span>
        </div>
      )}

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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;