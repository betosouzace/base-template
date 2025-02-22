'use client';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeWrapper({ children }) {
  const { companyTheme } = useTheme();
  
  // Valores padrão caso as configurações não estejam disponíveis
  const defaultTheme = {
    primaryColor: '#4F46E5',
    primaryColorHover: '#4338CA',
    primaryColorLight: '#818CF8',
    primaryColorDark: '#3730A3',
  };

  // Usa o tema da empresa ou o tema padrão
  const theme = companyTheme?.theme ?? defaultTheme;

  return (
    <div style={{
      '--primary-color': theme.primaryColor,
      '--primary-color-hover': theme.primaryColorHover,
      '--primary-color-light': theme.primaryColorLight,
      '--primary-color-dark': theme.primaryColorDark,
    }}>
      {children}
    </div>
  );
} 