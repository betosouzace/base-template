'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

const WizardPage = () => {
  const router = useRouter();
  const api = useApi();
  const { settings, updateSettings, loadSettings } = useSettings();
  const { user, updateUserAfterWizard } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
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
      router.push('/home');
    }
  }, [user, router]);

  const checkWizardStatus = async () => {
    try {
      const response = await api.get('wizard/status');
      if (!response.data.needs_wizard) {
        router.push('/home');
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
      // Se for o último passo, chama handleFinish
      if (currentStep === 4) {
        await handleFinish();
        return;
      }

      // Prepara os dados de acordo com o passo atual
      let stepData = {};
      switch (currentStep) {
        case 1:
          stepData = {
            name: formData.name,
            document: formData.document,
            email: formData.email,
            phone: formData.phone
          };
          break;
        case 2:
          stepData = {
            paymentMethods: formData.paymentMethods,
            currency: formData.currency
          };
          break;
        case 3:
          stepData = {
            smtpServer: formData.smtpServer,
            senderEmail: formData.senderEmail,
            whatsappKey: formData.whatsappKey,
            telegramToken: formData.telegramToken
          };
          break;
        case 4:
          stepData = {
            theme: formData.theme,
            density: formData.density,
            fontSize: formData.fontSize,
            highContrast: formData.highContrast
          };
          break;
      }

      // Salva o passo atual
      await api.post('wizard/step', {
        step: currentStep,
        ...stepData
      });
      
      // Avança para o próximo passo
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        toast.error(`Erro ao salvar configurações: ${errorMessages}`);
      } else {
        toast.error('Erro ao salvar configurações');
      }
    }
  };

  const handleFinish = async () => {
    try {
      setIsLoading(true);

      // Valida os dados obrigatórios
      if (!formData.name || !formData.document || !formData.email || !formData.phone) {
        toast.error('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Prepara os dados da empresa e do usuário
      const wizardData = {
        company: {
          name: formData.name,
          document: formData.document,
          email: formData.email,
          phone: formData.phone,
          settings: {
            paymentMethods: formData.paymentMethods || [],
            currency: formData.currency || "BRL",
            smtpServer: formData.smtpServer || "",
            senderEmail: formData.senderEmail || "",
            whatsappKey: formData.whatsappKey || "",
            telegramToken: formData.telegramToken || "",
            theme: {
              primaryColor: "#4F46E5",
              primaryColorHover: "#4338CA",
              primaryColorLight: "#818CF8",
              primaryColorDark: "#3730A3"
            }
          }
        },
        user: {
          settings: {
            theme: formData.theme || "light",
            density: formData.density || "normal",
            fontSize: formData.fontSize || "medium",
            highContrast: formData.highContrast || false
          }
        }
      };

      // Envia os dados para a API
      const response = await api.post('wizard/finish', wizardData);
      
      // Atualiza o contexto de autenticação com os novos dados do usuário
      updateUserAfterWizard(response.data.user);
      
      // Recarrega as configurações para atualizar o contexto
      await loadSettings();
      
      // Redireciona para /home ao invés de /dashboard
      router.replace('/home');
      
      toast.success('Configuração inicial concluída com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar wizard:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        toast.error(`Erro ao finalizar wizard: ${errorMessages}`);
      } else {
        toast.error('Erro ao finalizar wizard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Dados da Empresa</h2>
            <Input
              label="Nome da Empresa"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              fullWidth
            />
            <Input
              label="CNPJ"
              value={formData.document}
              onChange={(e) => handleInputChange('document', e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              fullWidth
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Configurações de Pagamento</h2>
            <Select
              label="Moeda Principal"
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              options={[
                { value: 'BRL', label: 'Real Brasileiro (BRL)' },
                { value: 'USD', label: 'Dólar Americano (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' }
              ]}
              required
              fullWidth
            />
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Métodos de Pagamento
              </label>
              <div className="space-y-2">
                {['pix', 'credit_card', 'bank_slip', 'bank_transfer'].map((method) => (
                  <ToggleSwitch
                    key={method}
                    label={method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    checked={formData.paymentMethods.includes(method)}
                    onChange={(checked) => {
                      const newMethods = checked
                        ? [...formData.paymentMethods, method]
                        : formData.paymentMethods.filter(m => m !== method);
                      handleInputChange('paymentMethods', newMethods);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Configurações de Comunicação</h2>
            <Input
              label="Servidor SMTP"
              value={formData.smtpServer}
              onChange={(e) => handleInputChange('smtpServer', e.target.value)}
              fullWidth
            />
            <Input
              label="Email do Remetente"
              type="email"
              value={formData.senderEmail}
              onChange={(e) => handleInputChange('senderEmail', e.target.value)}
              fullWidth
            />
            <Input
              label="Chave WhatsApp"
              value={formData.whatsappKey}
              onChange={(e) => handleInputChange('whatsappKey', e.target.value)}
              fullWidth
            />
            <Input
              label="Token Telegram"
              value={formData.telegramToken}
              onChange={(e) => handleInputChange('telegramToken', e.target.value)}
              fullWidth
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Preferências de Interface</h2>
            <Select
              label="Tema"
              value={formData.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              options={[
                { value: 'light', label: 'Claro' },
                { value: 'dark', label: 'Escuro' },
                { value: 'system', label: 'Sistema' }
              ]}
              fullWidth
            />
            <Select
              label="Densidade"
              value={formData.density}
              onChange={(e) => handleInputChange('density', e.target.value)}
              options={[
                { value: 'compact', label: 'Compacta' },
                { value: 'normal', label: 'Normal' },
                { value: 'comfortable', label: 'Confortável' }
              ]}
              fullWidth
            />
            <Select
              label="Tamanho da Fonte"
              value={formData.fontSize}
              onChange={(e) => handleInputChange('fontSize', e.target.value)}
              options={[
                { value: 'small', label: 'Pequena' },
                { value: 'medium', label: 'Média' },
                { value: 'large', label: 'Grande' }
              ]}
              fullWidth
            />
            <ToggleSwitch
              label="Alto Contraste"
              checked={formData.highContrast}
              onChange={(checked) => handleInputChange('highContrast', checked)}
            />
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuração Inicial</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Etapa {currentStep} de 4
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-[var(--primary-color)] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleNext}
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
            >
              {currentStep === 4 ? 'Finalizar' : 'Próximo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardPage; 