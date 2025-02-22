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
import { CompanyLogo } from '@/components/CompanyLogo';

// Importando os componentes UI
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { InputFile } from '@/components/ui/InputFile';
import { Checkbox } from '@/components/ui/Checkbox';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { TextArea } from '@/components/ui/TextArea';
import { DragAndDrop } from '@/components/ui/DragAndDrop';

const SettingsPage = () => {
  const { settings, loading, updateCompanySettings, updateUserSettings, updateCompanyBranding, loadSettings } = useSettings();
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
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [hasFileChanges, setHasFileChanges] = useState(false);

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

  const handleFileChange = (file, type) => {
    if (!file) return;

    // Novo limite unificado de 10MB para todos os tipos
    const maxSize = 10240; // 10MB em KB
    const fileSize = Math.round(file.size / 1024); // Converter para KB

    if (fileSize > maxSize) {
      toast.error(`O arquivo deve ter no máximo 10MB`);
      return;
    }

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

      // Salva as configurações gerais
      await updateCompanySettings(formData);

      // Se houver alterações nos arquivos, salva-os separadamente
      if (hasFileChanges) {
        const files = {
          logo: logoFile,
          icon: iconFile,
          favicon: faviconFile
        };
        await updateCompanyBranding(files);
        setHasFileChanges(false);
      }

      toast.success('Configurações salvas com sucesso!');
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

  const handleSaveImages = async () => {
    try {
      setIsLoading(true);
      const files = {
        logo: logoFile,
        icon: iconFile,
        favicon: faviconFile
      };

      // Só envia se houver algum arquivo selecionado
      if (Object.values(files).some(file => file)) {
        await updateCompanyBranding(files);
        
        // Limpa os estados dos arquivos após o upload
        setLogoFile(null);
        setIconFile(null);
        setFaviconFile(null);
        
        // Recarrega as configurações para atualizar as URLs das imagens
        await loadSettings();
        
        toast.success('Imagens atualizadas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar imagens:', error);
      toast.error('Erro ao salvar imagens');
    } finally {
      setIsLoading(false);
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
            <ColorPicker
              label="Cor Primária"
              color={theme.primaryColor}
              onChange={(color) => handleColorChange(color, 'primaryColor')}
            />
            <ColorPicker
              label="Cor Hover"
              color={theme.primaryColorHover}
              onChange={(color) => handleColorChange(color, 'primaryColorHover')}
            />
            <ColorPicker
              label="Cor Clara"
              color={theme.primaryColorLight}
              onChange={(color) => handleColorChange(color, 'primaryColorLight')}
            />
            <ColorPicker
              label="Cor Escura"
              color={theme.primaryColorDark}
              onChange={(color) => handleColorChange(color, 'primaryColorDark')}
            />
          </div>
        </div>

        <div className="space-y-4">
          <DragAndDrop
            label="Logo da Empresa"
            accept="image/*"
            helperText="Máximo: 10MB (JPG, PNG, GIF)"
            value={logoFile || settings?.company?.logo}
            onChange={(file) => {
              setLogoFile(file);
              setHasFileChanges(true);
            }}
          />

          <DragAndDrop
            label="Ícone da Empresa"
            accept="image/*"
            helperText="Máximo: 10MB (JPG, PNG, GIF)"
            value={iconFile || settings?.company?.icon}
            onChange={(file) => {
              setIconFile(file);
              setHasFileChanges(true);
            }}
          />

          <DragAndDrop
            label="Favicon"
            accept=".ico,image/x-icon,image/png"
            helperText="Máximo: 10MB (ICO, PNG)"
            value={faviconFile || settings?.company?.favicon}
            onChange={(file) => {
              setFaviconFile(file);
              setHasFileChanges(true);
            }}
          />

          {/* Botão para salvar imagens */}
          {hasFileChanges && (
            <Button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const files = {
                    logo: logoFile,
                    icon: iconFile,
                    favicon: faviconFile
                  };
                  await updateCompanyBranding(files);
                  setHasFileChanges(false);
                  toast.success('Imagens atualizadas com sucesso!');
                } catch (error) {
                  console.error('Erro ao salvar imagens:', error);
                  toast.error('Erro ao salvar imagens');
                } finally {
                  setIsLoading(false);
                }
              }}
              loading={isLoading}
              className="mt-4"
            >
              Salvar Imagens
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCompanySection = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome da Empresa"
            required
            value={formData.company.name || ''}
            onChange={(e) => handleInputChange('company', 'name', e.target.value)}
          />
          <Input
            label="CNPJ"
            required
            value={formData.company.document || ''}
            onChange={(e) => handleInputChange('company', 'document', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={formData.company.email || ''}
            onChange={(e) => handleInputChange('company', 'email', e.target.value)}
          />
          <Input
            label="Telefone"
            type="tel"
            value={formData.company.phone || ''}
            onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderPaymentSection = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Métodos de Pagamento
          </label>
          <div className="space-y-2">
            {["Cartão de Crédito", "Transferência Bancária", "Pix"].map((method) => (
              <Checkbox
                key={method}
                label={method}
                checked={formData.company.settings.paymentMethods?.includes(method)}
                onChange={(e) => {
                  const methods = e.target.checked
                    ? [...(formData.company.settings.paymentMethods || []), method]
                    : formData.company.settings.paymentMethods?.filter((m) => m !== method);
                  handleSettingsChange('company', 'paymentMethods', methods);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCommunicationSection = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Servidor SMTP"
            value={formData.company.settings.smtpServer || ''}
            onChange={(e) => handleSettingsChange('company', 'smtpServer', e.target.value)}
          />
          <Input
            label="Email do Remetente"
            type="email"
            value={formData.company.settings.senderEmail || ''}
            onChange={(e) => handleSettingsChange('company', 'senderEmail', e.target.value)}
          />
          <Input
            label="Chave WhatsApp"
            value={formData.company.settings.whatsappKey || ''}
            onChange={(e) => handleSettingsChange('company', 'whatsappKey', e.target.value)}
          />
          <Input
            label="Token Telegram"
            value={formData.company.settings.telegramToken || ''}
            onChange={(e) => handleSettingsChange('company', 'telegramToken', e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderInterfaceSection = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Tema
          </label>
          <div className="space-y-4">
            <ToggleSwitch
              label="Modo Claro"
              checked={theme === 'light'}
              onChange={() => {
                toggleTheme('light');
                handleSettingsChange('user', 'theme', 'light');
              }}
            />
            <ToggleSwitch
              label="Modo Semi-Escuro"
              checked={theme === 'semi-dark'}
              onChange={() => {
                toggleTheme('semi-dark');
                handleSettingsChange('user', 'theme', 'semi-dark');
              }}
            />
            <ToggleSwitch
              label="Modo Escuro"
              checked={theme === 'dark'}
              onChange={() => {
                toggleTheme('dark');
                handleSettingsChange('user', 'theme', 'dark');
              }}
            />
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
        return renderCompanySection();
      case "payment":
        return renderPaymentSection();
      case "communication":
        return renderCommunicationSection();
      case "interface":
        return renderInterfaceSection();
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Configurações do Sistema
          </h1>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar com tabs */}
          <div className="md:w-64 p-4 border-r border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                fullWidth
                className="justify-start mb-2"
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 p-6">
            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 mb-6">
              <Button
                variant="secondary"
                onClick={handleReset}
                className="flex items-center"
              >
                <FiRotateCcw className="mr-2" /> Resetar
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center"
                loading={isLoading}
              >
                <FiSave className="mr-2" /> Salvar Alterações
              </Button>
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