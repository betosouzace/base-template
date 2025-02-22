'use client';
import { useSettings } from '@/contexts/SettingsContext';
import { useId } from 'react';

export function Checkbox({
  label,
  checked = false,
  disabled = false,
  error,
  helperText,
  className = '',
  id: providedId,
  onChange,
  ...props
}) {
  // Gera um ID único se não for fornecido
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className={`
            w-4 h-4 rounded border-gray-300 
            ${checked && !disabled ? 'text-[var(--primary-color)] focus:ring-[var(--primary-color)]' : ''}
            dark:border-gray-600 dark:bg-gray-700
            ${disabled ? 'cursor-not-allowed opacity-60 dark:bg-gray-600' : 'cursor-pointer'}
            ${error ? 'border-red-500' : ''}
            transition-colors
          `}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-2">
          <label
            htmlFor={id}
            className={`
              text-sm font-medium 
              ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300 cursor-pointer'}
            `}
          >
            {label}
          </label>
          {(error || helperText) && (
            <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {error || helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 