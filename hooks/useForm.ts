'use client';

import { useState, useCallback, useRef } from 'react';
import { ValidationRule, validateField, validateForm, ValidationResult } from '@/lib/validation';

interface FormFieldConfig {
  rules?: ValidationRule;
  initialValue?: any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormConfig {
  fields: Record<string, FormFieldConfig>;
  validateOnSubmit?: boolean;
  resetOnSubmit?: boolean;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
  touched: Record<string, boolean>;
  focused: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export const useForm = (config: FormConfig) => {
  const initialValues = Object.entries(config.fields).reduce((acc, [name, field]) => {
    acc[name] = field.initialValue || '';
    return acc;
  }, {} as Record<string, any>);

  const [state, setState] = useState<FormState>({
    values: initialValues,
    errors: {},
    warnings: {},
    touched: {},
    focused: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false
  });

  const submitCallbackRef = useRef<((values: Record<string, any>) => Promise<void> | void) | null>(null);

  // Validation d'un champ
  const validateSingleField = useCallback((name: string, value: any): ValidationResult => {
    const fieldConfig = config.fields[name];
    if (!fieldConfig?.rules) {
      return { isValid: true, errors: [], warnings: [] };
    }
    return validateField(value, fieldConfig.rules);
  }, [config.fields]);

  // Mise à jour d'un champ
  const setFieldValue = useCallback((name: string, value: any) => {
    setState(prev => {
      const newValues = { ...prev.values, [name]: value };
      const fieldConfig = config.fields[name];
      
      let newErrors = { ...prev.errors };
      let newWarnings = { ...prev.warnings };

      // Validation en temps réel si activée
      if (fieldConfig?.validateOnChange || prev.touched[name]) {
        const validation = validateSingleField(name, value);
        newErrors[name] = validation.errors;
        newWarnings[name] = validation.warnings;
      }

      // Vérifier si le formulaire est valide
      const isValid = Object.values(newErrors).every(errors => errors.length === 0);
      
      // Vérifier si le formulaire a été modifié
      const isDirty = Object.keys(newValues).some(key => newValues[key] !== initialValues[key]);

      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        warnings: newWarnings,
        isValid,
        isDirty
      };
    });
  }, [config.fields, validateSingleField, initialValues]);

  // Marquer un champ comme touché
  const setFieldTouched = useCallback((name: string, touched: boolean = true) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched }
    }));
  }, []);

  // Marquer un champ comme focalisé
  const setFieldFocused = useCallback((name: string, focused: boolean = true) => {
    setState(prev => ({
      ...prev,
      focused: { ...prev.focused, [name]: focused }
    }));
  }, []);

  // Gestion du blur
  const handleFieldBlur = useCallback((name: string) => {
    setFieldFocused(name, false);
    setFieldTouched(name, true);

    const fieldConfig = config.fields[name];
    if (fieldConfig?.validateOnBlur) {
      const validation = validateSingleField(name, state.values[name]);
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: validation.errors },
        warnings: { ...prev.warnings, [name]: validation.warnings }
      }));
    }
  }, [config.fields, validateSingleField, state.values, setFieldFocused, setFieldTouched]);

  // Validation complète du formulaire
  const validateAllFields = useCallback(() => {
    const fields = Object.entries(config.fields).reduce((acc, [name, fieldConfig]) => {
      acc[name] = {
        name,
        value: state.values[name],
        rules: fieldConfig.rules || {},
        touched: state.touched[name] || false,
        focused: state.focused[name] || false
      };
      return acc;
    }, {} as Record<string, any>);

    const validationResults = validateForm(fields);
    
    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};
    
    Object.entries(validationResults).forEach(([name, result]) => {
      errors[name] = result.errors;
      warnings[name] = result.warnings;
    });

    const isValid = Object.values(errors).every(fieldErrors => fieldErrors.length === 0);

    setState(prev => ({
      ...prev,
      errors,
      warnings,
      isValid,
      touched: Object.keys(config.fields).reduce((acc, name) => {
        acc[name] = true;
        return acc;
      }, {} as Record<string, boolean>)
    }));

    return isValid;
  }, [config.fields, state.values, state.touched, state.focused]);

  // Soumission du formulaire
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      let isValid = state.isValid;
      
      if (config.validateOnSubmit) {
        isValid = validateAllFields();
      }

      if (isValid && submitCallbackRef.current) {
        await submitCallbackRef.current(state.values);
        
        if (config.resetOnSubmit) {
          reset();
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.isValid, state.values, config.validateOnSubmit, config.resetOnSubmit, validateAllFields]);

  // Reset du formulaire
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      warnings: {},
      touched: {},
      focused: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    });
  }, [initialValues]);

  // Définir le callback de soumission
  const onSubmit = useCallback((callback: (values: Record<string, any>) => Promise<void> | void) => {
    submitCallbackRef.current = callback;
    return handleSubmit;
  }, [handleSubmit]);

  // Utilitaires pour les champs
  const getFieldProps = useCallback((name: string) => ({
    name,
    value: state.values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFieldValue(name, e.target.value);
    },
    onBlur: () => handleFieldBlur(name),
    onFocus: () => setFieldFocused(name, true),
    error: state.touched[name] ? state.errors[name]?.[0] : undefined,
    errors: state.touched[name] ? state.errors[name] || [] : [],
    warnings: state.warnings[name] || [],
    touched: state.touched[name] || false,
    focused: state.focused[name] || false,
    hasError: state.touched[name] && (state.errors[name]?.length || 0) > 0,
    hasWarning: (state.warnings[name]?.length || 0) > 0,
    isValid: state.touched[name] && (state.errors[name]?.length || 0) === 0
  }), [state, setFieldValue, handleFieldBlur, setFieldFocused]);

  return {
    // État
    values: state.values,
    errors: state.errors,
    warnings: state.warnings,
    touched: state.touched,
    focused: state.focused,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    isDirty: state.isDirty,

    // Actions
    setFieldValue,
    setFieldTouched,
    setFieldFocused,
    handleFieldBlur,
    validateAllFields,
    reset,
    onSubmit,

    // Utilitaires
    getFieldProps,
    
    // Handlers
    handleSubmit
  };
};

export default useForm;