// Types pour la validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FormField {
  name: string;
  value: any;
  rules: ValidationRule;
  touched: boolean;
  focused: boolean;
}

// Messages d'erreur par défaut
export const defaultErrorMessages = {
  required: 'Ce champ est obligatoire',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  email: 'Adresse email invalide',
  phone: 'Numéro de téléphone invalide',
  url: 'URL invalide',
  pattern: 'Format invalide'
};

// Expressions régulières utiles
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
  url: /^https?:\/\/.+\..+/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  postalCode: /^\d{5}$/,
  siret: /^\d{14}$/
};

// Fonction de validation principale
export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push(defaultErrorMessages.required);
  }

  // Si la valeur est vide et non requise, pas besoin de valider le reste
  if (!value || value.toString().trim() === '') {
    return { isValid: errors.length === 0, errors, warnings };
  }

  const stringValue = value.toString();

  // MinLength
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(defaultErrorMessages.minLength(rules.minLength));
  }

  // MaxLength
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(defaultErrorMessages.maxLength(rules.maxLength));
  }

  // Email
  if (rules.email && !patterns.email.test(stringValue)) {
    errors.push(defaultErrorMessages.email);
  }

  // Phone
  if (rules.phone && !patterns.phone.test(stringValue)) {
    errors.push(defaultErrorMessages.phone);
  }

  // URL
  if (rules.url && !patterns.url.test(stringValue)) {
    errors.push(defaultErrorMessages.url);
  }

  // Pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    errors.push(defaultErrorMessages.pattern);
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validation de formulaire complet
export const validateForm = (fields: Record<string, FormField>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};
  
  Object.entries(fields).forEach(([name, field]) => {
    results[name] = validateField(field.value, field.rules);
  });

  return results;
};

// Utilitaires pour les mots de passe
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
} => {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score += 1;
  else suggestions.push('Au moins 8 caractères');

  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('Au moins une minuscule');

  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('Au moins une majuscule');

  if (/\d/.test(password)) score += 1;
  else suggestions.push('Au moins un chiffre');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else suggestions.push('Au moins un caractère spécial');

  const strengthMap = {
    0: { label: 'Très faible', color: '#ef4444' },
    1: { label: 'Faible', color: '#f97316' },
    2: { label: 'Moyen', color: '#eab308' },
    3: { label: 'Bon', color: '#22c55e' },
    4: { label: 'Fort', color: '#16a34a' },
    5: { label: 'Très fort', color: '#15803d' }
  };

  const strength = strengthMap[score as keyof typeof strengthMap];

  return {
    score,
    label: strength.label,
    color: strength.color,
    suggestions
  };
};