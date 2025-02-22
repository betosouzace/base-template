'use client';
import { Select } from '@/components/ui/Select';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

const UserPreferencesStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <Select
        label="Tema"
        value={formData.user.settings.theme}
        onChange={(e) => handleInputChange('user.settings.theme', e.target.value)}
        options={[
          { value: 'light', label: 'Claro' },
          { value: 'dark', label: 'Escuro' },
          { value: 'semi-dark', label: 'Semi-Escuro' }
        ]}
        fullWidth
      />
      <Select
        label="Densidade"
        value={formData.user.settings.density}
        onChange={(e) => handleInputChange('user.settings.density', e.target.value)}
        options={[
          { value: 'compact', label: 'Compacta' },
          { value: 'normal', label: 'Normal' },
          { value: 'comfortable', label: 'Confortável' }
        ]}
        fullWidth
      />
      <Select
        label="Tamanho da Fonte"
        value={formData.user.settings.fontSize}
        onChange={(e) => handleInputChange('user.settings.fontSize', e.target.value)}
        options={[
          { value: 'small', label: 'Pequena' },
          { value: 'medium', label: 'Média' },
          { value: 'large', label: 'Grande' }
        ]}
        fullWidth
      />
      <ToggleSwitch
        label="Alto Contraste"
        checked={formData.user.settings.highContrast}
        onChange={(checked) => handleInputChange('user.settings.highContrast', checked)}
      />
    </div>
  );
};

export default UserPreferencesStep; 