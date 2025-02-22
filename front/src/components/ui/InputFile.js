'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function InputFile({
  label,
  accept,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  onChange,
  ...props
}) {
  const { settings } = useSettings();
  const theme = settings?.company?.settings?.theme;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label
              htmlFor="file-upload"
              className={`
                relative cursor-pointer rounded-md font-medium 
                text-[${theme?.primaryColor}] hover:text-[${theme?.primaryColorHover}]
                focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 
                focus-within:ring-[${theme?.primaryColor}]
                ${disabled ? 'cursor-not-allowed opacity-60' : ''}
              `}
            >
              <span>Carregar arquivo</span>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                disabled={disabled}
                accept={accept}
                onChange={onChange}
                {...props}
              />
            </label>
            <p className="pl-1">ou arraste e solte</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept ? `Tipos permitidos: ${accept}` : 'Qualquer tipo de arquivo'}
          </p>
        </div>
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
} 