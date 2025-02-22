'use client';
import { useState, useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function ColorPicker({
  label,
  color,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
}) {
  const { settings } = useSettings();
  const theme = settings?.company?.settings?.theme;
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-10 h-10 rounded-lg border 
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          `}
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            px-3 py-2 rounded-lg border text-sm
            ${disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : `border-gray-300 focus:border-[${theme?.primaryColor}] focus:ring-[${theme?.primaryColor}]`
            }
            dark:border-gray-600 dark:bg-gray-700 dark:text-white
          `}
        />
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-7 gap-2">
            {[
              '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
              '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080',
              '#000080', '#FFA500', '#FFC0CB', '#800020', '#FFD700', '#98FB98', '#DDA0DD'
            ].map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => {
                  onChange(presetColor);
                  setIsOpen(false);
                }}
                className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
        </div>
      )}
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
} 