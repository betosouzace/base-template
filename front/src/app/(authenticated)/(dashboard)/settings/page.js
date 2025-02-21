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
import { ChromePicker } from 'react-color';

const SettingsPage = () => {
  const { settings, loading, updateSettings, loadSettings, updateCompanyBranding } = useSettings();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const api = useApi();
  const [activeTab, setActiveTab] = useState("company");
  const [formData, setFormData] = useState({
    company: {
      name: "",
      document: "",
      email: "",
      phone: "",
      settings: {
        theme: {
          primaryColor: "#4F46E5",
          primaryColorHover: "#4338CA",
          primaryColorLight: "#818CF8",
          primaryColorDark: "#3730A3",
        }
      }
    }
  });
  const [showColorPicker, setShowColorPicker] = useState({
    primaryColor: false,
    primaryColorHover: false,
    primaryColorLight: false,
    primaryColorDark: false
  });

  useEffect(() => {
    if (settings?.company) {
      setFormData(settings);
    }
  }, [settings]);

  useEffect(() => {
    console.log('Settings atualizados:', settings);
    console.log('FormData atualizado:', formData);
  }, [settings, formData]);

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

  const handleSave = async () => {
    try {
      await updateSettings(formData);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja resetar todas as configurações?")) {
      loadSettings();
      toast.info("Configurações resetadas para o padrão");
    }
  };

  const handleFileChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await updateCompanyBranding({
        [type]: file
      });
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleColorChange = (color, field) => {
    handleSettingsChange('company', 'settings', {
      ...formData.company.settings,
      theme: {
        ...formData.company.settings.theme,
        [field]: color.hex
      }
    });
  };

  const tabs = [
    { id: "company", label: "Informações da Empresa", icon: <FaBuilding /> },
    { id: "payment", label: "Configurações de Pagamento", icon: <FaCreditCard /> },
    { id: "communication", label: "Canais de Comunicação", icon: <FaComments /> },
    { id: "interface", label: "Preferências de Interface", icon: <FaPalette /> },
    { id: "branding", label: "Personalização", icon: <FaPalette /> }
  ];

  const renderBrandingSection = () => {
    const theme = formData?.company?.settings?.theme ?? {
      primaryColor: "#4F46E5",
      primaryColorHover: "#4338CA",
      primaryColorLight: "#818CF8",
      primaryColorDark: "#3730A3",
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Personalização da Marca</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Logo da Empresa</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'logo')}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          {/* Icon Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Ícone</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'icon')}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          {/* Favicon Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Favicon</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'favicon')}
              accept=".ico,image/x-icon,image/png"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium">Cores do Tema</h4>
          
          {/* Color Pickers */}
          {['primaryColor', 'primaryColorHover', 'primaryColorLight', 'primaryColorDark'].map((colorKey) => (
            <div key={colorKey} className="flex items-center space-x-4">
              <label className="text-sm font-medium w-40">{colorKey}</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(prev => ({ ...prev, [colorKey]: !prev[colorKey] }))}
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: theme[colorKey] }}
                />
                {showColorPicker[colorKey] && (
                  <div className="absolute z-10 mt-2">
                    <div
                      className="fixed inset-0"
                      onClick={() => setShowColorPicker(prev => ({ ...prev, [colorKey]: false }))}
                    />
                    <ChromePicker
                      color={theme[colorKey]}
                      onChange={(color) => handleColorChange(color, colorKey)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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