'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
  success?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = '',
  error = false,
  success = false
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium transition-colors duration-200',
        {
          'text-red-400': error,
          'text-green-400': success && !error,
          'text-gray-300': !error && !success
        },
        className
      )}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-400 animate-pulse">*</span>
      )}
    </label>
  );
};

export default FormLabel;