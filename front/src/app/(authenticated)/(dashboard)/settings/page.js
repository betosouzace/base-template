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

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const api = useApi();
  const [activeTab, setActiveTab] = useState("company");
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    company: {
      name: "",
      document: "",
      email: "",
      phone: "",
      logo: null,
      settings: {
        paymentMethods: [],
        currency: "BRL",
        smtpServer: "",
        senderEmail: "",
        whatsappKey: "",
        telegramToken: "",
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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/settings');
      const { user_settings, company_settings } = response.data;
      
      setFormData({
        company: {
          ...user.company,
          settings: company_settings || {}
        },
        user: {
          settings: user_settings || {}
        }
      });
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

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
      // Atualiza configurações do usuário
      await api.put('settings/user', {
        settings: formData.user.settings
      });

      // Atualiza configurações da empresa se o usuário estiver vinculado a uma
      if (user.company_id) {
        await api.put('settings/company', {
          settings: formData.company.settings
        });

        // Atualiza dados básicos da empresa
        await api.put(`companies/${user.company_id}`, {
          name: formData.company.name,
          document: formData.company.document,
          email: formData.company.email,
          phone: formData.company.phone
        });
      }

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
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
    { id: "interface", label: "Preferências de Interface", icon: <FaPalette /> }
  ];

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
            {activeTab === "company" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      value={formData.company.name}
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
                      value={formData.company.document}
                      onChange={(e) => handleInputChange('company', 'document', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
                {/* Adicione mais campos conforme necessário */}
              </div>
            )}

            {activeTab === "payment" && (
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
            )}

            {activeTab === "interface" && (
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
                {/* Outras configurações de interface */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 