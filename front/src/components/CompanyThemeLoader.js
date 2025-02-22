'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useApi } from '@/hooks/useApi';
import Head from 'next/head';

export function CompanyThemeLoader({ children }) {
  const { setCompanyTheme } = useTheme();
  const api = useApi();
  const [branding, setBranding] = useState(null);

  useEffect(() => {
    const loadCompanyTheme = async () => {
      try {
        const response = await api.get('company/theme');
        const { theme, branding: brandingData } = response.data;
        
        // Aplica o tema da empresa baseado no domínio atual
        if (theme) {
          document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
          document.documentElement.style.setProperty('--primary-color-hover', theme.primaryColorHover);
          document.documentElement.style.setProperty('--primary-color-light', theme.primaryColorLight);
          document.documentElement.style.setProperty('--primary-color-dark', theme.primaryColorDark);
        }

        // Atualiza favicon e título se disponíveis
        if (brandingData?.favicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = brandingData.favicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }

        if (brandingData?.name) {
          document.title = brandingData.name;
        }

        setBranding(brandingData);
        setCompanyTheme({ theme, branding: brandingData });
      } catch (error) {
        console.error('Erro ao carregar tema da empresa:', error);
      }
    };

    loadCompanyTheme();
  }, []);

  return (
    <>
      <Head>
        {branding?.name && <title>{branding.name}</title>}
        {branding?.favicon && (
          <link 
            rel="icon" 
            type="image/x-icon" 
            href={branding.favicon}
          />
        )}
      </Head>
      {children}
    </>
  );
} 