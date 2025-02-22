'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function ToggleSwitch({
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

  const sizeStyles = {
    sm: {
      switch: 'w-8 h-4',
      slider: 'h-3 w-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-11 h-6',
      slider: 'h-5 w-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      slider: 'h-6 w-6',
      translate: 'translate-x-7'
    }
  };

  return (
    <div className={className}>
      <label className="inline-flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.checked)}
            {...props}
          />
          <div className={`
            w-11 h-6 rounded-full 
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2
            ${disabled 
              ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed' 
              : checked
                ? 'bg-[var(--primary-color)] peer-focus:ring-[var(--primary-color)]'
                : 'bg-gray-200 dark:bg-gray-700'
            }
            transition-colors
          `}></div>
          <div className={`
            absolute left-[2px] top-[2px]
            w-5 h-5 rounded-full 
            transform transition-transform
            ${checked ? 'translate-x-full' : 'translate-x-0'}
            ${disabled
              ? 'bg-gray-400 dark:bg-gray-600'
              : 'bg-white'
            }
          `}></div>
        </div>
        {label && (
          <span className={`
            ml-3 text-sm font-medium
            ${disabled 
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
              : 'text-gray-700 dark:text-gray-300 cursor-pointer'
            }
          `}>
            {label}
          </span>
        )}
      </label>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
} 