'use client';
import { useSettings } from '@/contexts/SettingsContext';

export function ThemeWrapper({ children }) {
  const { settings } = useSettings();
  
  // Valores padrão caso as configurações não estejam disponíveis
  const defaultTheme = {
    primaryColor: '#4F46E5',
    primaryColorHover: '#4338CA',
    primaryColorLight: '#818CF8',
    primaryColorDark: '#3730A3',
  };

  // Usa o operador de coalescência nula para garantir valores padrão
  const theme = settings?.company?.settings?.theme ?? defaultTheme;

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