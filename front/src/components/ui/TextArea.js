'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function TextArea({
  label,
  error,
  helperText,
  fullWidth = false,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  ...props
}) {
  const { settings } = useSettings();
  const theme = settings?.company?.settings?.theme;

  const baseStyles = "rounded-lg border transition-colors focus:outline-none focus:ring-2 p-4";
  
  const stateStyles = {
    normal: `border-gray-300 focus:border-[${theme?.primaryColor}] focus:ring-[${theme?.primaryColor}] 
             dark:border-gray-600 dark:bg-gray-700 dark:text-white`,
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    disabled: "bg-gray-100 cursor-not-allowed dark:bg-gray-800"
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          ${baseStyles}
          ${disabled ? stateStyles.disabled : error ? stateStyles.error : stateStyles.normal}
          ${fullWidth ? 'w-full' : ''}
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
} 