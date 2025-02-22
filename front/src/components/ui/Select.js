'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function Select({
  label,
  options = [],
  error,
  helperText,
  fullWidth = false,
  size = 'md',
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const { settings } = useSettings();
  const theme = settings?.company?.settings?.theme;

  const baseStyles = "rounded-lg border transition-colors focus:outline-none focus:ring-2";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const stateStyles = {
    normal: `border-gray-300 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] 
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
      <select
        disabled={disabled}
        required={required}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${disabled ? stateStyles.disabled : error ? stateStyles.error : stateStyles.normal}
          ${fullWidth ? 'w-full' : ''}
          appearance-none bg-white dark:bg-gray-700
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
} 