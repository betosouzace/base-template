'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('semi-dark');
  const [sidebarTheme, setSidebarTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Recupera a preferência do usuário ou usa o padrão 'semi-dark'
    const savedTheme = localStorage.getItem('theme') || 'semi-dark';
    const savedSidebarTheme = localStorage.getItem('sidebarTheme') || 'dark';
    setTheme(savedTheme);
    setSidebarTheme(savedSidebarTheme);
    
    // Aplica o tema inicial
    if (savedTheme === 'dark' || savedTheme === 'semi-dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', savedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    setSidebarTheme(newTheme === 'semi-dark' ? 'dark' : newTheme);
    
    // Atualiza a classe no html para o Tailwind
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Atualiza o atributo data-theme para as variáveis CSS customizadas
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Salva a preferência do usuário
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('sidebarTheme', newTheme === 'semi-dark' ? 'dark' : newTheme);
  };

  // Previne a renderização até que o tema seja carregado do localStorage
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, sidebarTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 