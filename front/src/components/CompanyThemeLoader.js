'use client';
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/contexts/SettingsContext';

export function CompanyThemeLoader({ children }) {
  const api = useApi();
  const { settings } = useSettings();
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const loadCompanyTheme = async () => {
      try {
        const response = await api.get('company/theme');
        const theme = response.data.theme;

        // Aplica as variáveis CSS globalmente apenas se não houver tema nos settings
        if (!settings?.company?.settings?.theme) {
          document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
          document.documentElement.style.setProperty('--primary-color-hover', theme.primaryColorHover);
          document.documentElement.style.setProperty('--primary-color-light', theme.primaryColorLight);
          document.documentElement.style.setProperty('--primary-color-dark', theme.primaryColorDark);
        }
      } catch (error) {
        console.error('Erro ao carregar tema da empresa:', error);
      } finally {
        setThemeLoaded(true);
      }
    };

    loadCompanyTheme();
  }, [settings]);

  if (!themeLoaded) {
    return null; // ou um loading spinner
  }

  return children;
} 