'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('semi-dark');
  const [sidebarTheme, setSidebarTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);
  const [companyTheme, setCompanyTheme] = useState(null);
  const api = useApi();

  // Helper para verificar se deve usar modo dark
  const isDarkMode = (isSidebar = false) => {
    if (isSidebar && theme === 'semi-dark') return true;
    return theme === 'dark';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'semi-dark' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Só aplica a classe dark se estiver no modo totalmente dark
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    // Carrega o tema inicial do localStorage
    const savedTheme = localStorage.getItem('theme') || 'semi-dark';
    setTheme(savedTheme);
    
    // Aplica a classe dark apenas se estiver no modo totalmente dark
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    // Carrega o tema da empresa baseado no domínio atual
    const loadCompanyTheme = async () => {
      try {
        const response = await api.get('company/theme');
        const { theme: themeData, branding } = response.data;
        
        setCompanyTheme({ theme: themeData, branding });
        
        // Aplica o tema da empresa
        if (themeData) {
          document.documentElement.style.setProperty('--primary-color', themeData.primaryColor);
          document.documentElement.style.setProperty('--primary-color-hover', themeData.primaryColorHover);
          document.documentElement.style.setProperty('--primary-color-light', themeData.primaryColorLight);
          document.documentElement.style.setProperty('--primary-color-dark', themeData.primaryColorDark);
        }
      } catch (error) {
        console.error('Erro ao carregar tema da empresa:', error);
      }
    };

    loadCompanyTheme();
  }, []);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    sidebarTheme,
    setSidebarTheme,
    companyTheme,
    setCompanyTheme,
    mounted,
    isDarkMode
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 