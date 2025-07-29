'use client';

import { ReactNode, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Form Container
interface FormProps {
  children: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

const Form = ({ children, className, onSubmit }: FormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-6", className)}
    >
      {children}
    </form>
  );
};

// Form Field Container
interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

const FormField = ({ children, className }: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};

// Label
interface FormLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

const FormLabel = ({ children, htmlFor, required, className }: FormLabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-300 transition-colors",
        className
      )}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
};

// Input
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  className,
  type = 'text',
  error,
  success,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClasses = "w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none backdrop-blur-sm";
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20" 
    : success
    ? "border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
    : "border-gray-600 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 hover:border-gray-500";

  const iconPadding = icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';
  const passwordPadding = isPassword ? 'pr-12' : '';

  return (
    <div className="relative">
      {/* Icon gauche */}
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      <input
        ref={ref}
        type={inputType}
        className={cn(
          baseClasses,
          stateClasses,
          iconPadding,
          passwordPadding,
          className
        )}
        {...props}
      />

      {/* Icon droite */}
      {icon && iconPosition === 'right' && !isPassword && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}

      {/* Toggle password visibility */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}

      {/* Success/Error icons */}
      {(success || error) && !isPassword && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {success && <CheckCircle className="w-5 h-5 text-green-500" />}
          {error && <AlertCircle className="w-5 h-5 text-red-500" />}
        </div>
      )}

      {/* Effet de glow au focus */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />
    </div>
  );
});

FormInput.displayName = "FormInput";

// Textarea
interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  success?: boolean;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  className,
  error,
  success,
  ...props
}, ref) => {
  const baseClasses = "w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none backdrop-blur-sm resize-none";
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20" 
    : success
    ? "border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
    : "border-gray-600 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 hover:border-gray-500";

  return (
    <div className="relative">
      <textarea
        ref={ref}
        className={cn(
          baseClasses,
          stateClasses,
          className
        )}
        {...props}
      />

      {/* Success/Error icons */}
      {(success || error) && (
        <div className="absolute right-3 top-3">
          {success && <CheckCircle className="w-5 h-5 text-green-500" />}
          {error && <AlertCircle className="w-5 h-5 text-red-500" />}
        </div>
      )}

      {/* Effet de glow au focus */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00F5FF]/20 to-[#9D4EDD]/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";

// Select
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  success?: boolean;
  options: { value: string; label: string }[];
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  className,
  error,
  success,
  options,
  ...props
}, ref) => {
  const baseClasses = "w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white transition-all duration-300 focus:outline-none backdrop-blur-sm appearance-none cursor-pointer";
  
  const stateClasses = error 
    ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20" 
    : success
    ? "border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20"
    : "border-gray-600 focus:border-[#00F5FF] focus:ring-2 focus:ring-[#00F5FF]/20 hover:border-gray-500";

  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          baseClasses,
          stateClasses,
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
            {option.label}
          </option>
        ))}
      </select>

      {/* Chevron icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Success/Error icons */}
      {(success || error) && (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
          {success && <CheckCircle className="w-5 h-5 text-green-500" />}
          {error && <AlertCircle className="w-5 h-5 text-red-500" />}
        </div>
      )}
    </div>
  );
});

FormSelect.displayName = "FormSelect";

// Error Message
interface FormErrorProps {
  children: ReactNode;
  className?: string;
}

const FormError = ({ children, className }: FormErrorProps) => {
  return (
    <div className={cn(
      "flex items-center space-x-2 text-sm text-red-400",
      className
    )}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
};

// Success Message
interface FormSuccessProps {
  children: ReactNode;
  className?: string;
}

const FormSuccess = ({ children, className }: FormSuccessProps) => {
  return (
    <div className={cn(
      "flex items-center space-x-2 text-sm text-green-400",
      className
    )}>
      <CheckCircle className="w-4 h-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
};

// Help Text
interface FormHelpProps {
  children: ReactNode;
  className?: string;
}

const FormHelp = ({ children, className }: FormHelpProps) => {
  return (
    <p className={cn(
      "text-sm text-gray-400",
      className
    )}>
      {children}
    </p>
  );
};

export {
  Form,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  FormError,
  FormSuccess,
  FormHelp
};

export type {
  FormProps,
  FormFieldProps,
  FormLabelProps,
  FormInputProps,
  FormTextareaProps,
  FormSelectProps,
  FormErrorProps,
  FormSuccessProps,
  FormHelpProps
};