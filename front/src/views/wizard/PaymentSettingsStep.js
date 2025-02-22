'use client';
import { Select } from '@/components/ui/Select';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

const PaymentSettingsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Configurações de Pagamento</h2>
      <Select
        label="Moeda Principal"
        value={formData.company.settings.currency}
        onChange={(e) => handleInputChange('company.settings.currency', e.target.value)}
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
              checked={formData.company.settings.paymentMethods.includes(method)}
              onChange={(checked) => {
                const newMethods = checked
                  ? [...formData.company.settings.paymentMethods, method]
                  : formData.company.settings.paymentMethods.filter(m => m !== method);
                handleInputChange('company.settings.paymentMethods', newMethods);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsStep; 