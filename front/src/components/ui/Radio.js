'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function Radio({
  label,
  checked = false,
  disabled = false,
  error,
  helperText,
  className = '',
  onChange,
  ...props
}) {
  const { settings } = useSettings();
  const theme = settings?.company?.settings?.theme;

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className={`
            w-4 h-4 border-gray-300 
            text-[${theme?.primaryColor}] 
            focus:ring-[${theme?.primaryColor}]
            dark:border-gray-600 dark:bg-gray-700
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-2">
          <label className={`
            text-sm font-medium 
            ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}
          `}>
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