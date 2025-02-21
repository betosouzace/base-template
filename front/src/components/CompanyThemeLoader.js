'use client';
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useSettings } from '@/contexts/SettingsContext';
import Head from 'next/head';

export function CompanyThemeLoader({ children }) {
  const api = useApi();
  const { settings, updateCompanyTheme } = useSettings();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    const loadCompanyTheme = async () => {
      try {
        // Usa uma instância do axios sem interceptors de autenticação
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
        
        // Atualiza o branding
        setBranding(branding);
        
        // Atualiza o favicon se existir
        if (branding.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = branding.favicon.startsWith('http') 
            ? branding.favicon 
            : `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.favicon}`;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        
        // Atualiza o título da página
        document.title = branding.name;
      } catch (error) {
        console.error('Erro ao carregar tema da empresa:', error);
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
      {branding && (
        <Head>
          <title>{branding.name}</title>
          {branding.favicon && (
            <link 
              rel="shortcut icon" 
              href={branding.favicon.startsWith('http') 
                ? branding.favicon 
                : `${process.env.NEXT_PUBLIC_API_URL}/storage/${branding.favicon}`
              }
            />
          )}
        </Head>
      )}
      {children}
    </>
  );
} 