// ============= STANDARD FORM COMPONENTS =============

import React from 'react';
import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { FormComponentProps, StandardComponentProps } from '@/types';
import { BaseComponent, LoadingWrapper } from './BaseComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Standard form wrapper with validation and error handling
 */
export interface StandardFormProps<T extends FieldValues = FieldValues> extends StandardComponentProps {
  onSubmit: (data: T) => void | Promise<void>;
  defaultValues?: Partial<T>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  formClassName?: string;
}

export function StandardForm<T extends FieldValues = FieldValues>({
  onSubmit,
  defaultValues,
  children,
  submitText = 'Submit',
  resetText = 'Reset',
  showReset = false,
  loading,
  error,
  disabled,
  className,
  formClassName,
  testId,
}: StandardFormProps<T>) {
  const form = useForm<T>({
    defaultValues: defaultValues as any,
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <BaseComponent
      className={className}
      loading={loading}
      error={error}
      disabled={disabled}
      testId={testId}
    >
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-4', formClassName)}
      >
        {children(form)}
        
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={loading || disabled || form.formState.isSubmitting}
            className="flex-1"
          >
            <LoadingWrapper loading={form.formState.isSubmitting} size="sm">
              {submitText}
            </LoadingWrapper>
          </Button>
          
          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={loading || disabled}
            >
              {resetText}
            </Button>
          )}
        </div>
      </form>
    </BaseComponent>
  );
}

/**
 * Standard form field wrapper
 */
export interface StandardFieldProps extends StandardComponentProps {
  label?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const StandardField: React.FC<StandardFieldProps> = ({
  label,
  description,
  required,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className={cn(required && "after:content-['*'] after:text-destructive after:ml-1")}>
          {label}
        </Label>
      )}
      
      {children}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
};

/**
 * Standard input field
 */
export interface StandardInputProps extends FormComponentProps<string> {
  label?: string;
  description?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
}

export const StandardInput: React.FC<StandardInputProps> = ({
  label,
  description,
  required,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  error,
  disabled,
  validation,
  className,
  testId,
}) => {
  const [localError, setLocalError] = React.useState<string | null>(null);

  const validateValue = React.useCallback((val: string) => {
    if (!validation) return null;

    if (validation.required && !val.trim()) {
      return 'This field is required';
    }

    if (validation.min && val.length < validation.min) {
      return `Minimum length is ${validation.min}`;
    }

    if (validation.max && val.length > validation.max) {
      return `Maximum length is ${validation.max}`;
    }

    if (validation.pattern && !validation.pattern.test(val)) {
      return 'Invalid format';
    }

    if (validation.custom) {
      return validation.custom(val);
    }

    return null;
  }, [validation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const validationError = validateValue(newValue);
    setLocalError(validationError);
    onChange?.(newValue);
  };

  const displayError = error || localError;

  return (
    <StandardField
      label={label}
      description={description}
      required={required}
      error={displayError}
      className={className}
    >
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        data-testid={testId}
        className={cn(displayError && 'border-destructive')}
      />
    </StandardField>
  );
};

/**
 * Standard textarea field
 */
export interface StandardTextareaProps extends FormComponentProps<string> {
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export const StandardTextarea: React.FC<StandardTextareaProps> = ({
  label,
  description,
  required,
  placeholder,
  rows = 3,
  value = '',
  onChange,
  error,
  disabled,
  validation,
  className,
  testId,
}) => {
  const [localError, setLocalError] = React.useState<string | null>(null);

  const validateValue = React.useCallback((val: string) => {
    if (!validation) return null;

    if (validation.required && !val.trim()) {
      return 'This field is required';
    }

    if (validation.min && val.length < validation.min) {
      return `Minimum length is ${validation.min}`;
    }

    if (validation.max && val.length > validation.max) {
      return `Maximum length is ${validation.max}`;
    }

    if (validation.custom) {
      return validation.custom(val);
    }

    return null;
  }, [validation]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const validationError = validateValue(newValue);
    setLocalError(validationError);
    onChange?.(newValue);
  };

  const displayError = error || localError;

  return (
    <StandardField
      label={label}
      description={description}
      required={required}
      error={displayError}
      className={className}
    >
      <Textarea
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        data-testid={testId}
        className={cn(displayError && 'border-destructive')}
      />
    </StandardField>
  );
};