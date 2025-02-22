'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  size = 'md',
  disabled = false,
  required = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
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
             dark:border-gray-600 dark:bg-gray-700 dark:text-white
             autofill:bg-white dark:autofill:bg-gray-700
             autofill:text-gray-900 dark:autofill:text-white
             [-webkit-autofill]:bg-white dark:[-webkit-autofill]:bg-gray-700
             [-webkit-autofill]:text-gray-900 dark:[-webkit-autofill]:text-white`,
    error: "border-red-500 focus:border-red-500 focus:ring-red-500",
    disabled: "bg-gray-100 cursor-not-allowed dark:bg-gray-800"
  };

  const iconStyles = Icon ? (
    iconPosition === 'left' ? 'pl-10' : 'pr-10'
  ) : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          disabled={disabled}
          required={required}
          className={`
            ${baseStyles}
            ${sizeStyles[size]}
            ${disabled ? stateStyles.disabled : error ? stateStyles.error : stateStyles.normal}
            ${fullWidth ? 'w-full' : ''}
            ${iconStyles}
          `}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
} 