'use client';
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import Head from 'next/head';

export function CompanyThemeLoader({ children }) {
  const api = useApi();
  const { settings, updateCompanyTheme } = useSettings();
  const { toggleTheme } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    const loadCompanyTheme = async () => {
      try {
        const response = await api.get('company/theme', {
          skipAuthRefresh: true,
          withCredentials: false
        });
        
        const { theme, branding } = response.data;

        // Aplica as variáveis CSS globalmente
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        document.documentElement.style.setProperty('--primary-color-hover', theme.primaryColorHover);
        document.documentElement.style.setProperty('--primary-color-light', theme.primaryColorLight);
        document.documentElement.style.setProperty('--primary-color-dark', theme.primaryColorDark);
        
        // Atualiza o tema no contexto de settings
        updateCompanyTheme(theme);
        setBranding(branding);
        
        // Aplica o modo do tema (dark, light ou semi-dark)
        const themeMode = theme.mode || 'semi-dark';
        toggleTheme(themeMode);
        
        // Atualiza o título da página
        if (branding.name) {
          document.title = branding.name;
        }

        // Atualiza o favicon
        if (branding.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.favicon}`;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      } catch (error) {
        console.error('Erro ao carregar tema da empresa:', error);
        // Se houver erro, aplica o tema padrão semi-dark
        toggleTheme('semi-dark');
      } finally {
        setThemeLoaded(true);
      }
    };

    loadCompanyTheme();
  }, []);

  if (!themeLoaded) {
    return null;
  }

  return (
    <>
      <Head>
        {branding?.name && <title>{branding.name}</title>}
        {branding?.favicon && (
          <link 
            rel="icon" 
            type="image/x-icon" 
            href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.favicon}`}
          />
        )}
      </Head>
      {children}
    </>
  );
} 