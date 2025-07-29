'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className = '',
  error = false,
  success = false,
  disabled = false
}) => {
  return (
    <div 
      className={cn(
        'relative space-y-2 transition-all duration-300',
        {
          'opacity-50': disabled,
          'animate-shake': error
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default FormField;