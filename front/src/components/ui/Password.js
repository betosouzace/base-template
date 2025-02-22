'use client';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { Input } from './Input';

export function Password({
  label = 'Senha',
  showPasswordLabel = 'Mostrar senha',
  hidePasswordLabel = 'Ocultar senha',
  fullWidth = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <Input
        type={showPassword ? 'text' : 'password'}
        label={label}
        icon={FaLock}
        fullWidth={fullWidth}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
        aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
      >
        {showPassword ? (
          <FaEyeSlash className="h-5 w-5" />
        ) : (
          <FaEye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
} 