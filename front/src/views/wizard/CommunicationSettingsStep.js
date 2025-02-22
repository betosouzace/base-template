'use client';
import { Input } from '@/components/ui/Input';

const CommunicationSettingsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Configurações de Comunicação</h2>
      <Input
        label="Servidor SMTP"
        value={formData.company.settings.smtpServer}
        onChange={(e) => handleInputChange('company.settings.smtpServer', e.target.value)}
        fullWidth
      />
      <Input
        label="Email do Remetente"
        type="email"
        value={formData.company.settings.senderEmail}
        onChange={(e) => handleInputChange('company.settings.senderEmail', e.target.value)}
        fullWidth
      />
      <Input
        label="Chave WhatsApp"
        value={formData.company.settings.whatsappKey}
        onChange={(e) => handleInputChange('company.settings.whatsappKey', e.target.value)}
        fullWidth
      />
      <Input
        label="Token Telegram"
        value={formData.company.settings.telegramToken}
        onChange={(e) => handleInputChange('company.settings.telegramToken', e.target.value)}
        fullWidth
      />
    </div>
  );
};

export default CommunicationSettingsStep; 