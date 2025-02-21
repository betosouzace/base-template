'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const WizardPage = () => {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Usar useEffect para atualizar formData quando settings mudar
  const [formData, setFormData] = useState({
    name: settings.company.name,
    document: settings.company.document,
    email: settings.company.email,
    phone: settings.company.phone,
    paymentMethods: settings.company.settings.paymentMethods,
    currency: settings.company.settings.currency,
    smtpServer: settings.company.settings.smtpServer,
    senderEmail: settings.company.settings.senderEmail,
    whatsappKey: settings.company.settings.whatsappKey,
    telegramToken: settings.company.settings.telegramToken,
    theme: settings.user.settings.theme,
    density: settings.user.settings.density,
    fontSize: settings.user.settings.fontSize,
    highContrast: settings.user.settings.highContrast
  });

  useEffect(() => {
    setFormData({
      name: settings.company.name,
      document: settings.company.document,
      email: settings.company.email,
      phone: settings.company.phone,
      paymentMethods: settings.company.settings.paymentMethods,
      currency: settings.company.settings.currency,
      smtpServer: settings.company.settings.smtpServer,
      senderEmail: settings.company.settings.senderEmail,
      whatsappKey: settings.company.settings.whatsappKey,
      telegramToken: settings.company.settings.telegramToken,
      theme: settings.user.settings.theme,
      density: settings.user.settings.density,
      fontSize: settings.user.settings.fontSize,
      highContrast: settings.user.settings.highContrast
    });
  }, [settings]);

  useEffect(() => {
    checkWizardStatus();
  }, []);

  useEffect(() => {
    // Se tiver empresa vinculada, redireciona para o dashboard
    if (user?.company_id) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const checkWizardStatus = async () => {
    try {
      const response = await api.get('/wizard/status');
      if (!response.data.needs_wizard) {
        router.push('/settings');
        return;
      }
      setCurrentStep(response.data.current_step);
    } catch (error) {
      toast.error('Erro ao verificar status do wizard');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    try {
      const newSettings = {
        company: {
          name: formData.name,
          document: formData.document,
          email: formData.email,
          phone: formData.phone,
          settings: {
            paymentMethods: formData.paymentMethods,
            currency: formData.currency,
            smtpServer: formData.smtpServer,
            senderEmail: formData.senderEmail,
            whatsappKey: formData.whatsappKey,
            telegramToken: formData.telegramToken,
          }
        },
        user: {
          settings: {
            theme: formData.theme,
            density: formData.density,
            fontSize: formData.fontSize,
            highContrast: formData.highContrast
          }
        }
      };

      await updateSettings(newSettings);
      
      if (currentStep === 4) {
        router.push('/settings');
        toast.success('Configuração inicial concluída!');
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informações da Empresa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nome da Empresa"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="text"
                placeholder="CNPJ"
                value={formData.document}
                onChange={(e) => handleInputChange('document', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Métodos de Pagamento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Moeda Padrão
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Métodos de Pagamento Aceitos
                </label>
                {["Cartão de Crédito", "Transferência Bancária", "Pix", "Boleto"].map((method) => (
                  <label key={method} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method)}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...formData.paymentMethods, method]
                          : formData.paymentMethods.filter(m => m !== method);
                        handleInputChange('paymentMethods', methods);
                      }}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Canais de Comunicação</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  placeholder="smtp.exemplo.com"
                  value={formData.smtpServer}
                  onChange={(e) => handleInputChange('smtpServer', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email do Remetente
                </label>
                <input
                  type="email"
                  placeholder="noreply@empresa.com"
                  value={formData.senderEmail}
                  onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chave WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsappKey}
                  onChange={(e) => handleInputChange('whatsappKey', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Token Telegram
                </label>
                <input
                  type="text"
                  value={formData.telegramToken}
                  onChange={(e) => handleInputChange('telegramToken', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Preferências de Interface</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tema
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="light">Claro</option>
                  <option value="semi-dark">Semi Escuro</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Densidade
                </label>
                <select
                  value={formData.density}
                  onChange={(e) => handleInputChange('density', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="compact">Compacta</option>
                  <option value="normal">Normal</option>
                  <option value="comfortable">Confortável</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamanho da Fonte
                </label>
                <select
                  value={formData.fontSize}
                  onChange={(e) => handleInputChange('fontSize', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="small">Pequena</option>
                  <option value="medium">Média</option>
                  <option value="large">Grande</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.highContrast}
                    onChange={(e) => handleInputChange('highContrast', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Alto Contraste</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Configuração Inicial</h1>
              <span className="text-sm text-gray-500">
                Etapa {currentStep} de 4
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderStep()}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentStep === 4 ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardPage; 