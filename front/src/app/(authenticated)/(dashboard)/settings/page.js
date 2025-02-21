'use client';
import { useState, useEffect } from 'react';
import { FiSave, FiRotateCcw, FiUpload, FiDownload } from "react-icons/fi";
import { FaBuilding, FaCreditCard, FaComments, FaPalette } from "react-icons/fa";
import { BsSun, BsMoonStars } from "react-icons/bs";
import { HiOutlineAdjustments } from "react-icons/hi";
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useSettings } from '@/contexts/SettingsContext';

const SettingsPage = () => {
  const { settings, loading, updateCompanySettings, updateCompanyBranding, loadSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const api = useApi();
  const [activeTab, setActiveTab] = useState("company");
  
  // Inicializar formData com valores do settings
  const [formData, setFormData] = useState({
    company: {
      name: settings?.company?.name || '',
      document: settings?.company?.document || '',
      email: settings?.company?.email || '',
      phone: settings?.company?.phone || '',
      settings: {
        theme: settings?.company?.settings?.theme || {
          primaryColor: '#4F46E5',
          primaryColorHover: '#4338CA',
          primaryColorLight: '#818CF8',
          primaryColorDark: '#3730A3'
        },
        paymentMethods: settings?.company?.settings?.paymentMethods || [],
        currency: settings?.company?.settings?.currency || 'BRL',
        smtpServer: settings?.company?.settings?.smtpServer || '',
        senderEmail: settings?.company?.settings?.senderEmail || '',
        whatsappKey: settings?.company?.settings?.whatsappKey || '',
        telegramToken: settings?.company?.settings?.telegramToken || ''
      }
    },
    user: {
      settings: settings?.user?.settings || {
        theme: 'light',
        density: 'normal',
        fontSize: 'medium',
        highContrast: false
      }
    }
  });

  // Atualizar formData quando settings mudar
  useEffect(() => {
    if (settings) {
      setFormData({
        company: {
          name: settings.company.name || '',
          document: settings.company.document || '',
          email: settings.company.email || '',
          phone: settings.company.phone || '',
          settings: {
            theme: settings.company.settings?.theme || formData.company.settings.theme,
            paymentMethods: settings.company.settings?.paymentMethods || [],
            currency: settings.company.settings?.currency || 'BRL',
            smtpServer: settings.company.settings?.smtpServer || '',
            senderEmail: settings.company.settings?.senderEmail || '',
            whatsappKey: settings.company.settings?.whatsappKey || '',
            telegramToken: settings.company.settings?.telegramToken || ''
          }
        },
        user: {
          settings: settings.user.settings || formData.user.settings
        }
      });
    }
  }, [settings]);

  const [showColorPicker, setShowColorPicker] = useState({
    primaryColor: false,
    primaryColorHover: false,
    primaryColorLight: false,
    primaryColorDark: false
  });
  const [logoFile, setLogoFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (isAuthenticated) {
        try {
          await loadSettings();
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
          toast.error('Erro ao carregar configurações');
        }
      }
    };

    fetchSettings();
  }, [isAuthenticated]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSettingsChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        settings: {
          ...prev[section].settings,
          [field]: value
        }
      }
    }));
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    switch (type) {
      case 'logo':
        setLogoFile(file);
        break;
      case 'icon':
        setIconFile(file);
        break;
      case 'favicon':
        setFaviconFile(file);
        break;
    }
  };

  const handleColorChange = (color, field) => {
    const newTheme = {
      ...formData.company.settings.theme,
      [field]: color
    };

    setFormData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        settings: {
          ...prev.company.settings,
          theme: newTheme
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Primeiro, salva as configurações gerais
      await updateCompanySettings(formData);

      // Se houver arquivos, faz o upload
      if (logoFile || iconFile || faviconFile) {
        const files = {
          logo: logoFile,
          icon: iconFile,
          favicon: faviconFile
        };
        await updateCompanyBranding(files);
      }

      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja resetar todas as configurações?")) {
      loadSettings();
      toast.info("Configurações resetadas para o padrão");
    }
  };

  const tabs = [
    { id: "company", label: "Informações da Empresa", icon: <FaBuilding /> },
    { id: "payment", label: "Configurações de Pagamento", icon: <FaCreditCard /> },
    { id: "communication", label: "Canais de Comunicação", icon: <FaComments /> },
    { id: "interface", label: "Preferências de Interface", icon: <FaPalette /> },
    { id: "branding", label: "Personalização", icon: <FaPalette /> }
  ];

  const renderBrandingSection = () => {
    const theme = formData.company.settings.theme || {
      primaryColor: "#4F46E5",
      primaryColorHover: "#4338CA",
      primaryColorLight: "#818CF8",
      primaryColorDark: "#3730A3"
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Cores da Marca</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cor Primária</label>
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => handleColorChange(e.target.value, 'primaryColor')}
                className="w-full h-10 p-1 rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cor Hover</label>
              <input
                type="color"
                value={theme.primaryColorHover}
                onChange={(e) => handleColorChange(e.target.value, 'primaryColorHover')}
                className="w-full h-10 p-1 rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cor Clara</label>
              <input
                type="color"
                value={theme.primaryColorLight}
                onChange={(e) => handleColorChange(e.target.value, 'primaryColorLight')}
                className="w-full h-10 p-1 rounded border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cor Escura</label>
              <input
                type="color"
                value={theme.primaryColorDark}
                onChange={(e) => handleColorChange(e.target.value, 'primaryColorDark')}
                className="w-full h-10 p-1 rounded border"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "branding":
        return renderBrandingSection();
      case "company":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={formData.company.name || ''}
                  onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.company.document || ''}
                  onChange={(e) => handleInputChange('company', 'document', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.company.email || ''}
                  onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.company.phone || ''}
                  onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        );
      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Métodos de Pagamento
              </label>
              <div className="space-y-2">
                {["Cartão de Crédito", "Transferência Bancária", "Pix"].map((method) => (
                  <label key={method} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.company.settings.paymentMethods?.includes(method)}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...(formData.company.settings.paymentMethods || []), method]
                          : formData.company.settings.paymentMethods?.filter((m) => m !== method);
                        handleSettingsChange('company', 'paymentMethods', methods);
                      }}
                      className="w-4 h-4 text-indigo-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case "communication":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={formData.company.settings.smtpServer || ''}
                  onChange={(e) => handleSettingsChange('company', 'smtpServer', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email do Remetente
                </label>
                <input
                  type="email"
                  value={formData.company.settings.senderEmail || ''}
                  onChange={(e) => handleSettingsChange('company', 'senderEmail', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chave WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.company.settings.whatsappKey || ''}
                  onChange={(e) => handleSettingsChange('company', 'whatsappKey', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Token Telegram
                </label>
                <input
                  type="text"
                  value={formData.company.settings.telegramToken || ''}
                  onChange={(e) => handleSettingsChange('company', 'telegramToken', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        );
      case "interface":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Tema
              </label>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme('light');
                    handleSettingsChange('user', 'theme', 'light');
                  }}
                  className={`
                    inline-flex items-center px-4 py-2 text-sm font-medium 
                    border border-gray-200 
                    rounded-l-lg 
                    hover:bg-gray-100 
                    hover:text-indigo-700 
                    focus:z-10 
                    focus:ring-2 
                    focus:ring-indigo-500 
                    focus:text-indigo-700
                    dark:border-gray-600 
                    dark:hover:text-white 
                    dark:hover:bg-gray-600 
                    ${theme === 'light' 
                      ? 'bg-indigo-500 text-white hover:text-white hover:bg-indigo-600' 
                      : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white'
                    }
                  `}
                >
                  <BsSun className="mr-2 h-4 w-4" />
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme('semi-dark');
                    handleSettingsChange('user', 'theme', 'semi-dark');
                  }}
                  className={`
                    inline-flex items-center px-4 py-2 text-sm font-medium 
                    border-t border-b border-gray-200
                    hover:bg-gray-100 
                    hover:text-indigo-700 
                    focus:z-10 
                    focus:ring-2 
                    focus:ring-indigo-500 
                    focus:text-indigo-700
                    dark:border-gray-600 
                    dark:hover:text-white 
                    dark:hover:bg-gray-600
                    ${theme === 'semi-dark' 
                      ? 'bg-indigo-500 text-white hover:text-white hover:bg-indigo-600' 
                      : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white'
                    }
                  `}
                >
                  <HiOutlineAdjustments className="mr-2 h-4 w-4" />
                  Semi Escuro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme('dark');
                    handleSettingsChange('user', 'theme', 'dark');
                  }}
                  className={`
                    inline-flex items-center px-4 py-2 text-sm font-medium 
                    border border-gray-200 
                    rounded-r-lg 
                    hover:bg-gray-100 
                    hover:text-indigo-700 
                    focus:z-10 
                    focus:ring-2 
                    focus:ring-indigo-500 
                    focus:text-indigo-700
                    dark:border-gray-600 
                    dark:hover:text-white 
                    dark:hover:bg-gray-600
                    ${theme === 'dark' 
                      ? 'bg-indigo-500 text-white hover:text-white hover:bg-indigo-600' 
                      : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white'
                    }
                  `}
                >
                  <BsMoonStars className="mr-2 h-4 w-4" />
                  Escuro
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || !settings?.company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Configurações do Sistema</h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar com tabs */}
          <div className="md:w-64 p-4 border-r border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-3 mb-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 p-6">
            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 mb-6">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <FiRotateCcw className="mr-2" /> Resetar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
              >
                <FiSave className="mr-2" /> Salvar Alterações
              </button>
            </div>

            {/* Conteúdo das tabs */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 