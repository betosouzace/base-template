'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function Button({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const variantStyles = {
    primary: `bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white 
              focus:ring-[var(--primary-color)] disabled:bg-gray-300 dark:disabled:bg-gray-600`,
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    outline: `border-2 border-[var(--primary-color)] text-[var(--primary-color)] 
             hover:bg-[var(--primary-color)] hover:text-white`,
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${widthStyles}
        ${disabled ? 'cursor-not-allowed opacity-60' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Carregando...
        </>
      ) : children}
    </button>
  );
} 