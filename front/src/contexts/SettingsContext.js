'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const SettingsContext = createContext({});

export function SettingsProvider({ children }) {
  const api = useApi();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    company: {
      name: "",
      document: "",
      email: "",
      phone: "",
      logo: null,
      icon: null,
      favicon: null,
      settings: {
        paymentMethods: [],
        currency: "BRL",
        smtpServer: "",
        senderEmail: "",
        whatsappKey: "",
        telegramToken: "",
        theme: {
          primaryColor: "#4F46E5", // Cor padrão do Indigo-600
          primaryColorHover: "#4338CA", // Indigo-700
          primaryColorLight: "#818CF8", // Indigo-400
          primaryColorDark: "#3730A3", // Indigo-800
        }
      }
    },
    user: {
      settings: {
        theme: "light",
        density: "normal",
        highContrast: false,
        fontSize: "medium"
      }
    }
  });

  const loadSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('settings');
      const { user_settings, company_settings } = response.data;
      
      setSettings(prev => ({
        company: {
          name: user?.company?.name || "",
          document: user?.company?.document || "",
          email: user?.company?.email || "",
          phone: user?.company?.phone || "",
          logo: user?.company?.logo || null,
          icon: user?.company?.icon || null,
          favicon: user?.company?.favicon || null,
          settings: {
            ...prev.company.settings,
            ...company_settings
          }
        },
        user: {
          settings: {
            ...prev.user.settings,
            ...user_settings
          }
        }
      }));
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      if (error.response?.status !== 401) {
        toast.error('Erro ao carregar configurações');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      // Atualiza configurações do usuário
      await api.put('settings/user', {
        settings: newSettings.user.settings
      });

      // Atualiza configurações da empresa
      if (user?.company_id) {
        await api.put('settings/company', {
          settings: newSettings.company.settings,
          name: newSettings.company.name,
          document: newSettings.company.document,
          email: newSettings.company.email,
          phone: newSettings.company.phone
        });
      }

      setSettings(newSettings);
      toast.success('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações');
      throw error;
    }
  };

  const updateUserSettings = async (userSettings) => {
    try {
      await api.put('settings/user', {
        settings: userSettings
      });

      setSettings(prev => ({
        ...prev,
        user: {
          settings: userSettings
        }
      }));

      toast.success('Configurações do usuário atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações do usuário:', error);
      toast.error('Erro ao atualizar configurações do usuário');
      throw error;
    }
  };

  const updateCompanySettings = async (companyData) => {
    try {
      await api.put('settings/company', companyData);

      setSettings(prev => ({
        ...prev,
        company: {
          ...prev.company,
          ...companyData
        }
      }));

      toast.success('Configurações da empresa atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações da empresa:', error);
      toast.error('Erro ao atualizar configurações da empresa');
      throw error;
    }
  };

  const updateCompanyBranding = async (files) => {
    try {
      const formData = new FormData();
      if (files.logo) formData.append('logo', files.logo);
      if (files.icon) formData.append('icon', files.icon);
      if (files.favicon) formData.append('favicon', files.favicon);

      const response = await api.post('settings/company/branding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setSettings(prev => ({
        ...prev,
        company: {
          ...prev.company,
          logo: response.data.logo || prev.company.logo,
          icon: response.data.icon || prev.company.icon,
          favicon: response.data.favicon || prev.company.favicon,
        }
      }));

      toast.success('Imagens da empresa atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar imagens da empresa:', error);
      toast.error('Erro ao atualizar imagens da empresa');
      throw error;
    }
  };

  const updateCompanyTheme = (theme) => {
    setSettings(prev => ({
      ...prev,
      company: {
        ...prev.company,
        settings: {
          ...prev.company.settings,
          theme
        }
      }
    }));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (user?.company) {
      setSettings(prev => ({
        ...prev,
        company: {
          ...prev.company,
          name: user.company.name || prev.company.name,
          document: user.company.document || prev.company.document,
          email: user.company.email || prev.company.email,
          phone: user.company.phone || prev.company.phone,
          logo: user.company.logo || prev.company.logo,
          icon: user.company.icon || prev.company.icon,
          favicon: user.company.favicon || prev.company.favicon,
        }
      }));
    }
  }, [user]);

  return (
    <SettingsContext.Provider 
      value={{
        settings,
        loading,
        updateSettings,
        updateUserSettings,
        updateCompanySettings,
        updateCompanyBranding,
        updateCompanyTheme,
        loadSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
} 