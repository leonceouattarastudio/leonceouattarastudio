'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getPasswordStrength } from '@/lib/validation';
import { Shield, Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  showSuggestions?: boolean;
  compact?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = '',
  showSuggestions = true,
  compact = false
}) => {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  const getStrengthBarWidth = () => {
    return `${(strength.score / 5) * 100}%`;
  };

  const requirements = [
    { test: password.length >= 8, label: 'Au moins 8 caractères' },
    { test: /[a-z]/.test(password), label: 'Une minuscule' },
    { test: /[A-Z]/.test(password), label: 'Une majuscule' },
    { test: /\d/.test(password), label: 'Un chiffre' },
    { test: /[@$!%*?&]/.test(password), label: 'Un caractère spécial' }
  ];

  if (compact) {
    return (
      <div className={cn('space-y-2', className)}>
        {/* Strength Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: getStrengthBarWidth(),
                backgroundColor: strength.color
              }}
            />
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Header */}
      <div className="flex items-center space-x-3">
        <Shield className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Force du mot de passe</span>
      </div>

      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden mr-3">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full relative"
              style={{
                width: getStrengthBarWidth(),
                backgroundColor: strength.color
              }}
            >
              {/* Animated glow effect */}
              <div
                className="absolute inset-0 rounded-full opacity-50 animate-pulse"
                style={{
                  backgroundColor: strength.color,
                  boxShadow: `0 0 10px ${strength.color}`
                }}
              />
            </div>
          </div>
          <span
            className="text-sm font-semibold min-w-0"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>

        {/* Score indicators */}
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-300',
                {
                  'bg-gray-600': index >= strength.score
                }
              )}
              style={{
                backgroundColor: index < strength.score ? strength.color : undefined
              }}
            />
          ))}
        </div>
      </div>

      {/* Requirements */}
      {showSuggestions && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-400">Exigences :</h4>
          <div className="grid grid-cols-1 gap-1">
            {requirements.map((req, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center space-x-2 text-xs transition-all duration-300',
                  {
                    'text-green-400': req.test,
                    'text-gray-400': !req.test
                  }
                )}
              >
                {req.test ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <X className="w-3 h-3 text-gray-400" />
                )}
                <span className={req.test ? 'line-through' : ''}>{req.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {strength.suggestions.length > 0 && showSuggestions && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-yellow-400">Suggestions :</h4>
          <ul className="space-y-1">
            {strength.suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs text-yellow-300 flex items-center space-x-2">
                <div className="w-1 h-1 bg-yellow-400 rounded-full flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;