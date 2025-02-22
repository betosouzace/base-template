'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';

// Importando os steps
import CompanyInfoStep from '@/views/wizard/CompanyInfoStep';
import PaymentSettingsStep from '@/views/wizard/PaymentSettingsStep';
import CommunicationSettingsStep from '@/views/wizard/CommunicationSettingsStep';
import UserPreferencesStep from '@/views/wizard/UserPreferencesStep';

const WizardPage = () => {
  const router = useRouter();
  const api = useApi();
  const { settings, updateSettings, loadSettings } = useSettings();
  const { user, updateUserAfterWizard } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Separar dados da empresa e configurações do usuário
  const [formData, setFormData] = useState({
    company: {
      name: '',
      document: '',
      email: '',
      phone: '',
      settings: {
        paymentMethods: [],
        currency: 'BRL',
        smtpServer: '',
        senderEmail: '',
        whatsappKey: '',
        telegramToken: '',
      }
    },
    user: {
      settings: {
        theme: 'light',
        density: 'normal',
        fontSize: 'medium',
        highContrast: false
      }
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        company: {
          name: settings.company?.name || '',
          document: settings.company?.document || '',
          email: settings.company?.email || '',
          phone: settings.company?.phone || '',
          settings: {
            paymentMethods: settings.company?.settings?.paymentMethods || [],
            currency: settings.company?.settings?.currency || 'BRL',
            smtpServer: settings.company?.settings?.smtpServer || '',
            senderEmail: settings.company?.settings?.senderEmail || '',
            whatsappKey: settings.company?.settings?.whatsappKey || '',
            telegramToken: settings.company?.settings?.telegramToken || '',
          }
        },
        user: {
          settings: {
            theme: settings.user?.settings?.theme || 'light',
            density: settings.user?.settings?.density || 'normal',
            fontSize: settings.user?.settings?.fontSize || 'medium',
            highContrast: settings.user?.settings?.highContrast || false
          }
        }
      });
    }
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
      setCurrentStep(response.data.current_step || 1);
    } catch (error) {
      console.error('Erro ao verificar status do wizard:', error);
      toast.error('Erro ao verificar status do wizard');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // Determina se o campo pertence às configurações da empresa ou do usuário
      if (field.startsWith('company.')) {
        const [_, ...path] = field.split('.');
        let current = newData.company;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      } else if (field.startsWith('user.')) {
        const [_, ...path] = field.split('.');
        let current = newData.user;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;
      } else {
        // Campos diretos da empresa
        newData.company[field] = value;
      }
      
      return newData;
    });
  };

  const handleNext = async () => {
    setIsLoading(true);
    setErrors({}); // Limpa erros anteriores
    
    try {
      if (currentStep === 4) {
        await api.post('wizard/finish', {
          company: {
            name: formData.company.name,
            document: formData.company.document,
            email: formData.company.email,
            phone: formData.company.phone,
            settings: {
              payment_methods: formData.company.settings.paymentMethods,
              currency: formData.company.settings.currency,
              smtp_server: formData.company.settings.smtpServer,
              sender_email: formData.company.settings.senderEmail,
              whatsapp_key: formData.company.settings.whatsappKey,
              telegram_token: formData.company.settings.telegramToken
            }
          },
          user: {
            settings: {
              theme: formData.user.settings.theme,
              density: formData.user.settings.density,
              font_size: formData.user.settings.fontSize,
              high_contrast: formData.user.settings.highContrast
            }
          }
        });

        await loadSettings();
        await updateUserAfterWizard();

        toast.success('Configuração concluída com sucesso!');
        router.push('/home');
      } else {
        let stepData = {};
        
        switch (currentStep) {
          case 1:
            stepData = {
              step: currentStep,
              name: formData.company.name,
              document: formData.company.document,
              email: formData.company.email,
              phone: formData.company.phone
            };
            break;
            
          case 2:
            stepData = {
              step: currentStep,
              paymentMethods: formData.company.settings.paymentMethods,
              currency: formData.company.settings.currency
            };
            break;
            
          case 3:
            stepData = {
              step: currentStep,
              smtp_server: formData.company.settings.smtpServer,
              sender_email: formData.company.settings.senderEmail,
              whatsapp_key: formData.company.settings.whatsappKey,
              telegram_token: formData.company.settings.telegramToken
            };
            break;
        }

        await api.post('wizard/step', stepData);
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error('Por favor, preencha todos os campos obrigatórios.');
      } else {
        console.error('Erro ao salvar configurações:', error);
        toast.error('Erro ao salvar as configurações. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      formData,
      handleInputChange,
      errors
    };

    switch (currentStep) {
      case 1:
        return <CompanyInfoStep {...stepProps} />;
      case 2:
        return <PaymentSettingsStep {...stepProps} />;
      case 3:
        return <CommunicationSettingsStep {...stepProps} />;
      case 4:
        return <UserPreferencesStep {...stepProps} />;
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